import { FONT_KEYS, LIMITS, type FontKey, type PhotoItem, type SiteContent } from '../../src/shared/content.js'

function str(v: unknown, max: number, fallback = ''): string {
  return typeof v === 'string' ? v.slice(0, max) : fallback
}

function strList(v: unknown, maxItems: number, maxLen: number): string[] {
  return Array.isArray(v)
    ? v
        .filter((x): x is string => typeof x === 'string')
        .map((x) => x.trim().slice(0, maxLen))
        .filter(Boolean)
        .slice(0, maxItems)
    : []
}

/** Aceita apenas URLs do Vercel Blob (https) ou caminhos locais do site, nunca esquemas perigosos. */
export function isSafeMediaUrl(url: unknown): url is string {
  if (typeof url !== 'string' || url.length > 2000) return false
  if (url.startsWith('/') && !url.startsWith('//')) return true
  try {
    const u = new URL(url)
    return u.protocol === 'https:' && u.hostname.endsWith('.blob.vercel-storage.com')
  } catch {
    return false
  }
}

/** Valida e normaliza o JSON recebido; lança Error com mensagem em PT-BR se inválido. */
export function validateContent(input: unknown): SiteContent {
  if (!input || typeof input !== 'object') throw new Error('Conteúdo inválido')
  const c = input as Record<string, any>
  const q = c.question ?? {}
  const s = c.success ?? {}

  const startDate = str(c.startDate, 40)
  if (Number.isNaN(new Date(startDate).getTime())) throw new Error('Data de início inválida')

  const photos: PhotoItem[] = (Array.isArray(c.photos) ? c.photos : []).slice(0, LIMITS.maxPhotos).map((p: any) => {
    if (!isSafeMediaUrl(p?.src)) throw new Error('URL de foto inválida')
    return {
      id: str(p.id, 60) || crypto.randomUUID(),
      src: p.src,
      caption: str(p.caption, 120),
      phrase: str(p.phrase, LIMITS.maxPhrase),
    }
  })

  const musicSrc = c.music?.src ?? null
  if (musicSrc !== null && !isSafeMediaUrl(musicSrc)) throw new Error('URL de música inválida')

  const font: FontKey = FONT_KEYS.includes(c.phraseFont) ? c.phraseFont : 'great-vibes'

  return {
    version: 1,
    startDate,
    question: {
      title: str(q.title, 120, 'Quer namorar comigo?'),
      yes: str(q.yes, 30, 'Sim'),
      no: str(q.no, 30, 'Não'),
    },
    taunts: strList(c.taunts, LIMITS.maxTaunts, 120),
    success: {
      title: str(s.title, 120),
      subtitle: str(s.subtitle, 200),
      counterTitle: str(s.counterTitle, 120),
      galleryTitle: str(s.galleryTitle, 120),
      letterTitle: str(s.letterTitle, 120),
      letter: strList(s.letter, LIMITS.maxLetterParagraphs, LIMITS.maxText),
      signature: str(s.signature, 200),
    },
    phraseFont: font,
    photos,
    music: { src: musicSrc, name: str(c.music?.name, 200) },
  }
}

/** URLs de mídia presentes em um conteúdo (para apagar órfãos do Blob). */
export function mediaUrls(c: SiteContent | null): string[] {
  if (!c) return []
  return [...c.photos.map((p) => p.src), ...(c.music.src ? [c.music.src] : [])]
}

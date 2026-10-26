/** Modelo do conteúdo editável no /admin. Compartilhado entre o site, o admin e a API. */

export const FONT_KEYS = ['great-vibes', 'dancing-script', 'parisienne', 'playfair', 'caveat'] as const
export type FontKey = (typeof FONT_KEYS)[number]

export interface FontOption {
  label: string
  family: string
  italic?: boolean
}

/** Fontes disponíveis para as frases das fotos. */
export const FONT_OPTIONS: Record<FontKey, FontOption> = {
  'great-vibes': { label: 'Great Vibes (caligrafia elegante)', family: "'Great Vibes', cursive" },
  'dancing-script': { label: 'Dancing Script (romântica)', family: "'Dancing Script', cursive" },
  parisienne: { label: 'Parisienne (clássica)', family: "'Parisienne', cursive" },
  playfair: { label: 'Playfair Display (itálico sofisticado)', family: "'Playfair Display', serif", italic: true },
  caveat: { label: 'Caveat (escrita à mão)', family: "'Caveat', cursive" },
}

export interface PhotoItem {
  id: string
  src: string
  /** Título curto, aparece sob a foto no carrossel e no quadro. */
  caption: string
  /** Frase/texto escolhido, aparece no quadro ao abrir a foto. */
  phrase: string
}

export interface MusicItem {
  /** URL do arquivo; `null` = sem música. */
  src: string | null
  /** Nome exibido no admin. */
  name: string
}

export interface SiteContent {
  version: 1
  /** Data de início (ISO local, ex.: 2023-06-12T00:00:00). */
  startDate: string
  question: { title: string; yes: string; no: string }
  taunts: string[]
  success: {
    title: string
    subtitle: string
    counterTitle: string
    galleryTitle: string
    letterTitle: string
    letter: string[]
    signature: string
  }
  phraseFont: FontKey
  photos: PhotoItem[]
  music: MusicItem
}

export const LIMITS = {
  maxPhotos: 40,
  maxPhotoBytes: 12 * 1024 * 1024,
  maxMusicBytes: 30 * 1024 * 1024,
  maxText: 600,
  maxPhrase: 400,
  maxTaunts: 40,
  maxLetterParagraphs: 12,
} as const

export interface ContentResponse {
  /** `null` = nada salvo ainda (usar o padrão do site). */
  content: SiteContent | null
  /** Onde os arquivos ficam: blob (Vercel) ou pasta local (npm run dev). */
  storage: 'blob' | 'local'
}

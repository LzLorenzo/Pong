import { del, list, put } from '@vercel/blob'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import type { ContentResponse, SiteContent } from '../src/shared/content.js'
import { bearer, verifyToken } from './_lib/auth.js'
import { mediaUrls, validateContent } from './_lib/validate.js'

const CONTENT_PATH = 'content.json'

async function readContent(): Promise<SiteContent | null> {
  const { blobs } = await list({ prefix: CONTENT_PATH, limit: 1 })
  const blob = blobs.find((b) => b.pathname === CONTENT_PATH)
  if (!blob) return null
  // `v` muda a cada gravação: evita servir versão antiga do cache da CDN.
  const r = await fetch(`${blob.url}?v=${blob.uploadedAt.getTime()}`)
  return r.ok ? ((await r.json()) as SiteContent) : null
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store')

  try {
    if (req.method === 'GET') {
      const body: ContentResponse = { content: await readContent(), storage: 'blob' }
      return res.status(200).json(body)
    }

    if (req.method === 'PUT') {
      if (!verifyToken(bearer(req.headers.authorization))) return res.status(401).json({ error: 'Sessão expirada' })

      const next = validateContent(req.body)
      const previous = await readContent()

      await put(CONTENT_PATH, JSON.stringify(next), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 60,
      })

      // Remove arquivos que não são mais usados (fotos/música substituídas ou apagadas).
      const keep = new Set(mediaUrls(next))
      const orphans = mediaUrls(previous).filter((u) => u.includes('.blob.vercel-storage.com') && !keep.has(u))
      if (orphans.length) await del(orphans).catch(() => undefined)

      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ error: 'Método não permitido' })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Erro interno'
    return res.status(e instanceof Error && /inválid/i.test(message) ? 400 : 500).json({ error: message })
  }
}

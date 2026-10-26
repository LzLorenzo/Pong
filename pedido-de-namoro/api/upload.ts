import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { LIMITS } from '../src/shared/content.js'
import { verifyToken } from './_lib/auth.js'

/** Gera tokens para o navegador enviar fotos/música direto ao Vercel Blob (sem limite de 4,5 MB da função). */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' })

  try {
    const json = await handleUpload({
      request: req,
      body: req.body as HandleUploadBody,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!verifyToken(clientPayload)) throw new Error('Sessão expirada')
        const isMusic = pathname.startsWith('music/')
        return {
          allowedContentTypes: isMusic ? ['audio/*'] : ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          maximumSizeInBytes: isMusic ? LIMITS.maxMusicBytes : LIMITS.maxPhotoBytes,
          addRandomSuffix: true,
        }
      },
    })
    return res.status(200).json(json)
  } catch (e) {
    return res.status(400).json({ error: e instanceof Error ? e.message : 'Falha no upload' })
  }
}

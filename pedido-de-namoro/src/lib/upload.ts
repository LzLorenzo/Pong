import type { ContentResponse } from '../shared/content'

export type MediaKind = 'photo' | 'music'

interface UploadArgs {
  file: Blob
  /** Nome original (usado só para a extensão). */
  filename: string
  kind: MediaKind
  token: string
  storage: ContentResponse['storage']
  onProgress?: (percent: number) => void
}

const extensionOf = (name: string, fallback: string) => name.match(/\.([a-z0-9]{2,5})$/i)?.[1].toLowerCase() ?? fallback

/** Envia um arquivo e devolve a URL pública. Blob (Vercel) em produção; pasta local no `npm run dev`. */
export async function uploadMedia({ file, filename, kind, token, storage, onProgress }: UploadArgs): Promise<string> {
  const ext = extensionOf(filename, kind === 'photo' ? 'jpg' : 'mp3')

  if (storage === 'local') {
    const res = await fetch(`/api/dev-upload?name=${encodeURIComponent(`x.${ext}`)}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: file,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error ?? 'Falha no upload')
    onProgress?.(100)
    return data.url as string
  }

  const { upload } = await import('@vercel/blob/client')
  const blob = await upload(`${kind}/${Date.now()}.${ext}`, file, {
    access: 'public',
    handleUploadUrl: '/api/upload',
    clientPayload: token,
    multipart: file.size > 8 * 1024 * 1024,
    contentType: file instanceof File && file.type ? file.type : undefined,
    onUploadProgress: ({ percentage }) => onProgress?.(percentage),
  })
  return blob.url
}

import type { ContentResponse, SiteContent } from '../shared/content'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init)
  const isJson = res.headers.get('content-type')?.includes('application/json')
  if (!isJson) throw new ApiError('API indisponível neste ambiente', res.status)
  const data = await res.json()
  if (!res.ok) throw new ApiError(data?.error ?? 'Erro na requisição', res.status)
  return data as T
}

export const fetchContent = (signal?: AbortSignal) => request<ContentResponse>('/api/content', { signal })

export async function login(password: string): Promise<string> {
  const { token } = await request<{ token: string }>('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  return token
}

export const saveContent = (content: SiteContent, token: string) =>
  request<{ ok: true }>('/api/content', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(content),
  })

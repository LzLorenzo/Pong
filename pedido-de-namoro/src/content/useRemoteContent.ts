import { useEffect, useState } from 'react'
import { DEFAULT_CONTENT } from '../config'
import { fetchContent } from '../lib/api'
import type { SiteContent } from '../shared/content'

const TIMEOUT_MS = 4000

/** Carrega o conteúdo salvo pelo admin; se a API falhar/demorar, usa o padrão do código. */
export function useRemoteContent(): { content: SiteContent; ready: boolean } {
  const [state, setState] = useState<{ content: SiteContent; ready: boolean }>({ content: DEFAULT_CONTENT, ready: false })

  useEffect(() => {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
    fetchContent(ctrl.signal)
      .then(({ content }) => setState({ content: content ?? DEFAULT_CONTENT, ready: true }))
      .catch(() => setState({ content: DEFAULT_CONTENT, ready: true }))
      .finally(() => clearTimeout(timer))
    return () => {
      clearTimeout(timer)
      ctrl.abort()
    }
  }, [])

  return state
}

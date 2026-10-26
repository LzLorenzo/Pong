import { createContext, useContext } from 'react'
import type { SiteContent } from '../shared/content'

export const ContentContext = createContext<SiteContent | null>(null)

export function useContent(): SiteContent {
  const c = useContext(ContentContext)
  if (!c) throw new Error('useContent fora do ContentProvider')
  return c
}

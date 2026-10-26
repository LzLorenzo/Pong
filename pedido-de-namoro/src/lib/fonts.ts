import type { CSSProperties } from 'react'
import { FONT_OPTIONS, type FontKey } from '../shared/content'

/** Estilo inline (família + itálico) da fonte escolhida para as frases. */
export function phraseStyle(key: FontKey): CSSProperties {
  const f = FONT_OPTIONS[key]
  return { fontFamily: f.family, fontStyle: f.italic ? 'italic' : 'normal' }
}

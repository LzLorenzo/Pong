import { useState } from 'react'
import { inputClass } from './ui'

interface ListAreaProps {
  initial: string[]
  /** Separador entre itens ao digitar: "\n" (uma linha por item) ou "\n\n" (parágrafos). */
  separator: '\n' | '\n\n'
  rows?: number
  onChange: (items: string[]) => void
}

/** Textarea que edita uma lista de textos mantendo o que a pessoa digita (inclusive linhas em branco). */
export function ListArea({ initial, separator, rows = 6, onChange }: ListAreaProps) {
  const [text, setText] = useState(initial.join(separator))
  return (
    <textarea
      className={inputClass}
      rows={rows}
      value={text}
      onChange={(e) => {
        setText(e.target.value)
        const parts = separator === '\n' ? e.target.value.split(/\n+/) : e.target.value.split(/\n{2,}/)
        onChange(parts.map((p) => p.trim()).filter(Boolean))
      }}
    />
  )
}

import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'

interface PhraseTextProps {
  text: string
  style: CSSProperties
}

/** Frase que se revela palavra por palavra, na fonte escolhida no admin. */
export function PhraseText({ text, style }: PhraseTextProps) {
  const words = text.split(/\s+/).filter(Boolean)
  return (
    <p
      className="text-center text-[1.85rem] leading-[1.25] text-kitty-red-dark sm:text-4xl"
      style={style}
      aria-label={text}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="mr-[0.25em] inline-block"
          initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.55 + i * 0.09, duration: 0.5 }}
        >
          {w}
        </motion.span>
      ))}
    </p>
  )
}

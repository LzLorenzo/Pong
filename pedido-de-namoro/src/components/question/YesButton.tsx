import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import type { Ref } from 'react'

interface YesButtonProps {
  ref?: Ref<HTMLDivElement>
  label: string
  /** 1 = tamanho normal; cresce a cada fuga do "Não". */
  scale: number
  onAccept: (origin: { x: number; y: number }) => void
}

/** Wrapper cresce (spring); o botão interno pulsa o tempo todo. */
export function YesButton({ ref, label, scale, onAccept }: YesButtonProps) {
  return (
    <motion.div ref={ref} className="relative z-20" animate={{ scale }} transition={{ type: 'spring', stiffness: 220, damping: 14 }}>
      <motion.button
        type="button"
        className="group relative flex items-center gap-3 rounded-full border-4 border-white bg-linear-to-b from-rose-kitty to-kitty-red px-12 py-4 text-3xl font-bold text-white shadow-candy sm:px-16 sm:text-4xl"
        animate={{ scale: [1, 1.09, 1] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.15, rotate: -2 }}
        whileTap={{ scale: 0.92 }}
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          onAccept({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
        }}
      >
        <span className="absolute inset-x-6 top-1 h-3 rounded-full bg-white/35" aria-hidden="true" />
        <Heart className="fill-white" size={30} aria-hidden="true" />
        {label}
      </motion.button>
    </motion.div>
  )
}

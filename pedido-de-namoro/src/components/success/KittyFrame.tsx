import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { Bow } from '../ui/Bow'
import { KittyFace } from '../ui/KittyFace'

interface KittyFrameProps {
  /** A foto (renderizada dentro da "moldura"). */
  children: ReactNode
}

const FRAME_BG = `radial-gradient(circle, #fff 2.6px, transparent 3.2px) 0 0 / 22px 22px,
  radial-gradient(circle, rgb(255 255 255 / .55) 2px, transparent 2.6px) 11px 11px / 22px 22px,
  linear-gradient(145deg, #ff8fb1, #e8264d)`

const CORNERS = [
  'top-1 left-1 -rotate-12',
  'top-1 right-1 rotate-12',
  'bottom-1 left-1 rotate-12',
  'bottom-1 right-1 -rotate-12',
] as const

const SPARKLES = [
  { cls: '-top-3 -left-6', size: 26, delay: 0 },
  { cls: 'top-1/3 -right-8', size: 20, delay: 0.6 },
  { cls: '-bottom-4 left-1/4', size: 22, delay: 1.1 },
  { cls: 'top-2/3 -left-7', size: 18, delay: 1.7 },
] as const

/**
 * Quadro estilo Hello Kitty: moldura rosa de bolinhas, laço no topo,
 * corações nos cantos, brilhos e a gatinha espiando no canto.
 * A moldura é irmã (não ancestral) da foto para não interferir na animação `layoutId` da imagem.
 */
export function KittyFrame({ children }: KittyFrameProps) {
  return (
    <div className="relative">
      <motion.div
        className="absolute inset-0 rounded-[2rem] border-4 border-white shadow-[0_24px_60px_-12px_rgb(184_23_58/0.55)]"
        style={{ background: FRAME_BG }}
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.12, type: 'spring', stiffness: 200, damping: 18 }}
      />

      <div className="relative p-[15px]">{children}</div>

      {CORNERS.map((pos, i) => (
        <motion.span
          key={pos}
          className={`absolute ${pos} text-white drop-shadow`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.45 + i * 0.08, type: 'spring', stiffness: 400, damping: 12 }}
        >
          <Heart size={22} className="fill-white" aria-hidden="true" />
        </motion.span>
      ))}

      <motion.div
        className="absolute -top-9 left-1/2 w-24 -translate-x-1/2 drop-shadow-lg"
        initial={{ y: -80, scale: 0, rotate: -25, opacity: 0 }}
        animate={{ y: 0, scale: 1, rotate: 0, opacity: 1 }}
        transition={{ delay: 0.35, type: 'spring', stiffness: 260, damping: 11 }}
      >
        <motion.div animate={{ rotate: [-3, 3, -3] }} transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}>
          <Bow />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute -right-5 -bottom-7 w-20 drop-shadow-lg"
        initial={{ y: 40, rotate: 20, opacity: 0 }}
        animate={{ y: 0, rotate: -8, opacity: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 220, damping: 12 }}
      >
        <KittyFace mood="love" />
      </motion.div>

      {SPARKLES.map((s) => (
        <motion.span
          key={s.cls}
          className={`pointer-events-none absolute ${s.cls} text-white drop-shadow-[0_0_6px_rgb(255_92_138/0.9)]`}
          animate={{ scale: [0.6, 1.2, 0.6], rotate: [0, 90, 180], opacity: [0.4, 1, 0.4] }}
          transition={{ delay: s.delay, duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles size={s.size} aria-hidden="true" />
        </motion.span>
      ))}
    </div>
  )
}

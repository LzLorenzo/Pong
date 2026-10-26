import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'
import { Bow } from '../ui/Bow'

type Kind = 'heart' | 'bow' | 'sparkle'

interface Floater {
  id: number
  kind: Kind
  left: number
  size: number
  duration: number
  delay: number
  drift: number
}

const KINDS: Kind[] = ['heart', 'bow', 'heart', 'sparkle']

// Gerado uma única vez (determinístico) para o fundo não "pular" a cada render.
const FLOATERS: Floater[] = Array.from({ length: 18 }, (_, i) => {
  const r = (n: number) => {
    const x = Math.sin(i * 97.13 + n * 13.7) * 10000
    return x - Math.floor(x)
  }
  return {
    id: i,
    kind: KINDS[i % KINDS.length],
    left: r(1) * 100,
    size: 14 + r(2) * 26,
    duration: 14 + r(3) * 14,
    delay: -r(4) * 24,
    drift: (r(5) - 0.5) * 80,
  }
})

function Shape({ kind, size }: { kind: Kind; size: number }) {
  if (kind === 'bow') return <Bow className="opacity-60" color="#ff7a9a" />
  if (kind === 'sparkle') return <Sparkles size={size} className="text-white" strokeWidth={2.4} />
  return <Heart size={size} className="fill-blush-300 text-white/80" strokeWidth={2} />
}

/** Fundo fofo e leve: bolinhas + corações, laços e brilhos flutuando. */
export function Background() {
  return (
    <div className="polka pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {FLOATERS.map((f) => (
        <motion.div
          key={f.id}
          className="absolute bottom-0"
          style={{ left: `${f.left}%`, width: f.kind === 'bow' ? f.size * 1.6 : f.size }}
          initial={{ y: 80, opacity: 0 }}
          animate={{
            y: ['6vh', '-112vh'],
            x: [0, f.drift, -f.drift / 2],
            rotate: [-12, 12, -12],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{ duration: f.duration, delay: f.delay, repeat: Infinity, ease: 'linear' }}
        >
          <Shape kind={f.kind} size={f.size} />
        </motion.div>
      ))}
    </div>
  )
}

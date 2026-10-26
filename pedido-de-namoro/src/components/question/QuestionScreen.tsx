import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { QUESTION, TAUNTS } from '../../config'
import { createBag } from '../../lib/random'
import { KittyFace, type KittyMood } from '../ui/KittyFace'
import { AnimatedTitle } from './AnimatedTitle'
import { EscapingNoButton } from './EscapingNoButton'
import { TauntBubble } from './TauntBubble'
import { YesButton } from './YesButton'

interface QuestionScreenProps {
  onAccept: (origin: { x: number; y: number }) => void
}

const GROWTH_PER_ESCAPE = 0.12
const TAUNT_VISIBLE_MS = 2200

export function QuestionScreen({ onAccept }: QuestionScreenProps) {
  const [escapes, setEscapes] = useState(0)
  const [taunt, setTaunt] = useState<{ id: number; text: string } | null>(null)
  const yesRef = useRef<HTMLDivElement>(null)
  const avoidRefs = useMemo(() => [yesRef], [])
  const nextTaunt = useMemo(() => createBag(TAUNTS), [])

  // Não deixa o "Sim" ocupar mais que ~90% da largura da tela.
  const [maxScale, setMaxScale] = useState(2.4)
  useEffect(() => {
    const update = () => setMaxScale(Math.max(1.2, Math.min(2.4, (window.innerWidth * 0.9) / 230)))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  const yesScale = Math.min(1 + escapes * GROWTH_PER_ESCAPE, maxScale)

  useEffect(() => {
    if (!taunt) return
    const t = setTimeout(() => setTaunt(null), TAUNT_VISIBLE_MS)
    return () => clearTimeout(t)
  }, [taunt])

  const handleEscape = (total: number) => {
    setEscapes(total)
    setTaunt({ id: total, text: nextTaunt() })
  }

  const mood: KittyMood = escapes >= 3 ? 'sad' : 'happy'

  return (
    // Somente `opacity` aqui: transform em ancestral quebraria o `position: fixed` do botão "Não".
    <motion.main
      className="fixed inset-0 flex flex-col items-center justify-center gap-2 overflow-hidden px-4 pb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="animate-float w-36 drop-shadow-[0_10px_14px_rgb(232_38_77/0.25)] sm:w-48"
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 12 }}
      >
        <KittyFace mood={mood} />
      </motion.div>

      <AnimatedTitle text={QUESTION.title} />
      <TauntBubble taunt={taunt} />

      <motion.div
        className="mt-2 flex flex-col items-center gap-8 sm:flex-row sm:gap-14"
        animate={{ paddingBlock: (yesScale - 1) * 26 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      >
        <YesButton ref={yesRef} label={QUESTION.yes} scale={yesScale} onAccept={onAccept} />
        <EscapingNoButton label={QUESTION.no} avoidRefs={avoidRefs} onEscape={handleEscape} />
      </motion.div>
    </motion.main>
  )
}

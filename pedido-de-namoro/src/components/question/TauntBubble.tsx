import { AnimatePresence, motion } from 'framer-motion'

interface TauntBubbleProps {
  /** `id` muda a cada fuga para reanimar a mensagem mesmo se o texto repetir. */
  taunt: { id: number; text: string } | null
}

export function TauntBubble({ taunt }: TauntBubbleProps) {
  return (
    <div className="pointer-events-none flex h-16 items-center justify-center" aria-live="polite">
      <AnimatePresence mode="wait">
        {taunt && (
          <motion.p
            key={taunt.id}
            className="relative max-w-[88vw] rounded-3xl border-4 border-white bg-white/90 px-6 py-2.5 text-center text-lg font-bold text-kitty-red-dark shadow-soft sm:text-2xl"
            initial={{ opacity: 0, scale: 0.4, y: 20, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: [-3, 3, -2, 0] }}
            exit={{ opacity: 0, scale: 0.7, y: -16 }}
            transition={{ type: 'spring', stiffness: 420, damping: 16, rotate: { duration: 0.5 } }}
          >
            {taunt.text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

import { motion } from 'framer-motion'

interface AnimatedTitleProps {
  text: string
}

/** Título que entra palavra por palavra, letra por letra, e depois "respira" em onda. */
export function AnimatedTitle({ text }: AnimatedTitleProps) {
  const words = text.split(' ')
  let index = 0

  return (
    <h1
      aria-label={text}
      className="text-outline font-script flex flex-wrap justify-center gap-x-[0.3em] px-2 text-center text-5xl leading-[1.35] text-kitty-red sm:text-7xl md:text-8xl"
    >
      {words.map((word, w) => (
        <span key={w} aria-hidden="true" className="inline-flex">
          {[...word].map((char) => {
            const i = index++
            return (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 40, scale: 0.4, rotate: -12 }}
                animate={{ opacity: 1, y: [0, -7, 0], scale: 1, rotate: 0 }}
                transition={{
                  opacity: { delay: 0.2 + i * 0.045, duration: 0.3 },
                  scale: { delay: 0.2 + i * 0.045, type: 'spring', stiffness: 380, damping: 14 },
                  rotate: { delay: 0.2 + i * 0.045, type: 'spring', stiffness: 380, damping: 14 },
                  y: { delay: 1.4 + i * 0.07, duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
                }}
              >
                {char}
              </motion.span>
            )
          })}
        </span>
      ))}
    </h1>
  )
}

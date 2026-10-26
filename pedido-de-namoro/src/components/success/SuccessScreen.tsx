import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useContent } from '../../content/ContentContext'
import { startHeartRain } from '../../lib/celebration'
import { KittyFace } from '../ui/KittyFace'
import { LoveLetter } from './LoveLetter'
import { PhotoGallery } from './PhotoGallery'
import { SoundToggle } from './SoundToggle'
import { TimeCounter } from './TimeCounter'

interface SuccessScreenProps {
  /** Ponto (em px da viewport) de onde a transição circular se expande. */
  origin: { x: number; y: number }
  hasMusic: boolean
  musicPlaying: boolean
  onToggleMusic: () => void
  onRevealed: () => void
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 16 } },
}

export function SuccessScreen({ origin, hasMusic, musicPlaying, onToggleMusic, onRevealed }: SuccessScreenProps) {
  const { success } = useContent()
  useEffect(() => startHeartRain(), [])

  const at = `${origin.x}px ${origin.y}px`

  return (
    <motion.div
      data-scroll-root
      className="polka fixed inset-0 z-50 overflow-y-auto overflow-x-hidden"
      initial={{ clipPath: `circle(0px at ${at})` }}
      animate={{ clipPath: `circle(150vmax at ${at})` }}
      transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
      onAnimationComplete={onRevealed}
    >
      {hasMusic && <SoundToggle playing={musicPlaying} onToggle={onToggleMusic} />}

      <motion.div
        className="mx-auto flex w-full max-w-3xl flex-col items-center gap-10 px-4 pt-10 pb-16 sm:gap-14 sm:pt-14"
        initial="hidden"
        animate="show"
        transition={{ delayChildren: 0.6, staggerChildren: 0.25 }}
      >
        <motion.header variants={fadeUp} className="flex flex-col items-center gap-2 text-center">
          <motion.div
            className="animate-float w-32 drop-shadow-[0_10px_14px_rgb(232_38_77/0.25)] sm:w-44"
            initial={{ scale: 0, rotate: 40 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.7, type: 'spring', stiffness: 220, damping: 10 }}
          >
            <KittyFace mood="love" />
          </motion.div>
          <h1 className="text-outline font-script text-5xl leading-tight text-kitty-red sm:text-7xl">{success.title}</h1>
          <p className="text-xl font-bold text-ink/80 sm:text-2xl">{success.subtitle}</p>
        </motion.header>

        <motion.div variants={fadeUp} className="w-full">
          <TimeCounter />
        </motion.div>
        <motion.div variants={fadeUp} className="w-full">
          <LoveLetter />
        </motion.div>
        <motion.div variants={fadeUp} className="w-full">
          <PhotoGallery />
        </motion.div>

        <p className="font-script text-lg text-kitty-red-dark/80">feito com 💖</p>
      </motion.div>
    </motion.div>
  )
}

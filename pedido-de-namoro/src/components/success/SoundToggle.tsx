import { motion } from 'framer-motion'
import { Music, VolumeX } from 'lucide-react'

interface SoundToggleProps {
  playing: boolean
  onToggle: () => void
}

export function SoundToggle({ playing, onToggle }: SoundToggleProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label={playing ? 'Pausar música' : 'Tocar música'}
      className="fixed top-4 right-4 z-[70] grid size-12 place-items-center rounded-full border-4 border-white bg-rose-kitty text-white shadow-soft"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: 'spring' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {playing ? (
        <motion.span animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 1.2, repeat: Infinity }}>
          <Music size={22} />
        </motion.span>
      ) : (
        <VolumeX size={22} />
      )}
    </motion.button>
  )
}

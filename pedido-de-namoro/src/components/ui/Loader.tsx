import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

export function Loader() {
  return (
    <div className="fixed inset-0 grid place-items-center" role="status" aria-label="Carregando">
      <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}>
        <Heart size={56} className="fill-rose-kitty text-white drop-shadow-lg" />
      </motion.div>
    </div>
  )
}

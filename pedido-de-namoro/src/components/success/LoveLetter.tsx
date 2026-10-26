import { motion } from 'framer-motion'
import { SUCCESS } from '../../config'
import { Bow } from '../ui/Bow'

export function LoveLetter() {
  return (
    <motion.article
      className="relative w-full rounded-[2rem] border-4 border-white bg-white/85 px-6 pt-12 pb-8 text-center shadow-soft sm:px-12"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
    >
      <Bow className="absolute -top-7 left-1/2 w-20 -translate-x-1/2 drop-shadow-md" />
      <h2 className="mb-4 font-script text-3xl text-kitty-red sm:text-4xl">{SUCCESS.letterTitle}</h2>
      <div className="space-y-4 text-lg leading-relaxed font-medium text-ink sm:text-xl">
        {SUCCESS.letter.map((p, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 * i, duration: 0.8 }}
          >
            {p}
          </motion.p>
        ))}
      </div>
      <p className="mt-6 font-script text-xl whitespace-pre-line text-kitty-red-dark sm:text-2xl">{SUCCESS.signature}</p>
    </motion.article>
  )
}

import { AnimatePresence, motion } from 'framer-motion'
import { intervalToDuration } from 'date-fns'
import { Heart } from 'lucide-react'
import { useContent } from '../../content/ContentContext'
import { useNow } from '../../hooks/useNow'

interface UnitProps {
  value: number
  singular: string
  plural: string
  big?: boolean
}

function Unit({ value, singular, plural, big = false }: UnitProps) {
  return (
    <div
      className={`flex flex-col items-center rounded-3xl border-4 border-white bg-white/80 shadow-soft ${
        big ? 'min-w-[5.5rem] px-4 py-3 sm:min-w-32 sm:px-6 sm:py-4' : 'min-w-[4.5rem] px-3 py-2 sm:min-w-24'
      }`}
    >
      <div className={`relative h-[1.2em] overflow-hidden font-script tabular-nums text-kitty-red ${big ? 'text-4xl sm:text-6xl' : 'text-2xl sm:text-4xl'}`}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            className="block text-center leading-[1.2]"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-xs font-bold tracking-wide text-ink/70 uppercase sm:text-sm">{value === 1 ? singular : plural}</span>
    </div>
  )
}

export function TimeCounter() {
  const { startDate, success } = useContent()
  const start = new Date(startDate)
  const now = useNow(1000)
  // Se a data cair no futuro, mostra zeros em vez de quebrar.
  const d = intervalToDuration({ start, end: now < start ? start : now })

  return (
    <section className="flex w-full flex-col items-center gap-4" aria-label="Tempo juntos">
      <h2 className="flex items-center gap-2 text-center font-script text-2xl text-kitty-red-dark sm:text-3xl">
        <Heart className="fill-rose-kitty text-rose-kitty" size={22} aria-hidden="true" />
        {success.counterTitle}
        <Heart className="fill-rose-kitty text-rose-kitty" size={22} aria-hidden="true" />
      </h2>
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        <Unit big value={d.years ?? 0} singular="ano" plural="anos" />
        <Unit big value={d.months ?? 0} singular="mês" plural="meses" />
        <Unit big value={d.days ?? 0} singular="dia" plural="dias" />
      </div>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        <Unit value={d.hours ?? 0} singular="hora" plural="horas" />
        <Unit value={d.minutes ?? 0} singular="minuto" plural="minutos" />
        <Unit value={d.seconds ?? 0} singular="segundo" plural="segundos" />
      </div>
    </section>
  )
}

import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { phraseStyle } from '../../lib/fonts'
import { burstHearts } from '../../lib/celebration'
import type { FontKey, PhotoItem } from '../../shared/content'
import { KittyFrame } from './KittyFrame'
import { PhraseText } from './PhraseText'

interface PhotoLightboxProps {
  photos: readonly PhotoItem[]
  /** Índice da foto aberta a partir do carrossel. */
  startIndex: number
  font: FontKey
  /** Elemento rolável da tela de sucesso, travado enquanto o quadro está aberto. */
  onClose: (lastIndex: number) => void
}

const SWIPE_PX = 60

export function PhotoLightbox({ photos, startIndex, font, onClose }: PhotoLightboxProps) {
  const [index, setIndex] = useState(startIndex)
  const [dir, setDir] = useState<1 | -1>(1)
  const [navigated, setNavigated] = useState(false)
  const photo = photos[index]
  const style = phraseStyle(font)

  const go = useCallback(
    (step: 1 | -1) => {
      setDir(step)
      setNavigated(true)
      setIndex((i) => (i + step + photos.length) % photos.length)
    },
    [photos.length],
  )
  const close = useCallback(() => onClose(index), [onClose, index])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close, go])

  // Trava a rolagem da tela de sucesso e dispara os corações ao abrir.
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-scroll-root]')
    const prev = root?.style.overflowY ?? ''
    if (root) root.style.overflowY = 'hidden'
    const t = setTimeout(() => burstHearts(0.5, 0.45), 350)
    return () => {
      clearTimeout(t)
      if (root) root.style.overflowY = prev
    }
  }, [])

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden px-4"
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption || 'Foto'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onPanEnd={(_, info) => {
        if (info.offset.x > SWIPE_PX) go(-1)
        else if (info.offset.x < -SWIPE_PX) go(1)
      }}
      style={{ touchAction: 'pan-y' }}
    >
      {/* fundo desfocado */}
      <button
        type="button"
        aria-label="Fechar"
        onClick={close}
        className="absolute inset-0 -z-10 bg-blush-200/80 backdrop-blur-xl"
      />

      <button
        type="button"
        onClick={close}
        aria-label="Fechar foto"
        className="absolute top-4 right-4 grid size-12 place-items-center rounded-full border-4 border-white bg-rose-kitty text-white shadow-soft transition-transform hover:scale-110 active:scale-90"
      >
        <X size={22} />
      </button>

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-4 py-1 text-sm font-bold text-kitty-red-dark">
        {index + 1} / {photos.length}
      </p>

      {photos.length > 1 &&
        ([[-1, ChevronLeft, 'left-2 sm:left-8', 'Foto anterior'], [1, ChevronRight, 'right-2 sm:right-8', 'Próxima foto']] as const).map(
          ([step, Icon, side, label]) => (
            <button
              key={step}
              type="button"
              aria-label={label}
              onClick={() => go(step)}
              className={`absolute top-1/2 ${side} z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-rose-kitty/95 text-white shadow-soft transition-transform hover:scale-110 active:scale-90`}
            >
              <Icon size={22} />
            </button>
          ),
        )}

      <div style={{ width: 'min(86vw, 25rem, calc((100dvh - 17rem) * 0.8))' }}>
        <KittyFrame>
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.img
              key={photo.id}
              // O voo "do carrossel até o quadro" só vale para a foto clicada.
              layoutId={!navigated && index === startIndex ? `photo-${photo.id}` : undefined}
              src={photo.src}
              alt={photo.caption || 'Foto do casal'}
              draggable={false}
              className="aspect-4/5 w-full rounded-[1.25rem] border-[5px] border-white bg-blush-200 object-cover shadow-inner"
              custom={dir}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 70, rotate: d * 4 }),
                center: { opacity: 1, x: 0, rotate: 0 },
                exit: (d: number) => ({ opacity: 0, x: d * -70, rotate: d * -4 }),
              }}
              initial={navigated ? 'enter' : false}
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            />
          </AnimatePresence>
        </KittyFrame>
      </div>

      <div className="mt-9 flex min-h-32 w-full max-w-md flex-col items-center gap-2 px-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={photo.id}
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
          >
            {photo.caption && (
              <motion.h3
                className="font-script text-xl text-kitty-red"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {photo.caption}
              </motion.h3>
            )}
            {photo.phrase && <PhraseText text={photo.phrase} style={style} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>,
    document.body,
  )
}

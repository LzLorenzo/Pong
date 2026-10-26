import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart, ImageOff, Maximize2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useContent } from '../../content/ContentContext'
import type { PhotoItem } from '../../shared/content'
import { PhotoLightbox } from './PhotoLightbox'

function PolaroidImage({ photo }: { photo: PhotoItem }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="grid aspect-4/5 w-full place-items-center rounded-xl bg-linear-to-br from-blush-200 to-blush-300 text-white">
        <div className="flex flex-col items-center gap-2 text-center font-bold">
          <ImageOff size={36} aria-hidden="true" />
          <span className="px-4 text-sm">Foto indisponível</span>
        </div>
      </div>
    )
  }
  return (
    <motion.img
      layoutId={`photo-${photo.id}`}
      src={photo.src}
      alt={photo.caption || 'Foto do casal'}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
      className="aspect-4/5 w-full rounded-xl bg-blush-200 object-cover"
    />
  )
}

export function PhotoGallery() {
  const { photos, success, phraseFont } = useContent()
  const autoplay = useMemo(() => Autoplay({ delay: 3800, stopOnInteraction: false, stopOnMouseEnter: true }), [])
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: 'center', skipSnaps: false }, [autoplay])
  const [selected, setSelected] = useState(0)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!embla) return
    const onSelect = () => setSelected(embla.selectedScrollSnap())
    embla.on('select', onSelect).on('reInit', onSelect)
    onSelect()
    return () => {
      embla.off('select', onSelect).off('reInit', onSelect)
    }
  }, [embla])

  // Pausa o autoplay com o quadro aberto.
  useEffect(() => {
    const plugin = embla?.plugins().autoplay
    if (!plugin) return
    if (openIndex === null) plugin.play()
    else plugin.stop()
  }, [embla, openIndex])

  const prev = useCallback(() => embla?.scrollPrev(), [embla])
  const next = useCallback(() => embla?.scrollNext(), [embla])
  const closeLightbox = useCallback(
    (lastIndex: number) => {
      embla?.scrollTo(lastIndex, true)
      setOpenIndex(null)
    },
    [embla],
  )

  if (photos.length === 0) return null

  return (
    <section className="w-full" aria-roledescription="carrossel" aria-label={success.galleryTitle}>
      <h2 className="mb-5 flex items-center justify-center gap-2 text-center font-script text-3xl text-kitty-red sm:text-4xl">
        <Heart className="fill-rose-kitty text-rose-kitty" size={24} aria-hidden="true" />
        {success.galleryTitle}
        <Heart className="fill-rose-kitty text-rose-kitty" size={24} aria-hidden="true" />
      </h2>

      <div className="relative">
        <div className="overflow-hidden px-1 py-6" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {photos.map((photo, i) => {
              const active = i === selected
              return (
                <div key={photo.id} className="min-w-0 flex-[0_0_72%] px-2 sm:flex-[0_0_46%] md:flex-[0_0_34%]">
                  <motion.figure
                    className="rounded-2xl border-4 border-white bg-white p-3 pb-4 shadow-soft"
                    animate={{ scale: active ? 1 : 0.88, rotate: active ? 0 : i % 2 ? 3 : -3, opacity: active ? 1 : 0.7 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    <button
                      type="button"
                      className="group relative block w-full"
                      aria-label={active ? `Abrir foto: ${photo.caption}` : `Ir para a foto: ${photo.caption}`}
                      onClick={() => (active ? setOpenIndex(i) : embla?.scrollTo(i))}
                    >
                      <PolaroidImage photo={photo} />
                      {active && (
                        <span className="absolute right-2 bottom-2 grid size-9 place-items-center rounded-full border-2 border-white bg-rose-kitty/90 text-white shadow-md transition-transform group-hover:scale-110">
                          <Maximize2 size={16} aria-hidden="true" />
                        </span>
                      )}
                    </button>
                    <figcaption className="mt-3 text-center font-script text-lg text-kitty-red-dark">{photo.caption}</figcaption>
                  </motion.figure>
                </div>
              )
            })}
          </div>
        </div>

        {([['prev', prev, ChevronLeft, 'left-0'], ['next', next, ChevronRight, 'right-0']] as const).map(([key, fn, Icon, side]) => (
          <button
            key={key}
            type="button"
            onClick={fn}
            aria-label={key === 'prev' ? 'Foto anterior' : 'Próxima foto'}
            className={`absolute top-1/2 ${side} z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-rose-kitty text-white shadow-soft transition-transform hover:scale-110 active:scale-90`}
          >
            <Icon size={22} />
          </button>
        ))}
      </div>

      <div className="mt-2 flex justify-center gap-2" role="tablist" aria-label="Escolher foto">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            role="tab"
            aria-selected={i === selected}
            aria-label={`Ir para a foto ${i + 1}`}
            onClick={() => embla?.scrollTo(i)}
            className={`h-3 rounded-full transition-all ${i === selected ? 'w-8 bg-kitty-red' : 'w-3 bg-blush-300'}`}
          />
        ))}
      </div>
      <p className="mt-3 text-center text-sm font-semibold text-ink/60">Toque na foto para abrir ✨</p>

      <AnimatePresence>
        {openIndex !== null && (
          <PhotoLightbox photos={photos} startIndex={openIndex} font={phraseFont} onClose={closeLightbox} />
        )}
      </AnimatePresence>
    </section>
  )
}

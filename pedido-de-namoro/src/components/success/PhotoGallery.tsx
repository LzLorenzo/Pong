import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart, ImageOff } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { PHOTOS, SUCCESS, type Photo } from '../../config'

function PolaroidImage({ photo }: { photo: Photo }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="grid aspect-4/5 w-full place-items-center rounded-xl bg-linear-to-br from-blush-200 to-blush-300 text-white">
        <div className="flex flex-col items-center gap-2 text-center font-bold">
          <ImageOff size={36} aria-hidden="true" />
          <span className="px-4 text-sm">Coloque sua foto em /public</span>
        </div>
      </div>
    )
  }
  return (
    <img
      src={photo.src}
      alt={photo.alt}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
      className="aspect-4/5 w-full rounded-xl bg-blush-200 object-cover"
    />
  )
}

export function PhotoGallery() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: 'center', skipSnaps: false }, [
    Autoplay({ delay: 3800, stopOnInteraction: false, stopOnMouseEnter: true }),
  ])
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (!embla) return
    const onSelect = () => setSelected(embla.selectedScrollSnap())
    embla.on('select', onSelect).on('reInit', onSelect)
    onSelect()
    return () => {
      embla.off('select', onSelect).off('reInit', onSelect)
    }
  }, [embla])

  const prev = useCallback(() => embla?.scrollPrev(), [embla])
  const next = useCallback(() => embla?.scrollNext(), [embla])

  return (
    <section className="w-full" aria-roledescription="carrossel" aria-label={SUCCESS.galleryTitle}>
      <h2 className="mb-5 flex items-center justify-center gap-2 text-center font-script text-3xl text-kitty-red sm:text-4xl">
        <Heart className="fill-rose-kitty text-rose-kitty" size={24} aria-hidden="true" />
        {SUCCESS.galleryTitle}
        <Heart className="fill-rose-kitty text-rose-kitty" size={24} aria-hidden="true" />
      </h2>

      <div className="relative">
        <div className="overflow-hidden px-1 py-6" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {PHOTOS.map((photo, i) => {
              const active = i === selected
              return (
                <div key={photo.src} className="min-w-0 flex-[0_0_72%] px-2 sm:flex-[0_0_46%] md:flex-[0_0_34%]">
                  <motion.figure
                    className="rounded-2xl border-4 border-white bg-white p-3 pb-4 shadow-soft"
                    animate={{ scale: active ? 1 : 0.88, rotate: active ? 0 : i % 2 ? 3 : -3, opacity: active ? 1 : 0.7 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    <PolaroidImage photo={photo} />
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
        {PHOTOS.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            role="tab"
            aria-selected={i === selected}
            aria-label={`Ir para a foto ${i + 1}`}
            onClick={() => embla?.scrollTo(i)}
            className={`h-3 rounded-full transition-all ${i === selected ? 'w-8 bg-kitty-red' : 'w-3 bg-blush-300'}`}
          />
        ))}
      </div>
    </section>
  )
}

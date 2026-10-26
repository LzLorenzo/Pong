import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowUp, ImagePlus, Trash2 } from 'lucide-react'
import { useRef, useState, type DragEvent } from 'react'
import { phraseStyle } from '../lib/fonts'
import { compressImage } from '../lib/image'
import { uploadMedia } from '../lib/upload'
import { FONT_KEYS, FONT_OPTIONS, LIMITS, type ContentResponse, type FontKey, type PhotoItem } from '../shared/content'
import { Section, buttonClass, ghostButtonClass, inputClass } from './ui'

interface PhotosEditorProps {
  photos: PhotoItem[]
  font: FontKey
  token: string
  storage: ContentResponse['storage']
  onPhotos: (update: (prev: PhotoItem[]) => PhotoItem[]) => void
  onFont: (font: FontKey) => void
  onError: (message: string) => void
}

interface Pending {
  key: string
  name: string
  percent: number
}

const SAMPLE = 'Com você, até o silêncio é feliz.'

export function PhotosEditor({ photos, font, token, storage, onPhotos, onFont, onError }: PhotosEditorProps) {
  const [pending, setPending] = useState<Pending[]>([])
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const update = (id: string, patch: Partial<PhotoItem>) =>
    onPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))

  const move = (from: number, to: number) => {
    if (to < 0 || to >= photos.length) return
    onPhotos((prev) => {
      const next = [...prev]
      next.splice(to, 0, next.splice(from, 1)[0])
      return next
    })
  }

  const addFiles = async (files: FileList | File[]) => {
    const list = [...files].filter((f) => f.type.startsWith('image/'))
    if (list.length < [...files].length) onError('Alguns arquivos não são imagens e foram ignorados.')
    if (photos.length + list.length > LIMITS.maxPhotos) {
      return onError(`Limite de ${LIMITS.maxPhotos} fotos.`)
    }

    for (const file of list) {
      const key = crypto.randomUUID()
      setPending((p) => [...p, { key, name: file.name, percent: 0 }])
      try {
        const blob = await compressImage(file)
        const src = await uploadMedia({
          file: blob,
          filename: 'foto.jpg',
          kind: 'photo',
          token,
          storage,
          onProgress: (percent) => setPending((p) => p.map((x) => (x.key === key ? { ...x, percent } : x))),
        })
        onPhotos((prev) => [...prev, { id: crypto.randomUUID(), src, caption: '', phrase: '' }])
      } catch (e) {
        onError(e instanceof Error ? e.message : 'Falha no upload')
      } finally {
        setPending((p) => p.filter((x) => x.key !== key))
      }
    }
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    void addFiles(e.dataTransfer.files)
  }

  return (
    <Section title="Fotos" hint="Envie quantas quiser. Cada foto abre num quadro da Hello Kitty com o título e a frase abaixo.">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`flex flex-col items-center gap-3 rounded-3xl border-4 border-dashed p-6 text-center transition ${
          dragOver ? 'border-rose-kitty bg-blush-100' : 'border-blush-300 bg-blush-50'
        }`}
      >
        <ImagePlus size={36} className="text-rose-kitty" aria-hidden="true" />
        <p className="text-sm font-semibold text-ink/70">Arraste as fotos aqui ou escolha da galeria</p>
        <button type="button" className={buttonClass} onClick={() => inputRef.current?.click()}>
          Escolher fotos
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            if (e.target.files) void addFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {pending.map((p) => (
        <div key={p.key} className="rounded-2xl bg-blush-100 p-3 text-sm font-semibold">
          <div className="mb-1 truncate">Enviando {p.name}…</div>
          <div className="h-2 overflow-hidden rounded-full bg-white">
            <motion.div className="h-full bg-rose-kitty" animate={{ width: `${p.percent}%` }} />
          </div>
        </div>
      ))}

      <div role="group" aria-labelledby="font-label" className="flex flex-col gap-1.5">
        <span id="font-label" className="text-sm font-bold text-kitty-red-dark">
          Fonte das frases
        </span>
        <div className="grid gap-2 sm:grid-cols-2">
          {FONT_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onFont(key)}
              className={`rounded-2xl border-2 px-4 py-3 text-left transition ${
                font === key ? 'border-rose-kitty bg-blush-100 ring-4 ring-blush-200' : 'border-blush-300 bg-white'
              }`}
            >
              <span className="block text-xs font-bold text-ink/60">{FONT_OPTIONS[key].label}</span>
              <span className="block text-2xl text-kitty-red-dark" style={phraseStyle(key)}>
                {SAMPLE}
              </span>
            </button>
          ))}
        </div>
        <span className="text-xs font-medium text-ink/60">Usada nas frases que aparecem no quadro de cada foto.</span>
      </div>

      <ul className="flex flex-col gap-4">
        <AnimatePresence initial={false}>
          {photos.map((photo, i) => (
            <motion.li
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex gap-3 rounded-3xl border-2 border-blush-200 bg-white p-3 sm:gap-4"
            >
              <img src={photo.src} alt="" className="aspect-4/5 w-24 shrink-0 rounded-2xl bg-blush-100 object-cover sm:w-32" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <input
                  className={inputClass}
                  placeholder="Título (ex.: Nosso começo)"
                  maxLength={120}
                  value={photo.caption}
                  onChange={(e) => update(photo.id, { caption: e.target.value })}
                />
                <textarea
                  className={inputClass}
                  placeholder="Frase que aparece no quadro…"
                  rows={3}
                  maxLength={LIMITS.maxPhrase}
                  value={photo.phrase}
                  onChange={(e) => update(photo.id, { phrase: e.target.value })}
                  style={{ ...phraseStyle(font), fontSize: '1.25rem' }}
                />
                <div className="flex items-center gap-2">
                  <button type="button" className={ghostButtonClass} onClick={() => move(i, i - 1)} disabled={i === 0} aria-label="Mover para cima">
                    <ArrowUp size={16} />
                  </button>
                  <button type="button" className={ghostButtonClass} onClick={() => move(i, i + 1)} disabled={i === photos.length - 1} aria-label="Mover para baixo">
                    <ArrowDown size={16} />
                  </button>
                  <button
                    type="button"
                    className={`${ghostButtonClass} ml-auto text-kitty-red`}
                    onClick={() => onPhotos((prev) => prev.filter((p) => p.id !== photo.id))}
                    aria-label="Remover foto"
                  >
                    <Trash2 size={16} /> Remover
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {photos.length === 0 && pending.length === 0 && <p className="text-center text-sm font-semibold text-ink/60">Nenhuma foto ainda.</p>}
    </Section>
  )
}

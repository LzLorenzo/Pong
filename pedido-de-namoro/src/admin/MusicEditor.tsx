import { Music, RotateCcw, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { DEFAULT_CONTENT } from '../config'
import { uploadMedia } from '../lib/upload'
import { LIMITS, type ContentResponse, type MusicItem } from '../shared/content'
import { Section, buttonClass, ghostButtonClass } from './ui'

interface MusicEditorProps {
  music: MusicItem
  token: string
  storage: ContentResponse['storage']
  onChange: (music: MusicItem) => void
  onError: (message: string) => void
}

export function MusicEditor({ music, token, storage, onChange, onError }: MusicEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [percent, setPercent] = useState<number | null>(null)

  const pick = async (file: File) => {
    if (!file.type.startsWith('audio/')) return onError('Escolha um arquivo de áudio (MP3).')
    if (file.size > LIMITS.maxMusicBytes) return onError(`Arquivo muito grande (máx. ${LIMITS.maxMusicBytes / 1024 / 1024} MB).`)
    setPercent(0)
    try {
      const src = await uploadMedia({ file, filename: file.name, kind: 'music', token, storage, onProgress: setPercent })
      onChange({ src, name: file.name })
    } catch (e) {
      onError(e instanceof Error ? e.message : 'Falha no upload')
    } finally {
      setPercent(null)
    }
  }

  return (
    <Section title="Música" hint="Toca em loop quando ela disser “Sim”. Qualquer MP3 funciona.">
      <div className="flex flex-col gap-3 rounded-2xl bg-blush-50 p-4">
        <p className="flex items-center gap-2 text-sm font-bold text-kitty-red-dark">
          <Music size={18} aria-hidden="true" />
          {music.src ? music.name || 'Música atual' : 'Sem música'}
        </p>
        {music.src && <audio key={music.src} src={music.src} controls className="w-full" preload="none" />}
      </div>

      {percent !== null && (
        <div className="h-2 overflow-hidden rounded-full bg-blush-100" role="progressbar" aria-valuenow={Math.round(percent)}>
          <div className="h-full bg-rose-kitty transition-all" style={{ width: `${percent}%` }} />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button type="button" className={buttonClass} disabled={percent !== null} onClick={() => inputRef.current?.click()}>
          <Upload size={18} /> {percent !== null ? 'Enviando…' : 'Trocar música'}
        </button>
        <button type="button" className={ghostButtonClass} onClick={() => onChange(DEFAULT_CONTENT.music)}>
          <RotateCcw size={16} /> Música padrão
        </button>
        <button type="button" className={`${ghostButtonClass} text-kitty-red`} onClick={() => onChange({ src: null, name: '' })}>
          <Trash2 size={16} /> Sem música
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="audio/mpeg,audio/*,.mp3"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) void pick(f)
            e.target.value = ''
          }}
        />
      </div>
    </Section>
  )
}

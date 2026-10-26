import { useCallback, useState } from 'react'
import useSound from 'use-sound'
import { MUSIC_VOLUME } from '../config'

// Fonte "vazia" para quando não há música (evita erro do Howler com src vazio).
const SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA='

/** Música de fundo em loop. `start()` deve ser chamado dentro de um gesto do usuário (clique no "Sim"). */
export function useLoveMusic(src: string | null) {
  const [playing, setPlaying] = useState(false)
  const [play, { sound, stop }] = useSound(src ?? SILENT_WAV, {
    loop: true,
    volume: MUSIC_VOLUME,
    interrupt: true,
    soundEnabled: src !== null,
    onplayerror: () => setPlaying(false),
  })

  const start = useCallback(() => {
    play()
    setPlaying(true)
  }, [play])

  const toggle = useCallback(() => {
    if (playing) {
      sound?.pause()
      setPlaying(false)
    } else if (sound) {
      sound.play()
      setPlaying(true)
    } else {
      start()
    }
  }, [playing, sound, start])

  return { playing, start, toggle, stop }
}

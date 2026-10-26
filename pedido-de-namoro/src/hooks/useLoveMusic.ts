import { useCallback, useState } from 'react'
import useSound from 'use-sound'
import { MUSIC_SRC, MUSIC_VOLUME } from '../config'

/** Música de fundo em loop. `start()` deve ser chamado dentro de um gesto do usuário (clique no "Sim"). */
export function useLoveMusic() {
  const [playing, setPlaying] = useState(false)
  const [play, { sound, stop }] = useSound(MUSIC_SRC, {
    loop: true,
    volume: MUSIC_VOLUME,
    interrupt: true,
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

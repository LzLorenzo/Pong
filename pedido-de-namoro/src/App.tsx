import { useState } from 'react'
import { Background } from './components/layout/Background'
import { QuestionScreen } from './components/question/QuestionScreen'
import { SuccessScreen } from './components/success/SuccessScreen'
import { useLoveMusic } from './hooks/useLoveMusic'

interface Origin {
  x: number
  y: number
}

export default function App() {
  const [origin, setOrigin] = useState<Origin | null>(null)
  const [revealed, setRevealed] = useState(false)
  const music = useLoveMusic()

  const accept = (from: Origin) => {
    music.start() // precisa estar dentro do clique para o navegador liberar o áudio
    setOrigin(from)
  }

  return (
    <>
      <Background />
      {/* Sai da árvore só depois que a transição circular cobre a tela. */}
      {!revealed && <QuestionScreen onAccept={accept} />}
      {origin && (
        <SuccessScreen
          origin={origin}
          musicPlaying={music.playing}
          onToggleMusic={music.toggle}
          onRevealed={() => setRevealed(true)}
        />
      )}
    </>
  )
}

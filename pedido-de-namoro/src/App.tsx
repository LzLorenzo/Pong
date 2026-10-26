import { lazy, Suspense, useState } from 'react'
import { Background } from './components/layout/Background'
import { QuestionScreen } from './components/question/QuestionScreen'
import { SuccessScreen } from './components/success/SuccessScreen'
import { ContentContext } from './content/ContentContext'
import { useRemoteContent } from './content/useRemoteContent'
import { useLoveMusic } from './hooks/useLoveMusic'
import { Loader } from './components/ui/Loader'

const AdminPage = lazy(() => import('./admin/AdminPage'))

interface Origin {
  x: number
  y: number
}

function Site() {
  const { content, ready } = useRemoteContent()
  const [origin, setOrigin] = useState<Origin | null>(null)
  const [revealed, setRevealed] = useState(false)
  const music = useLoveMusic(content.music.src)

  const accept = (from: Origin) => {
    music.start() // precisa estar dentro do clique para o navegador liberar o áudio
    setOrigin(from)
  }

  return (
    <ContentContext.Provider value={content}>
      <Background />
      {!ready ? (
        <Loader />
      ) : (
        <>
          {/* Sai da árvore só depois que a transição circular cobre a tela. */}
          {!revealed && <QuestionScreen onAccept={accept} />}
          {origin && (
            <SuccessScreen
              origin={origin}
              hasMusic={content.music.src !== null}
              musicPlaying={music.playing}
              onToggleMusic={music.toggle}
              onRevealed={() => setRevealed(true)}
            />
          )}
        </>
      )}
    </ContentContext.Provider>
  )
}

const isAdminRoute = () => /\/admin\/?$/.test(window.location.pathname)

export default function App() {
  if (isAdminRoute()) {
    return (
      <Suspense fallback={<Loader />}>
        <AdminPage />
      </Suspense>
    )
  }
  return <Site />
}

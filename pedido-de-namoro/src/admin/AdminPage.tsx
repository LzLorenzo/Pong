import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, ExternalLink, LogOut, Save, TriangleAlert } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { KittyFace } from '../components/ui/KittyFace'
import { Loader } from '../components/ui/Loader'
import { DEFAULT_CONTENT } from '../config'
import { ApiError, fetchContent, saveContent } from '../lib/api'
import type { ContentResponse, SiteContent } from '../shared/content'
import { LoginForm } from './LoginForm'
import { MusicEditor } from './MusicEditor'
import { PhotosEditor } from './PhotosEditor'
import { TextsEditor } from './TextsEditor'
import { buttonClass, ghostButtonClass } from './ui'

const TOKEN_KEY = 'admin-token'

const readToken = () => {
  try {
    return sessionStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

interface Loaded {
  content: SiteContent
  storage: ContentResponse['storage']
}

type Toast = { kind: 'ok' | 'error'; text: string } | null

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(readToken)
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [draft, setDraft] = useState<SiteContent | null>(null)
  const [savedJson, setSavedJson] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<Toast>(null)
  const [resetKey, setResetKey] = useState(0)

  const notify = useCallback((kind: 'ok' | 'error', text: string) => setToast({ kind, text }), [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [toast])

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(TOKEN_KEY)
    } catch {
      /* sem storage: ok */
    }
    setToken(null)
  }, [])

  useEffect(() => {
    if (!token) return
    fetchContent()
      .then(({ content, storage }) => {
        const c = content ?? DEFAULT_CONTENT
        setLoaded({ content: c, storage })
        setDraft(c)
        setSavedJson(JSON.stringify(c))
      })
      .catch((e) => setLoadError(e instanceof ApiError ? e.message : 'Falha ao carregar'))
  }, [token])

  const dirty = useMemo(() => draft !== null && JSON.stringify(draft) !== savedJson, [draft, savedJson])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  if (!token) {
    return (
      <LoginForm
        onLogin={(t) => {
          try {
            sessionStorage.setItem(TOKEN_KEY, t)
          } catch {
            /* ok */
          }
          setToken(t)
        }}
      />
    )
  }

  if (loadError) {
    return (
      <main className="fixed inset-0 grid place-items-center px-6 text-center">
        <div className="max-w-sm rounded-3xl border-4 border-white bg-white/90 p-6 shadow-soft">
          <TriangleAlert className="mx-auto text-kitty-red" size={36} />
          <p className="mt-2 font-bold">{loadError}</p>
          <p className="mt-1 text-sm text-ink/70">
            Rode com <code>npm run dev</code> ou use o site publicado na Vercel (as rotas /api precisam estar ativas).
          </p>
        </div>
      </main>
    )
  }

  if (!loaded || !draft) return <Loader />

  const save = async () => {
    setSaving(true)
    try {
      await saveContent(draft, token)
      setSavedJson(JSON.stringify(draft))
      notify('ok', 'Salvo! O site já está atualizado.')
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        logout()
        return
      }
      notify('error', e instanceof Error ? e.message : 'Falha ao salvar')
    } finally {
      setSaving(false)
    }
  }

  const resetTexts = () => {
    if (!window.confirm('Restaurar todos os textos para o padrão? (fotos e música são mantidas)')) return
    setDraft({ ...DEFAULT_CONTENT, photos: draft.photos, music: draft.music, phraseFont: draft.phraseFont })
    setResetKey((k) => k + 1)
  }

  return (
    <main className="fixed inset-0 overflow-y-auto" data-scroll-root>
      <div className="mx-auto flex max-w-2xl flex-col gap-5 px-4 pt-6 pb-32">
        <header className="flex items-center gap-3">
          <KittyFace className="w-16 shrink-0" mood="love" />
          <div className="min-w-0 flex-1">
            <h1 className="font-script text-3xl leading-tight text-kitty-red">Painel do amor</h1>
            <p className="text-xs font-semibold text-ink/60">
              {loaded.storage === 'local' ? 'Modo local (arquivos em .dev-data)' : 'Salvo na nuvem (Vercel Blob)'}
            </p>
          </div>
          <a href="/" target="_blank" rel="noreferrer" className={ghostButtonClass}>
            <ExternalLink size={16} /> Ver site
          </a>
          <button type="button" className={ghostButtonClass} onClick={logout} aria-label="Sair">
            <LogOut size={16} />
          </button>
        </header>

        <PhotosEditor
          photos={draft.photos}
          font={draft.phraseFont}
          token={token}
          storage={loaded.storage}
          onPhotos={(fn) => setDraft((d) => d && { ...d, photos: fn(d.photos) })}
          onFont={(phraseFont) => setDraft((d) => d && { ...d, phraseFont })}
          onError={(t) => notify('error', t)}
        />

        <MusicEditor
          music={draft.music}
          token={token}
          storage={loaded.storage}
          onChange={(music) => setDraft((d) => d && { ...d, music })}
          onError={(t) => notify('error', t)}
        />

        <TextsEditor content={draft} resetKey={resetKey} onChange={setDraft} onReset={resetTexts} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t-4 border-white bg-blush-100/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <p className="flex-1 text-sm font-bold text-kitty-red-dark">{dirty ? 'Alterações não salvas' : 'Tudo salvo ✨'}</p>
          <button type="button" className={buttonClass} disabled={!dirty || saving} onClick={save}>
            <Save size={18} /> {saving ? 'Salvando…' : 'Salvar'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            className={`fixed inset-x-4 top-4 z-50 mx-auto flex max-w-md items-center gap-2 rounded-2xl border-4 border-white px-4 py-3 text-sm font-bold text-white shadow-soft ${
              toast.kind === 'ok' ? 'bg-emerald-500' : 'bg-kitty-red'
            }`}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
          >
            {toast.kind === 'ok' ? <CheckCircle2 size={20} /> : <TriangleAlert size={20} />}
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { login } from '../lib/api'
import { KittyFace } from '../components/ui/KittyFace'
import { buttonClass, inputClass } from './ui'

export function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      onLogin(await login(password))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="fixed inset-0 grid place-items-center overflow-y-auto px-4">
      <motion.form
        onSubmit={submit}
        className="flex w-full max-w-sm flex-col items-center gap-4 rounded-[2rem] border-4 border-white bg-white/85 p-8 shadow-soft"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
      >
        <KittyFace className="w-28" />
        <h1 className="font-script text-3xl text-kitty-red">Área do amor</h1>
        <input
          type="password"
          autoFocus
          autoComplete="current-password"
          placeholder="Senha"
          className={inputClass}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <motion.p role="alert" className="text-sm font-bold text-kitty-red" initial={{ x: -8 }} animate={{ x: [0, -8, 8, -4, 0] }}>
            {error}
          </motion.p>
        )}
        <button type="submit" className={`${buttonClass} w-full`} disabled={busy || !password}>
          <Lock size={18} /> {busy ? 'Entrando…' : 'Entrar'}
        </button>
      </motion.form>
    </main>
  )
}

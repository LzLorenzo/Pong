import type { VercelRequest, VercelResponse } from '@vercel/node'
import { checkPassword, createToken } from './_lib/auth.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' })
  if (!process.env.ADMIN_PASSWORD) return res.status(500).json({ error: 'ADMIN_PASSWORD não configurada no servidor' })

  if (!checkPassword(req.body?.password)) {
    await new Promise((r) => setTimeout(r, 900)) // freia tentativa por força bruta
    return res.status(401).json({ error: 'Senha incorreta' })
  }
  return res.status(200).json({ token: createToken() })
}

import { createHmac, timingSafeEqual } from 'node:crypto'

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000

function secret(): string {
  const s = process.env.AUTH_SECRET ?? process.env.ADMIN_PASSWORD
  if (!s) throw new Error('ADMIN_PASSWORD não configurada')
  return s
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  return ba.length === bb.length && timingSafeEqual(ba, bb)
}

export function checkPassword(input: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD
  return typeof expected === 'string' && expected.length > 0 && typeof input === 'string' && safeEqual(input, expected)
}

/** Token sem estado: `<expira>.<assinatura HMAC>`. */
export function createToken(now = Date.now()): string {
  const exp = String(now + TOKEN_TTL_MS)
  return `${exp}.${sign(exp)}`
}

export function verifyToken(token: unknown, now = Date.now()): boolean {
  if (typeof token !== 'string') return false
  const [exp, sig] = token.split('.')
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < now) return false
  return safeEqual(sig, sign(exp))
}

export function bearer(header: string | string[] | undefined): string | null {
  const value = Array.isArray(header) ? header[0] : header
  return value?.startsWith('Bearer ') ? value.slice(7) : null
}

import { randomUUID } from 'node:crypto'
import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { extname, join } from 'node:path'
import type { Plugin } from 'vite'
import { bearer, checkPassword, createToken, verifyToken } from './api/_lib/auth.js'
import { validateContent } from './api/_lib/validate.js'
import type { ContentResponse } from './src/shared/content.js'

const DATA_DIR = '.dev-data'
const UPLOAD_DIR = join(DATA_DIR, 'uploads')
const CONTENT_FILE = join(DATA_DIR, 'content.json')

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
}

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

/**
 * API local para `npm run dev`: mesmo contrato das funções em /api (Vercel),
 * mas guardando tudo na pasta `.dev-data/`. Senha padrão do admin: "admin" (ou ADMIN_PASSWORD).
 */
export function devApi(): Plugin {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      process.env.ADMIN_PASSWORD ??= 'admin'
      mkdirSync(UPLOAD_DIR, { recursive: true })

      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        try {
          if (url.pathname.startsWith('/dev-uploads/')) {
            const file = join(UPLOAD_DIR, url.pathname.slice('/dev-uploads/'.length).replace(/[^\w.-]/g, ''))
            if (!existsSync(file)) return send(res, 404, { error: 'Arquivo não encontrado' })
            res.setHeader('Content-Type', MIME[extname(file).toLowerCase()] ?? 'application/octet-stream')
            return void createReadStream(file).pipe(res)
          }

          if (url.pathname === '/api/login' && req.method === 'POST') {
            const { password } = JSON.parse((await readBody(req)).toString() || '{}')
            if (!checkPassword(password)) return send(res, 401, { error: 'Senha incorreta' })
            return send(res, 200, { token: createToken() })
          }

          if (url.pathname === '/api/content' && req.method === 'GET') {
            const content = existsSync(CONTENT_FILE) ? JSON.parse(readFileSync(CONTENT_FILE, 'utf8')) : null
            const body: ContentResponse = { content, storage: 'local' }
            return send(res, 200, body)
          }

          if (url.pathname === '/api/content' && req.method === 'PUT') {
            if (!verifyToken(bearer(req.headers.authorization))) return send(res, 401, { error: 'Sessão expirada' })
            const next = validateContent(JSON.parse((await readBody(req)).toString()))
            mkdirSync(DATA_DIR, { recursive: true })
            writeFileSync(CONTENT_FILE, JSON.stringify(next, null, 2))
            return send(res, 200, { ok: true })
          }

          if (url.pathname === '/api/dev-upload' && req.method === 'PUT') {
            if (!verifyToken(bearer(req.headers.authorization))) return send(res, 401, { error: 'Sessão expirada' })
            const ext = extname(url.searchParams.get('name') ?? '').toLowerCase().replace(/[^.\w]/g, '')
            const name = `${randomUUID()}${ext}`
            mkdirSync(UPLOAD_DIR, { recursive: true })
            writeFileSync(join(UPLOAD_DIR, name), await readBody(req))
            return send(res, 200, { url: `/dev-uploads/${name}` })
          }
        } catch (e) {
          return send(res, 400, { error: e instanceof Error ? e.message : 'Erro' })
        }
        next()
      })
    },
  }
}

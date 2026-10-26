// Gera fotos placeholder (public/foto1..5.jpg). Uso: node scripts/gerar-fotos.mjs
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public')

const palettes = [
  ['#ffd6e4', '#ff8fb1'],
  ['#ffe3ec', '#ff5c8a'],
  ['#ffeaf1', '#ffb8d0'],
  ['#ffd0dc', '#ff7a9a'],
  ['#fff0f5', '#ff9ebb'],
]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 800, height: 1000 } })
for (const [i, [a, b]] of palettes.entries()) {
  await page.setContent(`
    <body style="margin:0;width:800px;height:1000px;display:grid;place-items:center;font-family:sans-serif;
      background:radial-gradient(circle at 30% 20%,#fff8,transparent 40%),linear-gradient(160deg,${a},${b})">
      <div style="text-align:center;color:#fff;text-shadow:0 4px 14px #b8173a66">
        <div style="font-size:260px;line-height:1">💖</div>
        <div style="font-size:64px;font-weight:700;margin-top:20px">Foto ${i + 1}</div>
        <div style="font-size:30px;margin-top:10px;opacity:.9">substitua em public/foto${i + 1}.jpg</div>
      </div>
    </body>`)
  await page.screenshot({ path: path.join(out, `foto${i + 1}.jpg`), type: 'jpeg', quality: 82 })
}
await browser.close()
console.log('fotos geradas')

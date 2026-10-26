# Pedido de Namoro 💖

React + TypeScript + Vite + Tailwind v4 + Framer Motion, tema inspirado em Hello Kitty.

## Rodar

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # produção (dist/)
```

## Painel /admin

Em `/admin` (senha) você envia fotos, troca a música (qualquer MP3), escolhe a fonte das frases e edita todos os textos.
Cada foto aberta no site aparece num quadro da Hello Kitty com o título e a frase escolhidos.

- **Local (`npm run dev`)**: senha padrão `admin` (ou `ADMIN_PASSWORD`); arquivos ficam em `.dev-data/` (ignorado pelo git).
- **Produção (Vercel)**:
  1. Importe o repositório e defina **Root Directory = `pedido-de-namoro`**.
  2. *Storage → Create → Blob* e conecte ao projeto (cria `BLOB_READ_WRITE_TOKEN`).
  3. *Settings → Environment Variables*: `ADMIN_PASSWORD` (e, opcionalmente, `AUTH_SECRET`).
  4. Faça o deploy e acesse `https://SEU-SITE.vercel.app/admin`.
- Sem nada salvo no admin, o site usa os padrões de `src/config.ts` (fotos `public/foto*.jpg`, música `public/music.mp3`).
- Testar as funções serverless localmente: `npx vercel dev`.

## Personalizar pelo código (padrões)

Em `src/config.ts` (`DEFAULT_CONTENT`): data de início, textos, mensagens do "Não", carta, fotos e música padrão.

## Estrutura

```
src/
  components/{layout,question,success,ui}/   telas e peças visuais
  hooks/   useEscapingButton (fuga do "Não"), useLoveMusic, useNow
  lib/     confete de corações, sorteio sem repetição, assets
  config.ts
```

Observações:
- O botão "Não" é `position: fixed`; não coloque `transform`/`filter` em ancestrais dele.
- Cursores personalizados: `public/cursor-bow.svg` (padrão) e `public/cursor-heart.svg` (clicáveis).

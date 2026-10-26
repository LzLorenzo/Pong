# Pedido de Namoro 💖

React + TypeScript + Vite + Tailwind v4 + Framer Motion, tema inspirado em Hello Kitty.

## Rodar

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # produção (dist/)
```

## Personalizar (tudo em `src/config.ts`)

- `RELATIONSHIP_START` — data de início (contador de anos/meses/dias).
- `QUESTION`, `TAUNTS` — textos da pergunta e mensagens provocativas do botão "Não".
- `SUCCESS` — título, carta de amor e assinatura.
- `PHOTOS` — fotos do carrossel. Substitua `public/foto1.jpg … foto5.jpg` (proporção 4:5 fica melhor) ou edite a lista.
- Música: substitua `public/music.mp3` (o atual é só um placeholder gerado por `scripts/gerar-placeholders.py`).

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

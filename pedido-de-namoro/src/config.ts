import { assetUrl } from './lib/assets'

export interface Photo {
  src: string
  alt: string
  caption: string
}

/** Tudo que você precisa personalizar fica neste arquivo. */

/** Data em que vocês começaram a namorar/ficar (PLACEHOLDER — altere!). Formato ISO local. */
export const RELATIONSHIP_START = '2023-06-12T00:00:00'

export const QUESTION = {
  title: 'Quer namorar comigo?',
  yes: 'Sim',
  no: 'Não',
} as const

/** Mensagens exibidas aleatoriamente quando o botão "Não" foge. */
export const TAUNTS: readonly string[] = [
  'Tem certeza? 🥺',
  'Você não tem escolha!',
  'Clica no "Sim" logo!',
  'A Hello Kitty ficaria triste! 😿',
  'Quase! Tenta de novo 😏',
  'Esse botão tem medo de você 🙈',
  'Meu coração vai partir... 💔',
  'Olha o tamanho do "Sim" crescendo!',
  'Pode desistir, ele é rápido 💨',
  'Pensa com carinho... 💕',
  'Sem chance, hoje é dia de amor!',
]

export const SUCCESS = {
  title: 'Você disse SIM!',
  subtitle: 'O melhor "sim" do mundo 💖',
  counterTitle: 'Estamos juntinhos há',
  galleryTitle: 'Nossos momentos',
  letterTitle: 'Uma carta pra você',
  /** Cada item vira um parágrafo. */
  letter: [
    'Obrigado por existir na minha vida e por tornar os meus dias mais leves, mais doces e muito mais felizes.',
    'Com você, até as coisas simples viram momentos especiais. Quero continuar construindo memórias ao seu lado, todos os dias.',
    'Eu te amo muito. Hoje, amanhã e sempre. 💕',
  ],
  signature: 'Com todo o meu amor,\nSeu amor 💌',
} as const

/** Troque os arquivos em /public (foto1.jpg, foto2.jpg…) ou edite esta lista. */
export const PHOTOS: readonly Photo[] = [
  { src: assetUrl('foto1.jpg'), alt: 'Foto 1 do casal', caption: 'Nosso começo' },
  { src: assetUrl('foto2.jpg'), alt: 'Foto 2 do casal', caption: 'Dia especial' },
  { src: assetUrl('foto3.jpg'), alt: 'Foto 3 do casal', caption: 'Sorrisos' },
  { src: assetUrl('foto4.jpg'), alt: 'Foto 4 do casal', caption: 'Aventuras' },
  { src: assetUrl('foto5.jpg'), alt: 'Foto 5 do casal', caption: 'Pra sempre' },
]

/** Música de fundo (coloque seu arquivo em public/music.mp3). */
export const MUSIC_SRC = assetUrl('music.mp3')
export const MUSIC_VOLUME = 0.55

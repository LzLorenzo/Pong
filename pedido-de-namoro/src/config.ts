import { assetUrl } from './lib/assets'
import type { SiteContent } from './shared/content'

/**
 * Conteúdo PADRÃO do site. Tudo isto pode ser sobrescrito pela página /admin
 * (o que for salvo lá tem prioridade sobre este arquivo).
 */
export const DEFAULT_CONTENT: SiteContent = {
  version: 1,
  /** Data em que vocês começaram a namorar/ficar (PLACEHOLDER — altere!). Formato ISO local. */
  startDate: '2023-06-12T00:00:00',
  question: { title: 'Quer namorar comigo?', yes: 'Sim', no: 'Não' },
  /** Mensagens exibidas aleatoriamente quando o botão "Não" foge. */
  taunts: [
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
  ],
  success: {
    title: 'Você disse SIM!',
    subtitle: 'O melhor "sim" do mundo 💖',
    counterTitle: 'Estamos juntinhos há',
    galleryTitle: 'Nossos momentos',
    letterTitle: 'Uma carta pra você',
    letter: [
      'Obrigado por existir na minha vida e por tornar os meus dias mais leves, mais doces e muito mais felizes.',
      'Com você, até as coisas simples viram momentos especiais. Quero continuar construindo memórias ao seu lado, todos os dias.',
      'Eu te amo muito. Hoje, amanhã e sempre. 💕',
    ],
    signature: 'Com todo o meu amor,\nSeu amor 💌',
  },
  phraseFont: 'great-vibes',
  photos: [
    { id: 'foto1', src: assetUrl('foto1.jpg'), caption: 'Nosso começo', phrase: 'Foi ali que o meu coração aprendeu o seu nome.' },
    { id: 'foto2', src: assetUrl('foto2.jpg'), caption: 'Dia especial', phrase: 'Com você, até um dia comum vira o meu favorito.' },
    { id: 'foto3', src: assetUrl('foto3.jpg'), caption: 'Sorrisos', phrase: 'O seu sorriso é o meu lugar preferido no mundo.' },
    { id: 'foto4', src: assetUrl('foto4.jpg'), caption: 'Aventuras', phrase: 'Qualquer caminho é melhor ao seu lado.' },
    { id: 'foto5', src: assetUrl('foto5.jpg'), caption: 'Pra sempre', phrase: 'Se eu pudesse escolher de novo, escolheria você, sempre.' },
  ],
  /** Música de fundo (placeholder em public/music.mp3; troque pelo /admin). */
  music: { src: assetUrl('music.mp3'), name: 'music.mp3 (padrão)' },
}

export const MUSIC_VOLUME = 0.55

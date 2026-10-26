export type KittyMood = 'happy' | 'sad' | 'love'

interface KittyFaceProps {
  mood?: KittyMood
  className?: string
}

/** Mascote original "gatinha de laço", inspirada no estilo kawaii. */
export function KittyFace({ mood = 'happy', className }: KittyFaceProps) {
  return (
    <svg viewBox="0 0 200 170" className={className} role="img" aria-label="Gatinha fofa com um laço vermelho">
      {/* orelhas */}
      <path d="M32 74 22 14c-1-6 4-8 9-5l50 28" fill="#fff" stroke="#6b2340" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M168 74l10-60c1-6-4-8-9-5l-50 28" fill="#fff" stroke="#6b2340" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
      {/* cabeça */}
      <ellipse cx="100" cy="102" rx="84" ry="58" fill="#fff" stroke="#6b2340" strokeWidth="5" />
      {/* bochechas */}
      <ellipse cx="46" cy="116" rx="13" ry="8" fill="#ffb8d0" opacity=".75" />
      <ellipse cx="154" cy="116" rx="13" ry="8" fill="#ffb8d0" opacity=".75" />

      {/* olhos */}
      {mood === 'love' ? (
        <g fill="#ff3b5c" stroke="#6b2340" strokeWidth="2.5" strokeLinejoin="round">
          <path d="M62 96c-9-8-3-17 3-17 4 0 6 3 6 3s2-3 6-3c6 0 12 9 3 17l-9 8Z" />
          <path d="M122 96c-9-8-3-17 3-17 4 0 6 3 6 3s2-3 6-3c6 0 12 9 3 17l-9 8Z" />
        </g>
      ) : (
        <g fill="#2b1020">
          <ellipse cx="66" cy="96" rx="7.5" ry="9.5" />
          <ellipse cx="134" cy="96" rx="7.5" ry="9.5" />
          <circle cx="63.5" cy="92" r="2.6" fill="#fff" />
          <circle cx="131.5" cy="92" r="2.6" fill="#fff" />
        </g>
      )}
      {mood === 'sad' && (
        <g>
          <path d="M54 80l22-6M146 80l-22-6" stroke="#6b2340" strokeWidth="4" strokeLinecap="round" />
          <path d="M62 108c-3 6-5 10-5 14a5 5 0 0 0 10 0c0-4-2-8-5-14Z" fill="#8fd3ff" stroke="#fff" strokeWidth="1.5" />
        </g>
      )}

      {/* nariz */}
      <ellipse cx="100" cy="108" rx="9" ry="6.5" fill="#ffd23f" stroke="#6b2340" strokeWidth="3" />
      {/* boca */}
      {mood === 'sad' ? (
        <path d="M88 128c6-6 18-6 24 0" fill="none" stroke="#6b2340" strokeWidth="3.5" strokeLinecap="round" />
      ) : (
        <path d="M100 114v5c-3 7-12 7-15 2M100 119c3 7 12 7 15 2" fill="none" stroke="#6b2340" strokeWidth="3.5" strokeLinecap="round" />
      )}

      {/* bigodes */}
      <g stroke="#6b2340" strokeWidth="4" strokeLinecap="round">
        <path d="M14 94l-8-4M12 108H2M14 122l-8 4" />
        <path d="M186 94l8-4M188 108h10M186 122l8 4" />
      </g>

      {/* laço */}
      <g transform="translate(142 22) rotate(12)">
        <path d="M0 0C-8-18-30-22-32-10c-2 12 14 16 32 10Z" fill="#ff3b5c" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
        <path d="M0 0c8-18 30-22 32-10 2 12-14 16-32 10Z" fill="#ff3b5c" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
        <path d="M0 0C-8-18-30-22-32-10c-2 12 14 16 32 10Zm0 0c8-18 30-22 32-10 2 12-14 16-32 10Z" fill="none" stroke="#b8173a" strokeWidth="1.2" opacity=".5" />
        <circle r="8" fill="#e8264d" stroke="#fff" strokeWidth="3" />
      </g>
    </svg>
  )
}

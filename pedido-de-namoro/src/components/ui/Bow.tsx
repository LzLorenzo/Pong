interface BowProps {
  className?: string
  /** Cor principal do laço. */
  color?: string
}

export function Bow({ className, color = '#ff3b5c' }: BowProps) {
  return (
    <svg viewBox="0 0 64 44" className={className} aria-hidden="true">
      <path d="M32 22C24 4 4 0 2 12c-2 12 14 16 30 10Z" fill={color} stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M32 22c8-18 28-22 30-10 2 12-14 16-30 10Z" fill={color} stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M12 9c3-2 7-1 10 2M52 9c-3-2-7-1-10 2" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".55" />
      <circle cx="32" cy="22" r="7" fill={color} stroke="#fff" strokeWidth="2.5" />
      <circle cx="30" cy="20" r="2" fill="#fff" opacity=".5" />
    </svg>
  )
}

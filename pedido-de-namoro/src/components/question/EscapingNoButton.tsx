import { motion } from 'framer-motion'
import type { RefObject } from 'react'
import { useEscapingButton } from '../../hooks/useEscapingButton'

interface EscapingNoButtonProps {
  label: string
  avoidRefs: RefObject<HTMLElement | null>[]
  onEscape: (totalEscapes: number) => void
}

const buttonClasses =
  'rounded-full border-4 border-white bg-white px-9 py-4 text-2xl font-bold text-kitty-red-dark shadow-soft sm:px-12 sm:text-3xl'

/**
 * Atenção: nenhum ancestral pode ter `transform`/`filter`, senão o `position: fixed` deixa de ser relativo à viewport.
 *
 * Botão "Não": foge ao passar o mouse (hover), ao tocar (touch/caneta),
 * ao receber foco do teclado e até ao clique — nunca é possível acioná-lo.
 */
export function EscapingNoButton({ label, avoidRefs, onEscape }: EscapingNoButtonProps) {
  const { slotRef, buttonRef, position, escapes, escape } = useEscapingButton({ avoidRefs })

  const flee = () => {
    const total = escape()
    if (total !== null) onEscape(total)
  }

  return (
    <>
      {/* Reserva o espaço original no layout enquanto o botão real é `fixed`. */}
      <span ref={slotRef} aria-hidden="true" className={`invisible inline-block ${buttonClasses}`}>
        {label}
      </span>

      <motion.button
        ref={buttonRef}
        type="button"
        className={`fixed top-0 left-0 z-30 select-none ${buttonClasses}`}
        style={{ touchAction: 'none', opacity: position ? 1 : 0 }}
        initial={false}
        animate={{ x: position?.x ?? 0, y: position?.y ?? 0, rotate: escapes ? [0, -14, 10, 0] : 0 }}
        transition={{
          x: { type: 'spring', stiffness: 260, damping: 20, mass: 0.8 },
          y: { type: 'spring', stiffness: 260, damping: 20, mass: 0.8 },
          rotate: { duration: 0.5 },
        }}
        whileHover={{ scale: 1.04 }}
        onPointerEnter={(e) => e.pointerType === 'mouse' && flee()}
        onPointerDown={(e) => {
          if (e.pointerType !== 'mouse') e.preventDefault()
          flee()
        }}
        onFocus={flee}
        onClick={(e) => {
          e.preventDefault()
          flee()
        }}
      >
        {label}
      </motion.button>
    </>
  )
}

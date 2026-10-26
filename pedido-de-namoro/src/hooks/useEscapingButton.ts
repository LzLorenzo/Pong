import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'

export interface Point {
  x: number
  y: number
}

interface Options {
  /** Elementos que o botão fugitivo nunca deve cobrir (ex.: botão "Sim"). */
  avoidRefs: RefObject<HTMLElement | null>[]
  /** Distância mínima das bordas da viewport. */
  edgePadding?: number
  /** Tempo mínimo entre fugas, evita "tremedeira" com toques/hover repetidos. */
  cooldownMs?: number
}

const ATTEMPTS = 40

function viewportSize() {
  const vv = window.visualViewport
  return { w: vv?.width ?? window.innerWidth, h: vv?.height ?? window.innerHeight }
}

function overlaps(a: DOMRect | { left: number; top: number; right: number; bottom: number }, b: DOMRect, gap: number) {
  return a.left < b.right + gap && a.right > b.left - gap && a.top < b.bottom + gap && a.bottom > b.top - gap
}

/**
 * Faz um botão fugir para posições aleatórias (sempre dentro da viewport).
 * O botão deve ser `position: fixed; top: 0; left: 0` e animado via `x`/`y`;
 * o `slotRef` marca o lugar de origem no fluxo do layout.
 */
export function useEscapingButton({ avoidRefs, edgePadding = 16, cooldownMs = 280 }: Options) {
  const slotRef = useRef<HTMLSpanElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState<Point | null>(null)
  const [escapes, setEscapes] = useState(0)
  const positionRef = useRef<Point | null>(null)
  const lastEscape = useRef(0)
  const escapesRef = useRef(0)

  const commit = useCallback((p: Point) => {
    positionRef.current = p
    setPosition(p)
  }, [])

  const measureHome = useCallback(() => {
    const r = slotRef.current?.getBoundingClientRect()
    return r ? { x: r.left, y: r.top } : null
  }, [])

  // Posição inicial = lugar do slot no layout (antes de qualquer fuga).
  useLayoutEffect(() => {
    const home = measureHome()
    if (home) commit(home)
  }, [commit, measureHome])

  // Mantém o botão dentro da tela (ou no slot, se ainda não fugiu) ao redimensionar/girar.
  useEffect(() => {
    const onResize = () => {
      if (escapesRef.current === 0) {
        const home = measureHome()
        if (home) commit(home)
        return
      }
      const btn = buttonRef.current?.getBoundingClientRect()
      const cur = positionRef.current
      if (!btn || !cur) return
      const { w, h } = viewportSize()
      commit({
        x: Math.min(Math.max(cur.x, edgePadding), Math.max(edgePadding, w - btn.width - edgePadding)),
        y: Math.min(Math.max(cur.y, edgePadding), Math.max(edgePadding, h - btn.height - edgePadding)),
      })
    }
    window.addEventListener('resize', onResize)
    window.visualViewport?.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.visualViewport?.removeEventListener('resize', onResize)
    }
  }, [commit, edgePadding, measureHome])

  const escape = useCallback(() => {
    const now = performance.now()
    const btn = buttonRef.current?.getBoundingClientRect()
    const cur = positionRef.current
    if (!btn || !cur || now - lastEscape.current < cooldownMs) return null
    lastEscape.current = now

    const { w, h } = viewportSize()
    const maxX = Math.max(edgePadding, w - btn.width - edgePadding)
    const maxY = Math.max(edgePadding, h - btn.height - edgePadding)
    const forbidden = avoidRefs.map((r) => r.current?.getBoundingClientRect()).filter((r): r is DOMRect => !!r)
    const minTravel = Math.min(w, h) * 0.3

    let best: Point | null = null
    let bestScore = -Infinity
    for (let i = 0; i < ATTEMPTS; i++) {
      const p = {
        x: edgePadding + Math.random() * (maxX - edgePadding),
        y: edgePadding + Math.random() * (maxY - edgePadding),
      }
      const box = { left: p.x, top: p.y, right: p.x + btn.width, bottom: p.y + btn.height }
      const blocked = forbidden.some((f) => overlaps(box, f, 14))
      const travel = Math.hypot(p.x - cur.x, p.y - cur.y)
      if (!blocked && travel >= minTravel) {
        best = p
        break
      }
      // Fallback: melhor candidato livre; se tudo estiver ocupado, o mais distante.
      const score = (blocked ? -10_000 : 0) + travel
      if (score > bestScore) {
        bestScore = score
        best = p
      }
    }

    if (best) commit(best)
    escapesRef.current += 1
    setEscapes(escapesRef.current)
    return escapesRef.current
  }, [avoidRefs, commit, cooldownMs, edgePadding])

  return { slotRef, buttonRef, position, escapes, escape }
}

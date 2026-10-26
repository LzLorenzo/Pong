import confetti from 'canvas-confetti'

const HEART_PATH =
  'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z'

const COLORS = ['#ff5c8a', '#ff3b5c', '#ffb3c9', '#ffffff', '#ff8fb1']

/** Chuva de corações (+ explosões iniciais). Retorna uma função que interrompe tudo. */
export function startHeartRain(durationMs = 9000): () => void {
  const heart = confetti.shapeFromPath({ path: HEART_PATH })
  const base = {
    shapes: [heart, 'circle' as const],
    colors: COLORS,
    zIndex: 60,
    disableForReducedMotion: true,
  }

  const burst = (x: number, angle: number) =>
    confetti({ ...base, particleCount: 70, spread: 70, startVelocity: 55, angle, origin: { x, y: 0.75 }, scalar: 1.5 })
  burst(0, 60)
  burst(1, 120)

  let raf = 0
  const end = performance.now() + durationMs
  let lastDrop = 0
  const tick = (now: number) => {
    if (now - lastDrop > 70) {
      lastDrop = now
      drop()
    }
    if (now < end) raf = requestAnimationFrame(tick)
  }
  const drop = () =>
    confetti({
      ...base,
      particleCount: 2,
      angle: 90,
      spread: 120,
      startVelocity: 12,
      gravity: 0.45,
      ticks: 400,
      scalar: 1.4,
      drift: Math.random() * 1.2 - 0.6,
      origin: { x: Math.random(), y: -0.05 },
    })
  raf = requestAnimationFrame(tick)

  return () => {
    cancelAnimationFrame(raf)
    confetti.reset()
  }
}

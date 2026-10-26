export function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

/** Sorteia sem repetir até esgotar a lista ("saco de sorteio"). */
export function createBag<T>(items: readonly T[]): () => T {
  let bag: T[] = []
  let last: T | undefined
  return () => {
    if (bag.length === 0) {
      bag = [...items].sort(() => Math.random() - 0.5)
      if (bag.length > 1 && bag[bag.length - 1] === last) bag.reverse()
    }
    last = bag.pop() as T
    return last
  }
}

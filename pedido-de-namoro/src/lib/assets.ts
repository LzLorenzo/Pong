/** Resolve arquivos da pasta /public respeitando o `base` do Vite (deploy em subpasta). */
export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

import type { ReactNode } from 'react'

export const inputClass =
  'w-full rounded-2xl border-2 border-blush-300 bg-white px-4 py-3 text-base font-medium text-ink outline-none transition focus:border-rose-kitty focus:ring-4 focus:ring-blush-200'

export const buttonClass =
  'inline-flex items-center justify-center gap-2 rounded-full border-4 border-white bg-rose-kitty px-5 py-2.5 text-base font-bold text-white shadow-soft transition active:scale-95 disabled:opacity-50'

export const ghostButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-full border-2 border-blush-300 bg-white px-4 py-2 text-sm font-bold text-kitty-red-dark transition active:scale-95 disabled:opacity-40'

export function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border-4 border-white bg-white/85 p-5 shadow-soft sm:p-6">
      <h2 className="font-script text-2xl text-kitty-red">{title}</h2>
      {hint && <p className="mt-1 text-sm font-medium text-ink/70">{hint}</p>}
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </section>
  )
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-bold text-kitty-red-dark">{label}</span>
      {children}
      {hint && <span className="text-xs font-medium text-ink/60">{hint}</span>}
    </label>
  )
}

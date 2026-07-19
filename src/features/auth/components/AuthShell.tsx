import type { ReactNode } from 'react'

export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-ink-950">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-ink-950 via-ink-900 to-brand-900 p-12 text-white lg:flex">
        <div className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">S</span>
          STAMUX
        </div>
        <div>
          
          <p className="mt-4 max-w-sm text-sm text-white/60">
           Plateforme de gestion des stagiaires pour les entreprises.
          </p>
        </div>
        <p className="text-xs text-white/30">© {new Date().getFullYear()} STAMUX — Plateforme de gestion des stagiaires</p>
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-clay-500/10 blur-3xl" />
      </div>
      <div className="flex w-full flex-1 items-center justify-center bg-[#F4F6FB] p-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden flex items-center gap-2 font-display text-lg font-semibold text-ink-950">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">S</span>
            STAMUX
          </div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-ink-700/60">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

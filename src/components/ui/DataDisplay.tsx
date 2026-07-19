import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('rounded-xl2 border border-ink-700/10 bg-white p-5 shadow-soft', className)}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-semibold text-ink-950">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-ink-700/60">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand'

const badgeTones: Record<BadgeTone, string> = {
  neutral: 'bg-ink-900/5 text-ink-700',
  success: 'bg-mint-500/10 text-mint-500',
  warning: 'bg-clay-500/10 text-clay-600',
  danger: 'bg-red-500/10 text-red-600',
  info: 'bg-brand-500/10 text-brand-600',
  brand: 'bg-brand-600 text-white',
}

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium capitalize',
        badgeTones[tone]
      )}
    >
      {children}
    </span>
  )
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string
  value: ReactNode
  hint?: string
  icon?: ReactNode
}) {
  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="text-sm text-ink-700/60">{label}</p>
        <p className="mt-1.5 font-display text-2xl font-semibold text-ink-950">{value}</p>
        {hint && <p className="mt-1 text-xs text-ink-700/50">{hint}</p>}
      </div>
      {icon && <div className="rounded-lg bg-brand-500/10 p-2 text-brand-600">{icon}</div>}
    </Card>
  )
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn('h-5 w-5 animate-spin text-brand-600', className)} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export function PageSpinner() {
  return (
    <div className="flex h-64 w-full items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  )
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-ink-700/20 bg-ink-900/[0.02] py-14 text-center">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-ink-900/5 text-ink-700/40">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />
        </svg>
      </div>
      <p className="font-medium text-ink-900">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-700/60">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

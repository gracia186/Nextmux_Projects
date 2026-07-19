import type { ChangeEvent, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Avatar({ name, src, size = 'md' }: { name: string; src?: string | null; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-14 w-14 text-lg' }
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (src) {
    return <img src={src} alt={name} className={cn('rounded-full object-cover', sizeClasses[size])} />
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-brand-600 font-medium text-white',
        sizeClasses[size]
      )}
    >
      {initials || '?'}
    </div>
  )
}

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="-mx-5 overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">{children}</table>
    </div>
  )
}

export function Thead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-ink-700/10 text-left text-xs uppercase tracking-wide text-ink-700/50">
        {children}
      </tr>
    </thead>
  )
}

export function Th({ children, className }: { children: ReactNode; className?: string }) {
  return <th className={cn('px-5 py-2.5 font-medium', className)}>{children}</th>
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={cn('px-5 py-3 align-middle', className)}>{children}</td>
}

export function Tr({ children, className }: { children: ReactNode; className?: string }) {
  return <tr className={cn('border-b border-ink-700/5 last:border-0 hover:bg-ink-900/[0.015]', className)}>{children}</tr>
}

export function Pagination({
  currentPage,
  lastPage,
  onChange,
}: {
  currentPage: number
  lastPage: number
  onChange: (page: number) => void
}) {
  if (lastPage <= 1) return null
  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <button
        disabled={currentPage <= 1}
        onClick={() => onChange(currentPage - 1)}
        className="rounded-lg border border-ink-700/15 px-3 py-1.5 text-sm disabled:opacity-40"
      >
        Précédent
      </button>
      <span className="text-sm text-ink-700/60">
        Page {currentPage} / {lastPage}
      </span>
      <button
        disabled={currentPage >= lastPage}
        onClick={() => onChange(currentPage + 1)}
        className="rounded-lg border border-ink-700/15 px-3 py-1.5 text-sm disabled:opacity-40"
      >
        Suivant
      </button>
    </div>
  )
}

export function FileInput({
  label,
  onFileSelected,
  accept,
  error,
  fileName,
}: {
  label: string
  onFileSelected: (file: File | null) => void
  accept?: string
  error?: string
  fileName?: string
}) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onFileSelected(e.target.files?.[0] ?? null)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-ink-800">{label}</label>
      <label
        className={cn(
          'flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-sm text-ink-700/60 hover:border-brand-400 hover:bg-brand-50/50',
          error ? 'border-red-300' : 'border-ink-700/20'
        )}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 16V4m0 0L7 9m5-5l5 5M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {fileName ? fileName : 'Choisir un fichier'}
        <input type="file" accept={accept} className="hidden" onChange={handleChange} />
      </label>
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  )
}

import { useToastStore } from '@/store/toastStore'
import { cn } from '@/lib/cn'

const icons = {
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
}

const toneClasses = {
  success: 'bg-mint-500 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-ink-900 text-white',
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex w-80 items-start gap-3 rounded-xl bg-white p-3.5 shadow-panel"
          role="alert"
        >
          <span className={cn('mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full', toneClasses[t.variant])}>
            {icons[t.variant]}
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium text-ink-950">{t.title}</p>
            {t.description && <p className="mt-0.5 text-xs text-ink-700/60">{t.description}</p>}
          </div>
          <button onClick={() => dismiss(t.id)} className="text-ink-700/30 hover:text-ink-700">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}

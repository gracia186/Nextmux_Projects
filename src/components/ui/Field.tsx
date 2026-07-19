import { forwardRef } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface FieldWrapperProps {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
  htmlFor?: string
}

export function FieldWrapper({ label, error, hint, required, children, htmlFor }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-ink-800">
          {label} {required && <span className="text-clay-600">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-ink-700/60">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  )
}

const baseFieldClasses =
  'w-full rounded-lg border bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-700/40 transition-colors focus:border-brand-500 disabled:bg-ink-900/5 disabled:text-ink-700/50'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, className, id, ...props }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint} required={required} htmlFor={id}>
      <input
        ref={ref}
        id={id}
        className={cn(baseFieldClasses, error ? 'border-red-400' : 'border-ink-700/15', className)}
        {...props}
      />
    </FieldWrapper>
  )
)
Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, className, id, rows = 4, ...props }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint} required={required} htmlFor={id}>
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={cn(baseFieldClasses, 'resize-y', error ? 'border-red-400' : 'border-ink-700/15', className)}
        {...props}
      />
    </FieldWrapper>
  )
)
Textarea.displayName = 'Textarea'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  children: ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, required, className, id, children, ...props }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint} required={required} htmlFor={id}>
      <select
        ref={ref}
        id={id}
        className={cn(baseFieldClasses, error ? 'border-red-400' : 'border-ink-700/15', className)}
        {...props}
      >
        {children}
      </select>
    </FieldWrapper>
  )
)
Select.displayName = 'Select'

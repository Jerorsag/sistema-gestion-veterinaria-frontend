import type { InputHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: ReactNode
  error?: string
}

export const Input = ({ label, helperText, error, className, id, ...props }: InputProps) => {
  const inputId = id ?? props.name

  return (
    <label className="space-y-2 text-sm text-white/80" htmlFor={inputId}>
      {label && <span>{label}</span>}
      <input
        id={inputId}
        className={clsx(
          'w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-base text-white transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-white/40',
          error && 'border-red-400/70 focus:border-red-400 focus:ring-red-300/60',
          className,
        )}
        {...props}
      />
      {helperText && !error && <p className="text-xs text-white/60">{helperText}</p>}
      {error && <p className="text-xs text-red-300">{error}</p>}
    </label>
  )
}


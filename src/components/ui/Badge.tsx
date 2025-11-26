import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

type BadgeTone = 'success' | 'warning' | 'info' | 'neutral'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
}

const toneClasses: Record<BadgeTone, string> = {
  success: 'bg-[var(--color-surface-200)] text-[#2D2D2D] border border-[var(--color-border)]',
  warning: 'bg-amber-100 text-amber-800 border border-amber-200',
  info: 'bg-blue-100 text-blue-800 border border-blue-200',
  neutral: 'bg-[var(--color-surface-200)] text-[var(--color-muted)] border border-[var(--color-border)]',
}

export const Badge = ({ className, tone = 'neutral', ...props }: BadgeProps) => (
  <span
    className={clsx(
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
      toneClasses[tone],
      className,
    )}
    {...props}
  />
)


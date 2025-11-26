import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

type BadgeTone = 'success' | 'warning' | 'info' | 'neutral'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
}

const toneClasses: Record<BadgeTone, string> = {
  success: 'bg-emerald-400/20 text-emerald-200 border border-emerald-300/30',
  warning: 'bg-amber-400/15 text-amber-100 border border-amber-200/30',
  info: 'bg-sky-400/15 text-sky-100 border border-sky-200/30',
  neutral: 'bg-white/10 text-white border border-white/15',
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


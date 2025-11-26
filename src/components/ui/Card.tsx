import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode
  footer?: ReactNode
}

export const Card = ({ header, footer, className, children, ...props }: CardProps) => (
  <div
    className={clsx(
      'rounded-2xl border border-white/5 bg-white/5 backdrop-blur-[6px] shadow-[0_10px_40px_rgba(15,23,42,.35)]',
      className,
    )}
    {...props}
  >
    {header && <div className="border-b border-white/5 px-5 py-4">{header}</div>}
    <div className="px-5 py-4">{children}</div>
    {footer && <div className="border-t border-white/5 px-5 py-4">{footer}</div>}
  </div>
)


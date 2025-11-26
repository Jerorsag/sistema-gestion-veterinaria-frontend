import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode
  footer?: ReactNode
}

export const Card = ({ header, footer, className, children, ...props }: CardProps) => (
  <div
    className={clsx(
      'card-component card-border bg-surface transition-all duration-[var(--transition-base)]',
      className,
    )}
    style={{
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-card)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.setProperty('box-shadow', 'var(--shadow-card-hover)')
      e.currentTarget.style.setProperty('transform', 'translateY(-2px)')
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.setProperty('box-shadow', 'var(--shadow-card)')
      e.currentTarget.style.setProperty('transform', 'translateY(0)')
    }}
    {...props}
  >
    {header && <div className="card-border-divider border-b px-5 py-4">{header}</div>}
    <div className="px-5 py-4">{children}</div>
    {footer && <div className="card-border-divider border-t px-5 py-4">{footer}</div>}
  </div>
)


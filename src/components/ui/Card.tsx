import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode
  footer?: ReactNode
}

export const Card = ({ header, footer, className, children, ...props }: CardProps) => (
  <div
    className={clsx(
      'card-component bg-surface transition-all duration-[var(--transition-base)]',
      className,
    )}
    style={{
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-card)',
      border: 'none',
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
    {header && (
      <div 
        className="px-5 py-4"
        style={{
          borderBottomWidth: '0',
          boxShadow: '0 1px 0 rgba(139, 92, 246, 0.04)',
        }}
      >
        {header}
      </div>
    )}
    <div className="px-5 py-4">{children}</div>
    {footer && (
      <div 
        className="px-5 py-4"
        style={{
          borderTopWidth: '0',
          boxShadow: '0 -1px 0 rgba(139, 92, 246, 0.04)',
        }}
      >
        {footer}
      </div>
    )}
  </div>
)


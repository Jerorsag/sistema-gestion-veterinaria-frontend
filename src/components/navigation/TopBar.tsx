import type { ReactNode } from 'react'
import { Menu, Search } from 'lucide-react'
import clsx from 'clsx'

import { NotificationsDropdown } from './NotificationsDropdown'
import { UserMenu } from './UserMenu'

interface TopBarProps {
  title?: ReactNode
  onToggleSidebar?: () => void
}

export const TopBar = ({ title, onToggleSidebar }: TopBarProps) => (
  <header 
    className="dashboard-header sticky top-0 z-20 flex items-center justify-between gap-4 bg-surface px-4 py-4 md:px-6"
    style={{
      boxShadow: '0 2px 8px rgba(139, 92, 246, 0.04), 0 1px 3px rgba(0, 0, 0, 0.03)',
    }}
  >
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex items-center rounded-xl bg-[var(--color-surface-200)] p-2 text-[var(--color-muted)] transition hover:text-[var(--color-text-heading)] hover:bg-[var(--color-surface-200)]/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] md:hidden"
          style={{ boxShadow: 'var(--shadow-soft)' }}
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-muted)]">Panel</p>
          <h1 className="text-xl font-semibold text-[var(--color-text-heading)] truncate">{title ?? 'Dashboard'}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="hidden items-center gap-2 rounded-2xl bg-[var(--color-surface-200)] px-3 py-2 text-[var(--color-muted)] transition md:flex" style={{ boxShadow: 'var(--shadow-soft)' }}>
        <Search size={16} />
          <input
            className={clsx(
              'bg-transparent text-sm text-[var(--color-text-heading)] placeholder:text-[var(--color-muted)] focus:outline-none w-full min-w-[150px]',
            )}
            placeholder="Buscar módulo..."
          />
      </div>
      <NotificationsDropdown />
      <UserMenu />
    </div>
  </header>
)


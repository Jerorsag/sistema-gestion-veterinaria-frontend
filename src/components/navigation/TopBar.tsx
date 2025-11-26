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
  <header className="dashboard-header sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[var(--color-border)] bg-surface px-6 py-4">
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onToggleSidebar}
        className="inline-flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-200)] p-2 text-[var(--color-muted)] transition hover:text-[#2D2D2D] hover:bg-[var(--color-surface)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] md:hidden"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-muted)]">Panel</p>
        <h1 className="text-xl font-semibold text-[#2D2D2D]">{title ?? 'Dashboard'}</h1>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <div className="hidden items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-200)] px-3 py-2 text-[var(--color-muted)] transition md:flex">
        <Search size={16} />
        <input
          className={clsx(
            'bg-transparent text-sm text-[#2D2D2D] placeholder:text-[var(--color-muted)] focus:outline-none',
          )}
          placeholder="Buscar módulo..."
        />
      </div>
      <NotificationsDropdown />
      <UserMenu />
    </div>
  </header>
)


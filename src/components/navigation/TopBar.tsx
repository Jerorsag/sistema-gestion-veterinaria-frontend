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
  <header className="dashboard-header sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/5 bg-surface/70 px-6 py-4 backdrop-blur-xl">
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onToggleSidebar}
        className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:hidden"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/50">Panel</p>
        <h1 className="text-xl font-semibold text-white">{title ?? 'Dashboard'}</h1>
      </div>
    </div>

    <div className="flex items-center gap-3">
      <div className="hidden items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-3 py-2 text-white/70 transition md:flex">
        <Search size={16} />
        <input
          className={clsx(
            'bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none',
          )}
          placeholder="Buscar módulo..."
        />
      </div>
      <NotificationsDropdown />
      <UserMenu />
    </div>
  </header>
)


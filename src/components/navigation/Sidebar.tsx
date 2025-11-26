import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

export interface SidebarItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: string
}

interface SidebarProps {
  items: SidebarItem[]
  isOpen: boolean
  onNavigate?: () => void
}

export const Sidebar = ({ items, isOpen, onNavigate }: SidebarProps) => (
  <aside
    className={clsx(
      'dashboard-sidebar fixed inset-y-0 left-0 z-30 flex w-[260px] flex-col border-r border-white/5 bg-surface/80 px-4 py-6 backdrop-blur-xl transition-transform duration-300 md:static md:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full',
    )}
  >
    <div className="mb-8 flex items-center gap-3 px-2">
      <div className="h-10 w-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-black tracking-tight">
        SGV
      </div>
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/60">Sistema</p>
        <p className="text-lg font-semibold text-white">Gestión Veterinaria</p>
      </div>
    </div>

    <nav className="flex flex-1 flex-col gap-1">
      {items.map(({ label, href, icon: Icon, badge }) => (
        <NavLink
          key={href}
          to={href}
          onClick={onNavigate}
          className={({ isActive }) =>
            clsx(
              'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
              isActive ? 'bg-primary/15 text-primary' : 'text-white/70 hover:bg-white/5 hover:text-white',
            )
          }
        >
          <Icon size={18} className="transition group-hover:scale-105" />
          <span className="flex-1">{label}</span>
          {badge && (
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white/70">
              {badge}
            </span>
          )}
        </NavLink>
      ))}
    </nav>

    <p className="mt-6 px-2 text-xs text-white/40">© {new Date().getFullYear()} SGV. Todos los derechos reservados.</p>
  </aside>
)


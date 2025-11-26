import { Outlet, useLocation } from 'react-router-dom'
import {
  BellRing,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  NotebookTabs,
  Package,
  Receipt,
  Stethoscope,
  Users,
  UserRound,
} from 'lucide-react'

import { Sidebar } from '@/components/navigation/Sidebar'
import { TopBar } from '@/components/navigation/TopBar'
import { Button } from '@/components/ui/Button'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useSessionStore } from '@/core/store/session-store'
import { useLogoutMutation } from '@/hooks/auth'

const navItems = [
  { label: 'Inicio', href: '/app', icon: LayoutDashboard },
  { label: 'Usuarios', href: '/app/usuarios', icon: Users },
  { label: 'Mascotas', href: '/app/mascotas', icon: Stethoscope },
  { label: 'Citas', href: '/app/citas', icon: CalendarDays },
  { label: 'Consultas', href: '/app/consultas', icon: ClipboardList },
  { label: 'Historias clínicas', href: '/app/historias', icon: NotebookTabs },
  { label: 'Inventario', href: '/app/inventario', icon: Package },
  { label: 'Notificaciones', href: '/app/notificaciones', icon: BellRing },
  { label: 'Facturación', href: '/app/facturacion', icon: Receipt },
  { label: 'Mi perfil', href: '/app/perfil', icon: UserRound },
]

export const DashboardLayout = () => {
  const { isOpen, toggle, close } = useDisclosure(false)
  const user = useSessionStore((state) => state.user)
  const logoutMutation = useLogoutMutation()
  const location = useLocation()

  return (
    <div className="dashboard-shell flex min-h-screen bg-base text-white">
      <Sidebar items={navItems} isOpen={isOpen} onNavigate={close} />
      {isOpen && <div className="fixed inset-0 z-20 bg-black/60 md:hidden" onClick={close} />}

      <div className="dashboard-main flex w-full flex-col md:pl-[260px]">
        <TopBar title="SGV Dashboard" onToggleSidebar={toggle} />

        <main className="dashboard-content flex-1 space-y-8 overflow-y-auto px-6 py-8">
          <section className="grid gap-4 rounded-3xl border border-white/5 bg-white/5 px-6 py-5 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-white/40">Ruta actual</p>
                <h2 className="text-2xl font-semibold">{location.pathname}</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/40">Usuario activo</p>
                  <p className="text-sm font-semibold">
                    {user?.nombre_completo ?? 'Sesión demo'}
                  </p>
                </div>
                <Button variant="ghost" onClick={() => logoutMutation.mutate()}>
                  {logoutMutation.isPending ? 'Saliendo...' : 'Cerrar sesión'}
                </Button>
              </div>
            </div>
          </section>

          <section className="min-h-[calc(100vh-320px)] rounded-3xl border border-white/5 bg-surface/70 px-6 py-6 shadow-2xl shadow-black/40 backdrop-blur-2xl">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  )
}


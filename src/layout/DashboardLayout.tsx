import { Outlet } from 'react-router-dom'

import { Sidebar } from '@/components/navigation/Sidebar'
import { TopBar } from '@/components/navigation/TopBar'
import { useDisclosure } from '@/hooks/useDisclosure'
import { useSessionStore } from '@/core/store/session-store'
import { getNavigationItemsForRole } from '@/core/permissions/rolePermissions'

export const DashboardLayout = () => {
  const { isOpen, toggle, close } = useDisclosure(false)
  const userRoles = useSessionStore((state) => state.user?.roles ?? [])
  const navigationItems = getNavigationItemsForRole(userRoles)

  return (
    <div className="dashboard-shell flex min-h-screen bg-base text-[#2D2D2D]">
      <Sidebar items={navigationItems} isOpen={isOpen} onNavigate={close} />
      {isOpen && <div className="fixed inset-0 z-20 bg-black/20 md:hidden" onClick={close} />}

      <div className="dashboard-main flex w-full flex-col md:pl-[260px]">
        <TopBar title="SGV Dashboard" onToggleSidebar={toggle} />

        <main className="dashboard-content flex-1 space-y-8 overflow-y-auto px-6 py-8">
          <section className="min-h-[calc(100vh-320px)] rounded-3xl border border-[var(--color-border)] bg-surface px-6 py-6 shadow-soft">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  )
}


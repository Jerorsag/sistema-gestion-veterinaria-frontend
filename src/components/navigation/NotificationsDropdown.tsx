import { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'

export const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const unreadCount = 0 // TODO: Conectar con el módulo de notificaciones

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center rounded-xl border border-white/10 bg-white/10 p-2.5 transition-colors hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-label="Notificaciones"
      >
        <Bell size={20} className="text-white/80" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-white/10 bg-surface-200 shadow-xl">
          <div className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Notificaciones</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
                  {unreadCount} nuevas
                </span>
              )}
            </div>

            <div className="max-h-96 space-y-2 overflow-y-auto">
              {unreadCount === 0 ? (
                <div className="py-8 text-center">
                  <Bell size={32} className="mx-auto mb-2 text-white/20" />
                  <p className="text-sm text-white/60">No hay notificaciones nuevas</p>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-sm text-white/60">Las notificaciones estarán disponibles próximamente</p>
                </div>
              )}
            </div>

            {unreadCount > 0 && (
              <button className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10">
                Ver todas las notificaciones
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}


import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserRound, LogOut, ChevronDown } from 'lucide-react'
import clsx from 'clsx'

import { useSessionStore } from '@/core/store/session-store'
import { useLogoutMutation } from '@/hooks/auth'

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const user = useSessionStore((state) => state.user)
  const logoutMutation = useLogoutMutation()
  const navigate = useNavigate()

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

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate('/auth/login')
      },
    })
  }

  const initials = user?.nombre_completo
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 transition-colors hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary text-sm font-semibold">
          {initials}
        </div>
        <div className="hidden flex-col items-start text-left md:flex">
          <span className="text-xs text-white/60">Usuario</span>
          <span className="text-sm font-medium text-white">{user?.nombre_completo || 'Usuario'}</span>
        </div>
        <ChevronDown size={16} className={clsx('text-white/60 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-white/10 bg-surface-200 shadow-xl">
          <div className="p-2">
            <div className="mb-2 rounded-lg border-b border-white/10 px-3 py-2">
              <p className="text-xs text-white/60">Conectado como</p>
              <p className="text-sm font-semibold text-white">{user?.nombre_completo || 'Usuario'}</p>
              <p className="text-xs text-white/50">{user?.email}</p>
            </div>

            <Link
              to="/app/perfil"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <UserRound size={18} />
              <span>Mi perfil</span>
            </Link>

            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200 disabled:opacity-50"
            >
              <LogOut size={18} />
              <span>{logoutMutation.isPending ? 'Cerrando sesión...' : 'Cerrar sesión'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


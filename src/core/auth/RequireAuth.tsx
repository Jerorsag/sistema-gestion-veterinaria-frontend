import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useSessionStore } from '@/core/store/session-store'

interface RequireAuthProps {
  children: ReactNode
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const location = useLocation()
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}


import { Navigate } from 'react-router-dom'

import { useSessionStore } from '@/core/store/session-store'

export const LandingRedirect = () => {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)
  return <Navigate to={isAuthenticated ? '/app' : '/auth/login'} replace />
}


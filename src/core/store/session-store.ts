import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { SessionUser } from '@/core/types/auth'

interface SessionState {
  user: SessionUser | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

interface SessionActions {
  setSession: (payload: { user: SessionUser; accessToken: string; refreshToken?: string | null }) => void
  clearSession: () => void
}

export const useSessionStore = create<SessionState & SessionActions>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setSession: ({ user, accessToken, refreshToken }) =>
        set({
          user,
          accessToken,
          refreshToken: refreshToken ?? null,
          isAuthenticated: true,
        }),
      clearSession: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'sgv-session',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)


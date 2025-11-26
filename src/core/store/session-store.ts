import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { SessionUser } from '@/core/types/auth'

interface SessionState {
  user: SessionUser | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  hydrated: boolean
}

interface SessionActions {
  setSession: (payload: { user: SessionUser; accessToken: string; refreshToken?: string | null }) => void
  setTokens: (payload: { accessToken: string; refreshToken?: string | null }) => void
  setUser: (user: SessionUser | null) => void
  markHydrated: (value?: boolean) => void
  clearSession: () => void
}

export const useSessionStore = create<SessionState & SessionActions>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      hydrated: false,
      setSession: ({ user, accessToken, refreshToken }) =>
        set({
          user,
          accessToken,
          refreshToken: refreshToken ?? null,
          isAuthenticated: true,
        }),
      setTokens: ({ accessToken, refreshToken }) =>
        set((state) => ({
          accessToken,
          refreshToken: refreshToken ?? state.refreshToken,
          isAuthenticated: state.user ? true : state.isAuthenticated,
        })),
      setUser: (user) =>
        set((state) => ({
          user,
          isAuthenticated: Boolean(user && state.accessToken),
        })),
      markHydrated: (value = true) => set({ hydrated: value }),
      clearSession: () =>
        set((state) => ({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          hydrated: state.hydrated || true,
        })),
    }),
    {
      name: 'sgv-session',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        hydrated: state.hydrated,
      }),
    },
  ),
)


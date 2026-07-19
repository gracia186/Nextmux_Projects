import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types/common'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  setSession: (user: User, token: string) => void
  setUser: (user: User) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setSession: (user, token) => set({ user, token, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      clearSession: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'nextmux-auth',
    }
  )
)

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  AuthUser, Role, ensureSeeded, verifyCredentials, registerUser as reg, saveSession, loadSession, clearSession,
} from '../auth/auth'

interface AuthState {
  user: AuthUser | null
  ready: boolean
  login: (email: string, password: string, remember: boolean) => Promise<AuthUser>
  register: (fullName: string, email: string, password: string) => Promise<AuthUser>
  logout: () => void
  can: (...roles: Role[]) => boolean
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    ensureSeeded()
      .then(() => {
        if (cancelled) return
        setUser(loadSession())
        setReady(true)
      })
      .catch(() => {
        if (!cancelled) {
          setUser(loadSession())
          setReady(true)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = async (email: string, password: string, remember: boolean) => {
    const authUser = await verifyCredentials(email, password)
    if (!authUser) throw new Error('Invalid email or password')
    saveSession(authUser, remember)
    setUser(authUser)
    return authUser
  }

  const register = async (fullName: string, email: string, password: string) => {
    const authUser = await reg(fullName, email, password)
    saveSession(authUser, true)
    setUser(authUser)
    return authUser
  }

  const logout = () => {
    clearSession()
    setUser(null)
  }

  const can = (...roles: Role[]) => (user ? roles.includes(user.role) : false)

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout, can }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthState => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
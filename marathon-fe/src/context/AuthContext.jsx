import { createContext, useCallback, useEffect, useState } from 'react'
import { authService, tokenStore } from '../services/auth.service.js'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = tokenStore.get()
    if (!token) {
      setIsLoading(false)
      return
    }
    authService
      .getMe()
      .then(setUser)
      .catch(() => tokenStore.remove())
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const u = await authService.login({ email, password })
    setUser(u)
    return u
  }, [])

  const register = useCallback(async (data) => {
    const u = await authService.register(data)
    setUser(u)
    return u
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

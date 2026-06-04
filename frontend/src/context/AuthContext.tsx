import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import api from '../utils/api'

interface User {
  id: number
  username: string
  name: string | null
  email: string | null
  avatar_url: string | null
  bio: string | null
  location: string | null
  public_repos: number
  followers: number
  following: number
  is_public: boolean
  created_at: string
  last_synced_at: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (token: string) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('clutch_token')
    if (token) {
      api.get('/users/me')
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('clutch_token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (token: string): Promise<User> => {
    localStorage.setItem('clutch_token', token)
    const res = await api.get('/users/me')
    setUser(res.data)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('clutch_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
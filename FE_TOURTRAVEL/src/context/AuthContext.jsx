import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, loginUser, loginWithGoogle, registerUser, updateCurrentUser } from '../api/tourService'

const AuthContext = createContext(null)

const STORAGE_KEY = 'tourtravel_auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      setLoading(false)
      return
    }

    try {
      const saved = JSON.parse(raw)
      setUser(saved.user || null)
      setToken(saved.token || '')
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!token) return
    getCurrentUser(token)
      .then((currentUser) => {
        setUser(currentUser)
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: currentUser }))
      })
      .catch(() => {
        logout()
      })
  }, [token])

  const persistAuth = (payload) => {
    setToken(payload.token)
    setUser(payload.user)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }

  const login = async (credentials) => {
    const payload = await loginUser(credentials)
    persistAuth(payload)
    return payload
  }

  const register = async (credentials) => {
    const payload = await registerUser(credentials)
    persistAuth(payload)
    return payload
  }

  const googleLogin = async (credential) => {
    const payload = await loginWithGoogle(credential)
    persistAuth(payload)
    return payload
  }

  const updateProfile = async (profileData) => {
    const updatedUser = await updateCurrentUser(profileData, token)
    setUser(updatedUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: updatedUser }))
    return updatedUser
  }

  const logout = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, googleLogin, logout, updateProfile, isAuthenticated: Boolean(token) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

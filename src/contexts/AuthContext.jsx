import { createContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('userToken')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }

    setLoading(false)
  }, [])

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData)
      const data = response.data

      if (data.success) {
        setToken(data.token)
        setUser(data.user)
        localStorage.setItem('userToken', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        return { success: true, data }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message }
    }
  }

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      const data = response.data

      if (data.success) {
        setToken(data.token)
        setUser(data.user)
        localStorage.setItem('userToken', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        return { success: true, data }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || error.message }
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('userToken')
    localStorage.removeItem('user')
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signup,
        login,
        logout,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

import { createContext, useState, useEffect } from 'react'

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
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      const data = await response.json()

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
      return { success: false, message: error.message }
    }
  }

  const login = async (credentials) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

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
      return { success: false, message: error.message }
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

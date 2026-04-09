import { createContext, useContext, useState, useEffect } from 'react'
import { adminAPI } from '../services/api'
import toast from 'react-hot-toast'

const AdminAuthContext = createContext()

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if admin is logged in on app start
    const token = localStorage.getItem('adminToken')
    if (token) {
      // Verify token by fetching profile
      adminAPI.getProfile()
        .then(response => {
          if (response.data.success) {
            setAdmin(response.data.admin)
          }
        })
        .catch(() => {
          // Token invalid, remove it
          localStorage.removeItem('adminToken')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const signup = async (adminData) => {
    try {
      const response = await adminAPI.signup(adminData)
      if (response.data.success) {
        const { admin, token } = response.data
        localStorage.setItem('adminToken', token)
        setAdmin(admin)
        toast.success('Admin account created successfully!')
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const signin = async (credentials) => {
    try {
      const response = await adminAPI.signin(credentials)
      if (response.data.success) {
        const { admin, token } = response.data
        localStorage.setItem('adminToken', token)
        setAdmin(admin)
        toast.success('Login successful!')
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setAdmin(null)
    toast.success('Logged out successfully')
  }

  const value = {
    admin,
    loading,
    signup,
    signin,
    logout,
    isAuthenticated: !!admin
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}
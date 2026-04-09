import { Link, useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import { AuthContext } from '../contexts/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { admin, isAuthenticated: isAdminAuth, logout: adminLogout } = useAdminAuth()
  const { user, isAuthenticated: isUserAuth, logout: userLogout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleAdminLogout = () => {
    adminLogout()
    setIsOpen(false)
  }

  const handleUserLogout = () => {
    userLogout()
    setIsOpen(false)
    navigate('/')
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <nav className="bg-gradient-to-r from-yoga-600 to-yoga-700 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 font-bold text-white text-xl hover:text-yoga-50 transition">
            <span className="text-2xl">🧘</span>
            <span>GYPL 2026</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="text-white hover:text-yoga-50 transition">Home</Link>
            <Link to="/register" className="text-white hover:text-yoga-50 transition">Register</Link>
            
            {isUserAuth ? (
              <>
                <Link to="/my-events" className="text-white hover:text-yoga-50 transition">My Events</Link>
                <span className="text-yoga-50 text-sm">Welcome, {user?.name}</span>
                <button
                  onClick={handleUserLogout}
                  className="text-white hover:text-yoga-50 transition underline"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-yoga-50 transition">Login</Link>
                <Link to="/signup" className="text-white hover:text-yoga-50 transition">Sign Up</Link>
              </>
            )}
            
            {isAdminAuth ? (
              <>
                <Link to="/admin" className="text-white hover:text-yoga-50 transition">Admin</Link>
                <span className="text-yoga-50 text-sm">Admin: {admin?.name}</span>
                <button
                  onClick={handleAdminLogout}
                  className="text-white hover:text-yoga-50 transition underline"
                >
                  Admin Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/admin/signin" className="text-white hover:text-yoga-50 transition">Admin</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block text-white hover:text-yoga-50 py-2" onClick={closeMenu}>Home</Link>
            <Link to="/register" className="block text-white hover:text-yoga-50 py-2" onClick={closeMenu}>Register</Link>
            
            {isUserAuth ? (
              <>
                <Link to="/my-events" className="block text-white hover:text-yoga-50 py-2" onClick={closeMenu}>My Events</Link>
                <span className="block text-yoga-50 text-sm py-2">Welcome, {user?.name}</span>
                <button
                  onClick={handleUserLogout}
                  className="block text-white hover:text-yoga-50 py-2 text-left w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-white hover:text-yoga-50 py-2" onClick={closeMenu}>Login</Link>
                <Link to="/signup" className="block text-white hover:text-yoga-50 py-2" onClick={closeMenu}>Sign Up</Link>
              </>
            )}
            
            {isAdminAuth ? (
              <>
                <Link to="/admin" className="block text-white hover:text-yoga-50 py-2" onClick={closeMenu}>Admin</Link>
                <span className="block text-yoga-50 text-sm py-2">Admin: {admin?.name}</span>
                <button
                  onClick={handleAdminLogout}
                  className="block text-white hover:text-yoga-50 py-2 text-left w-full"
                >
                  Admin Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/admin/signin" className="block text-white hover:text-yoga-50 py-2" onClick={closeMenu}>Admin</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

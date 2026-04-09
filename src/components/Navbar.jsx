import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAdminAuth } from '../contexts/AdminAuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { admin, isAuthenticated, logout } = useAdminAuth()

  const handleLogout = () => {
    logout()
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
            {isAuthenticated ? (
              <>
                <Link to="/admin" className="text-white hover:text-yoga-50 transition">Dashboard</Link>
                <span className="text-yoga-50 text-sm">Welcome, {admin?.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-yoga-50 transition underline"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/admin/signin" className="text-white hover:text-yoga-50 transition">Admin Login</Link>
                <Link to="/admin/signup" className="text-white hover:text-yoga-50 transition">Admin Signup</Link>
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
            <Link to="/" className="block text-white hover:text-yoga-50 py-2" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/register" className="block text-white hover:text-yoga-50 py-2" onClick={() => setIsOpen(false)}>Register</Link>
            {isAuthenticated ? (
              <>
                <Link to="/admin" className="block text-white hover:text-yoga-50 py-2" onClick={() => setIsOpen(false)}>Dashboard</Link>
                <span className="block text-yoga-50 text-sm py-2">Welcome, {admin?.name}</span>
                <button
                  onClick={handleLogout}
                  className="block text-white hover:text-yoga-50 py-2 text-left w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/admin/signin" className="block text-white hover:text-yoga-50 py-2" onClick={() => setIsOpen(false)}>Admin Login</Link>
                <Link to="/admin/signup" className="block text-white hover:text-yoga-50 py-2" onClick={() => setIsOpen(false)}>Admin Signup</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

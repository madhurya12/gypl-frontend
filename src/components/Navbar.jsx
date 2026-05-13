import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import { AuthContext } from '../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LogOut, Shield } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { admin, isAuthenticated: isAdminAuth, logout: adminLogout } = useAdminAuth()
  const { user, isAuthenticated: isUserAuth, logout: userLogout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/register', label: 'Register' },
  ]

  return (
    <motion.nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-white/20 shadow-md'
          : 'bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 font-bold text-slate-800 text-xl hover:text-teal-600 transition-colors">
            <motion.div
              className="text-3xl opacity-100 contrast-110"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              🧘
            </motion.div>
            <span className="font-display font-bold">GYPL 2026</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1 items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-teal-50 text-teal-600 font-semibold shadow-sm'
                    : 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {isUserAuth ? (
              <>
                <Link
                  to="/my-events"
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/my-events')
                      ? 'bg-teal-50 text-teal-600 font-semibold shadow-sm'
                      : 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'
                  }`}
                >
                  My Events
                </Link>
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-200">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <User size={16} />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleUserLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-700 hover:text-teal-600 hover:bg-slate-50 transition-all duration-300"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-slate-700 hover:text-teal-600 hover:bg-slate-50 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}

            {isAdminAuth ? (
              <>
                <Link
                  to="/admin"
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/admin')
                      ? 'bg-teal-50 text-teal-600 font-semibold shadow-sm'
                      : 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'
                  }`}
                >
                  Admin
                </Link>
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-200">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <Shield size={16} />
                    <span className="text-sm font-medium">{admin?.name}</span>
                  </div>
                  <button
                    onClick={handleAdminLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-700 hover:text-teal-600 hover:bg-slate-50 transition-all duration-300"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/admin/signin"
                className="px-4 py-2 rounded-lg text-slate-700 hover:text-teal-600 hover:bg-slate-50 transition-all duration-300"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-700 p-2 rounded-lg hover:bg-slate-50 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden pb-4 space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ duration: 0.3 }}
              transition={{ duration: 0.3 }}
            >
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-teal-50 text-teal-600 font-semibold shadow-sm'
                        : 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'
                    }`}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {isUserAuth ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      to="/my-events"
                      className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive('/my-events')
                          ? 'bg-teal-50 text-teal-600 font-semibold shadow-sm'
                          : 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'
                      }`}
                      onClick={closeMenu}
                    >
                      My Events
                    </Link>
                  </motion.div>
                  <motion.div
                    className="flex items-center justify-between px-4 py-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center space-x-2 text-slate-700">
                      <User size={16} />
                      <span className="text-sm font-medium">{user?.name}</span>
                    </div>
                    <button
                      onClick={handleUserLogout}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-700 hover:text-teal-600 hover:bg-slate-50 transition-all duration-300"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      to="/login"
                      className="block px-4 py-3 rounded-lg text-slate-700 hover:text-teal-600 hover:bg-slate-50 transition-all duration-300"
                      onClick={closeMenu}
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      to="/signup"
                      className="block btn-primary mx-4"
                      onClick={closeMenu}
                    >
                      Sign Up
                    </Link>
                  </motion.div>
                </>
              )}

              {isAdminAuth ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link
                      to="/admin"
                      className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive('/admin')
                          ? 'bg-teal-50 text-teal-600 font-semibold shadow-sm'
                          : 'text-slate-700 hover:text-teal-600 hover:bg-slate-50'
                      }`}
                      onClick={closeMenu}
                    >
                      Admin
                    </Link>
                  </motion.div>
                  <motion.div
                    className="flex items-center justify-between px-4 py-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center space-x-2 text-slate-700">
                      <Shield size={16} />
                      <span className="text-sm font-medium">{admin?.name}</span>
                    </div>
                    <button
                      onClick={handleAdminLogout}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-slate-700 hover:text-teal-600 hover:bg-slate-50 transition-all duration-300"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    to="/admin/signin"
                    className="block px-4 py-3 rounded-lg text-slate-700 hover:text-teal-600 hover:bg-slate-50 transition-all duration-300"
                    onClick={closeMenu}
                  >
                    Admin
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

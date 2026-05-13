import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import { AuthContext } from '../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LogOut, Shield, Sparkles } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { admin, isAuthenticated: isAdminAuth, logout: adminLogout } = useAdminAuth()
  const { user, isAuthenticated: isUserAuth, logout: userLogout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8)
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

  const closeMenu = () => setIsOpen(false)
  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/register', label: 'Register' },
  ]

  const linkClass = (path) =>
    `px-3.5 py-2 rounded-lg text-sm transition-all duration-200 ${
      isActive(path)
        ? 'bg-primary-50 text-primary-700 font-semibold'
        : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100 font-medium'
    }`

  return (
    <motion.nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl border-b border-surface-200/70 shadow-soft'
          : 'bg-white/60 backdrop-blur-md border-b border-transparent'
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            onClick={closeMenu}
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-soft-md group-hover:shadow-soft-lg transition-shadow">
              <Sparkles size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-surface-900 text-base tracking-tight">
                GYPL <span className="text-primary-600">'26</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-surface-500 font-medium -mt-0.5">
                Yoga Premier League
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className={linkClass(item.path)}>
                {item.label}
              </Link>
            ))}

            {isUserAuth ? (
              <>
                <Link to="/my-events" className={linkClass('/my-events')}>
                  My Events
                </Link>
                <div className="flex items-center gap-2 ml-3 pl-3 border-l border-surface-200">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-100">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                      <User size={12} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-surface-700">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </div>
                  <button
                    onClick={handleUserLogout}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-surface-600 hover:text-surface-900 hover:bg-surface-100 transition-all"
                    title="Logout"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-surface-100 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-soft transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {isAdminAuth ? (
              <>
                <Link to="/admin" className={linkClass('/admin') + ' ml-2'}>
                  Admin
                </Link>
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-surface-200">
                  <div className="flex items-center gap-1.5 text-surface-600">
                    <Shield size={14} />
                    <span className="text-sm">{admin?.name}</span>
                  </div>
                  <button
                    onClick={handleAdminLogout}
                    className="p-2 rounded-lg text-surface-600 hover:text-surface-900 hover:bg-surface-100"
                    title="Admin logout"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/admin/signin"
                className="ml-2 px-3 py-2 rounded-lg text-sm font-medium text-surface-500 hover:text-surface-900 hover:bg-surface-100 transition-all"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-surface-700 hover:bg-surface-100 transition-colors"
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={22} />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden overflow-hidden border-t border-surface-200/70"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="py-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-4 py-2.5 rounded-lg text-sm transition-all ${
                      isActive(item.path)
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-surface-700 hover:bg-surface-100'
                    }`}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ))}

                {isUserAuth ? (
                  <>
                    <Link
                      to="/my-events"
                      className={`block px-4 py-2.5 rounded-lg text-sm transition-all ${
                        isActive('/my-events')
                          ? 'bg-primary-50 text-primary-700 font-semibold'
                          : 'text-surface-700 hover:bg-surface-100'
                      }`}
                      onClick={closeMenu}
                    >
                      My Events
                    </Link>
                    <div className="flex items-center justify-between px-4 py-3 mt-2 bg-surface-100 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                          <User size={14} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-surface-700">
                          {user?.name}
                        </span>
                      </div>
                      <button
                        onClick={handleUserLogout}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-surface-600 hover:bg-white"
                      >
                        <LogOut size={14} />
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="pt-2 space-y-2">
                    <Link
                      to="/login"
                      className="block px-4 py-2.5 rounded-lg text-sm text-surface-700 hover:bg-surface-100"
                      onClick={closeMenu}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block mx-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-primary-600 text-white text-center"
                      onClick={closeMenu}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}

                <div className="pt-2 mt-2 border-t border-surface-200/70">
                  {isAdminAuth ? (
                    <>
                      <Link
                        to="/admin"
                        className="block px-4 py-2.5 rounded-lg text-sm text-surface-700 hover:bg-surface-100"
                        onClick={closeMenu}
                      >
                        Admin Dashboard
                      </Link>
                      <div className="flex items-center justify-between px-4 py-2">
                        <div className="flex items-center gap-2 text-surface-600">
                          <Shield size={14} />
                          <span className="text-sm">{admin?.name}</span>
                        </div>
                        <button
                          onClick={handleAdminLogout}
                          className="text-sm text-surface-600 hover:text-surface-900"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <Link
                      to="/admin/signin"
                      className="block px-4 py-2.5 rounded-lg text-sm text-surface-500 hover:bg-surface-100"
                      onClick={closeMenu}
                    >
                      Admin
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

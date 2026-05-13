import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { User, Mail, Phone, Lock, ArrowRight, Sparkles } from 'lucide-react'
import { AuthContext } from '../contexts/AuthContext'

export default function Signup() {
  const navigate = useNavigate()
  const { signup } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    else if (formData.name.length > 100) newErrors.name = 'Name is too long'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email'
    if (!formData.phone) newErrors.phone = 'Phone number is required'
    else if (!/^[0-9]{10}$/.test(formData.phone))
      newErrors.phone = 'Phone must be 10 digits'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters'
    if (!formData.confirmPassword)
      newErrors.confirmPassword = 'Please confirm password'
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fill all fields correctly')
      return
    }
    setLoading(true)
    try {
      const result = await signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      })
      if (result.success) {
        toast.success('Account created — welcome!')
        setTimeout(() => navigate('/'), 1000)
      } else {
        toast.error(result.message || 'Signup failed')
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'name', label: 'Full name', type: 'text', icon: User, placeholder: 'Your full name' },
    { name: 'email', label: 'Email address', type: 'email', icon: Mail, placeholder: 'you@example.com' },
    { name: 'phone', label: 'Phone number', type: 'tel', icon: Phone, placeholder: '10-digit number' },
    { name: 'password', label: 'Password', type: 'password', icon: Lock, placeholder: 'At least 6 characters' },
    { name: 'confirmPassword', label: 'Confirm password', type: 'password', icon: Lock, placeholder: 'Re-enter your password' },
  ]

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center py-16 px-4 overflow-hidden bg-surface-50">
      <div className="absolute inset-0 bg-grid bg-grid-fade opacity-50 pointer-events-none" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary-100/40 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-6"
            aria-label="GYPL Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-soft-md">
              <Sparkles size={18} className="text-white" strokeWidth={2.5} />
            </div>
          </Link>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-surface-900 tracking-tightest mb-2">
            Create your account
          </h1>
          <p className="text-surface-600 text-sm">
            Join GYPL '26 — register for competitions in seconds
          </p>
        </div>

        <div className="bg-white border border-surface-200/70 rounded-2xl shadow-soft p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, label, type, icon: Icon, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  {label}
                </label>
                <div className="relative">
                  <Icon
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none"
                  />
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`input pl-10 ${errors[name] ? 'input-error' : ''}`}
                  />
                </div>
                {errors[name] && (
                  <p className="text-red-500 text-xs mt-1.5">{errors[name]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 group"
            >
              {loading ? (
                'Creating account...'
              ) : (
                <>
                  Create Account
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-surface-100 text-center">
            <p className="text-sm text-surface-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-600 font-semibold hover:text-primary-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

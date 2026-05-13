import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const StatsCard = ({ icon, value, label, delay = 0, accent = 'primary' }) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof value === 'number') {
        const increment = Math.max(1, value / 40)
        let current = 0
        const counter = setInterval(() => {
          current += increment
          if (current >= value) {
            setDisplayValue(value)
            clearInterval(counter)
          } else {
            setDisplayValue(Math.floor(current))
          }
        }, 28)
        return () => clearInterval(counter)
      } else {
        setDisplayValue(value)
      }
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [value, delay])

  const accents = {
    primary: 'bg-primary-50 text-primary-600 ring-primary-100',
    secondary: 'bg-secondary-50 text-secondary-600 ring-secondary-100',
    surface: 'bg-surface-100 text-surface-700 ring-surface-200',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      className="group bg-white border border-surface-200/70 rounded-2xl p-7 shadow-soft hover:shadow-soft-lg hover:border-surface-300/80 transition-all duration-200"
    >
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ring-1 ring-inset mb-5 ${accents[accent]}`}>
        {icon}
      </div>
      <div className="text-4xl font-display font-bold text-surface-900 mb-1.5 tracking-tight">
        {typeof value === 'number' ? displayValue.toLocaleString() : displayValue}
      </div>
      <p className="text-surface-500 text-sm font-medium">{label}</p>
    </motion.div>
  )
}

export default StatsCard

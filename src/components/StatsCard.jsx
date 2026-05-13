import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Card from './Card'

const StatsCard = ({ icon, value, label, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof value === 'number') {
        const increment = value / 50
        let current = 0
        const counter = setInterval(() => {
          current += increment
          if (current >= value) {
            setDisplayValue(value)
            clearInterval(counter)
          } else {
            setDisplayValue(Math.floor(current))
          }
        }, 30)
      } else {
        setDisplayValue(value)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <Card glass className="text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <motion.div
          className="text-4xl font-bold gradient-text mb-2"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
        >
          {typeof value === 'number' ? displayValue.toLocaleString() : displayValue}
        </motion.div>
        <p className="text-gray-600 font-medium">{label}</p>
      </Card>
    </motion.div>
  )
}

export default StatsCard
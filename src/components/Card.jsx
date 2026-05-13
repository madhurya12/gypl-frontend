import { motion } from 'framer-motion'

const Card = ({
  children,
  className = '',
  glass = false,
  hover = true,
  ...props
}) => {
  const baseClasses = 'rounded-2xl p-6 transition-all duration-300'

  const glassClasses = glass
    ? 'bg-white/70 backdrop-blur-md border border-white/20 shadow-xl'
    : 'bg-white shadow-lg'

  const hoverClasses = hover ? 'hover:shadow-2xl hover:-translate-y-1' : ''

  const classes = `${baseClasses} ${glassClasses} ${hoverClasses} ${className}`

  return (
    <motion.div
      className={classes}
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card
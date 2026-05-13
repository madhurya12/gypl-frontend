import { motion } from 'framer-motion'

const Card = ({
  children,
  className = '',
  glass = false,
  hover = true,
  padded = true,
  ...props
}) => {
  const base = 'rounded-2xl transition-all duration-200'
  const padding = padded ? 'p-7' : ''
  const surface = glass
    ? 'bg-white/60 backdrop-blur-xl border border-white/70 shadow-soft-md'
    : 'bg-white border border-surface-200/70 shadow-soft'
  const hoverClasses = hover
    ? 'hover:shadow-soft-lg hover:border-surface-300/80'
    : ''

  return (
    <motion.div
      className={`${base} ${padding} ${surface} ${hoverClasses} ${className}`}
      whileHover={hover ? { y: -3 } : {}}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card

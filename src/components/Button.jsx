import { motion } from 'framer-motion'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center'

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-primary-500',
    secondary: 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-white/50',
    outline: 'bg-transparent border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-primary-500',
    glass: 'glass text-gray-800 hover:bg-white/20 shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-white/50'
  }

  const sizes = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg'
  }

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed transform-none' : ''} ${className}`

  return (
    <motion.button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button
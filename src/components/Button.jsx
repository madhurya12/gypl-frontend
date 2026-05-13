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
  const base =
    'font-semibold rounded-xl transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-50 inline-flex items-center justify-center gap-2 whitespace-nowrap'

  const variants = {
    primary:
      'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white shadow-soft-md hover:shadow-soft-lg focus-visible:ring-primary-500',
    secondary:
      'bg-surface-900 hover:bg-surface-800 text-white shadow-soft-md hover:shadow-soft-lg focus-visible:ring-surface-500',
    outline:
      'bg-white border border-surface-200 hover:bg-surface-50 hover:border-surface-300 text-surface-900 shadow-soft focus-visible:ring-primary-500',
    ghost:
      'bg-transparent text-surface-700 hover:bg-surface-100 focus-visible:ring-surface-400',
    accent:
      'bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700 text-white shadow-soft-md hover:shadow-soft-lg focus-visible:ring-secondary-500',
    glass:
      'bg-white/70 backdrop-blur-md border border-white/80 text-surface-900 hover:bg-white shadow-soft focus-visible:ring-primary-500',
  }

  const sizes = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-3.5 px-8 text-base',
    xl: 'py-4 px-10 text-lg',
  }

  const classes = `${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  } ${className}`

  return (
    <motion.button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      whileHover={!disabled ? { y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button

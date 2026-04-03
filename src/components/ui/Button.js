'use client'

import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

export default function Button({ children, className, variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-brand text-dark hover:bg-brand/90 shadow-[0_0_20px_rgba(56,189,248,0.3)]',
    outline: 'border border-brand/50 text-brand hover:bg-brand/10',
    glass: 'glass text-white hover:bg-white/5',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'px-6 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  )
}

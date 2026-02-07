import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  hover?: boolean
  delay?: number
  noPad?: boolean
}

export default function GlassCard({ children, className = '', hover = true, delay = 0, noPad = false }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={hover ? {
        y: -3,
        scale: 1.005,
        transition: { duration: 0.3 }
      } : undefined}
      className={`${hover ? 'liquid-glass' : 'liquid-glass-static'} relative ${className}`}
    >
      <div className={`relative z-10 ${noPad ? '' : ''}`}>
        {children}
      </div>
    </motion.div>
  )
}

'use client'

import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Subtle reveal-on-scroll wrapper. Fades + rises its children in once when they
 * enter the viewport. No horizontal movement (no layout shift / scrollbars) and
 * a no-op under prefers-reduced-motion. Wraps full-width sections without
 * altering their internal layout.
 */
export function SectionReveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

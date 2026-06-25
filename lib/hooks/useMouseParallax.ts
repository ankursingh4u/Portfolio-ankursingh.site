'use client'

import { useEffect } from 'react'
import { useMotionValue, useSpring, useReducedMotion, type MotionValue } from 'framer-motion'

/**
 * Subtle pointer parallax for the hero. Returns spring-smoothed x/y motion
 * values (in px) that drift toward the cursor's offset from the viewport
 * centre, clamped to ±`max`. Honors prefers-reduced-motion (stays at 0,0).
 */
export function useMouseParallax(max = 18): { x: MotionValue<number>; y: MotionValue<number> } {
  const reduce = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 60, damping: 18, mass: 0.6 })
  const y = useSpring(rawY, { stiffness: 60, damping: 18, mass: 0.6 })

  useEffect(() => {
    if (reduce) {
      rawX.set(0)
      rawY.set(0)
      return
    }
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) return

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2 // -1..1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2
      rawX.set(nx * max)
      rawY.set(ny * max)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduce, max, rawX, rawY])

  return { x, y }
}

'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * A glowing dot + lagging ring that replaces the native cursor while the pointer
 * is over the hero (#home). Morphs to a "VISIT" crosshair over planets
 * (elements marked [data-cursor-visit]). Desktop fine-pointer only; never
 * renders on touch. The native cursor returns everywhere outside the hero —
 * including the tour overlay, which is portaled to <body> (outside #home).
 */
export function CustomCursor() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [visit, setVisit] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  // Ring lags slightly behind the dot for a fluid feel (instant if reduced-motion).
  const ringX = useSpring(x, reduce ? { duration: 0 } : { stiffness: 350, damping: 28, mass: 0.5 })
  const ringY = useSpring(y, reduce ? { duration: 0 } : { stiffness: 350, damping: 28, mass: 0.5 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
      const inHero = !!el?.closest('#home') && !el?.closest('[data-solar-tour]')
      setVisible(inHero)
      setVisit(!!el?.closest('[data-cursor-visit]'))
    }
    const onLeave = () => setVisible(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <>
      {/* Hide the native cursor only over the hero. */}
      <style>{`@media (pointer: fine){#home, #home *{cursor:none !important;}}`}</style>

      {/* Lagging ring */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[90] rounded-full border border-white/70 mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: visit ? 56 : 40,
          height: visit ? 56 : 40,
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {visit && (
          <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] font-semibold tracking-widest text-white">
            VISIT
          </span>
        )}
      </motion.div>

      {/* Leading dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[90] h-3 w-3 rounded-full bg-white mix-blend-difference"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible ? 1 : 0, scale: visit ? 0.5 : 1 }}
        transition={{ duration: 0.15 }}
      />
    </>
  )
}

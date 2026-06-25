'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useUniverse } from '@/lib/hooks/useUniverse'

/**
 * A brief, subtle light-bloom when travelling between home and a world.
 * (No streak lines — the camera zoom + blur carries the motion; this just
 * smooths the cut with a soft flash in the destination's colour.)
 */
export function WarpField() {
  const reduce = useReducedMotion()
  const { warping, active } = useUniverse()
  const accent = active?.accent ?? '#9bc2ff'

  if (reduce) return null

  return (
    <AnimatePresence>
      {warping && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accent}33 0%, transparent 60%)`,
          }}
        />
      )}
    </AnimatePresence>
  )
}

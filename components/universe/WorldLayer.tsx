'use client'

import { AnimatePresence } from 'framer-motion'
import { useUniverse } from '@/lib/hooks/useUniverse'
import { AboutWorld } from './worlds/AboutWorld'
import { WorkWorld } from './worlds/WorkWorld'
import { PricingWorld } from './worlds/PricingWorld'
import { ContactWorld } from './worlds/ContactWorld'

export function WorldLayer() {
  const { phase, active } = useUniverse()
  const show = phase === 'world' && active?.kind === 'world'

  return (
    <AnimatePresence>
      {show && active && (
        <Render key={active.destId} destId={active.destId!} />
      )}
    </AnimatePresence>
  )
}

function Render({ destId }: { destId: string }) {
  const { active } = useUniverse()
  if (!active) return null
  switch (destId) {
    case 'work':
      return <WorkWorld nav={active} />
    case 'about':
      return <AboutWorld nav={active} />
    case 'pricing':
      return <PricingWorld nav={active} />
    case 'contact':
      return <ContactWorld nav={active} />
    default:
      return null
  }
}

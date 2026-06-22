'use client'

import { ProgressBar } from './ProgressBar'

interface CyberEffectsProviderProps {
  children: React.ReactNode
}

/**
 * Lightweight effects wrapper for the light theme.
 * The heavy CRT / matrix / mouse-trail / glitch overlays were removed in favour
 * of a clean white landing-page feel. Only a subtle scroll progress bar remains.
 */
export function CyberEffectsProvider({ children }: CyberEffectsProviderProps) {
  return (
    <>
      <ProgressBar />
      {children}
    </>
  )
}

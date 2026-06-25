'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { PLANET_NAV, TOUR_ORDER, type PlanetNav } from '@/lib/solar-nav'

/**
 * Tour step model:
 *   index 0            → intro (the Sun / Ankur)
 *   index 1..N         → one planet spotlight each, in TOUR_ORDER
 *   index N + 1        → finale
 */
export type TourStepKind = 'intro' | 'planet' | 'finale'

export interface TourStep {
  kind: TourStepKind
  planet?: PlanetNav
}

export interface SolarTourApi {
  isOpen: boolean
  step: number
  total: number
  current: TourStep
  /** 1-based index among the planet spotlights, for the progress dots (0 when not on a planet). */
  planetIndex: number
  planetCount: number
  open: () => void
  close: () => void
  next: () => void
  prev: () => void
  goToPlanet: (i: number) => void
}

const AUTO_ADVANCE_MS = 3200

export function useSolarTour(): SolarTourApi {
  const steps = useMemo<TourStep[]>(() => {
    const planets = TOUR_ORDER.map((name) => ({ kind: 'planet' as const, planet: PLANET_NAV[name] }))
    return [{ kind: 'intro' }, ...planets, { kind: 'finale' }]
  }, [])

  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState(0)

  const total = steps.length
  const current = steps[step] ?? steps[0]
  const planetCount = TOUR_ORDER.length
  const planetIndex = current.kind === 'planet' ? step : 0

  const open = useCallback(() => {
    setStep(0)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => setIsOpen(false), [])

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, total - 1))
  }, [total])

  const prev = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0))
  }, [])

  const goToPlanet = useCallback((i: number) => {
    // i is 1-based planet position → step = i (intro occupies step 0).
    setStep(Math.min(Math.max(i, 1), total - 1))
  }, [total])

  // Auto-advance the intro step only; planet steps wait for the user.
  useEffect(() => {
    if (!isOpen || current.kind !== 'intro') return
    const t = setTimeout(() => setStep((s) => Math.min(s + 1, total - 1)), AUTO_ADVANCE_MS)
    return () => clearTimeout(t)
  }, [isOpen, current.kind, total])

  // Keyboard: Esc closes, arrows navigate, Enter advances.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight' || e.key === 'Enter') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    // Lock background scroll while the tour is open.
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, close, next, prev])

  return {
    isOpen,
    step,
    total,
    current,
    planetIndex,
    planetCount,
    open,
    close,
    next,
    prev,
    goToPlanet,
  }
}

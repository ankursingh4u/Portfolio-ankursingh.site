'use client'

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { PLANETS } from '@/lib/ephemeris'
import { navigateTo } from '@/lib/solar-nav'
import { siteConfig } from '@/lib/site-config'
import type { SolarTourApi } from '@/lib/hooks/useSolarTour'

const EASE = [0.16, 1, 0.3, 1] as const

const COLOR_BY_NAME: Record<string, string> = Object.fromEntries(
  PLANETS.map((p) => [p.name, p.color]),
)

function Sphere({ color, size, sun = false }: { color: string; size: number; sun?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="rounded-full"
      style={{
        width: size,
        height: size,
        background: sun
          ? 'radial-gradient(circle at 50% 50%, #fff7d6 0%, #ffd34d 38%, #f59e0b 70%, #ea7a0b 100%)'
          : `radial-gradient(circle at 32% 30%, rgba(255,255,255,0.9), ${color} 48%, rgba(0,0,0,0.55) 100%)`,
        boxShadow: sun
          ? '0 0 60px 16px rgba(245,158,11,0.55), 0 0 140px 40px rgba(245,158,11,0.3)'
          : `0 0 ${Math.round(size * 0.55)}px ${color}aa`,
      }}
    />
  )
}

function Confetti() {
  const reduce = useReducedMotion()
  const pieces = useMemo(() => {
    // Deterministic burst (no Math.random — keeps SSR/strict-mode stable).
    const palette = ['#ffd34d', '#5b8def', '#d96f43', '#a8e0e6', '#e8cda2', '#ffffff']
    return Array.from({ length: 42 }, (_, i) => {
      const angle = (i / 42) * Math.PI * 2
      const dist = 120 + (i % 7) * 28
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 40,
        rot: (i % 2 ? 1 : -1) * (180 + (i % 5) * 90),
        color: palette[i % palette.length],
        size: 6 + (i % 4) * 2,
        delay: (i % 6) * 0.02,
      }
    })
  }, [])

  if (reduce) return null

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-10" aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-[2px]"
          style={{ width: p.size, height: p.size * 0.5, backgroundColor: p.color }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
          animate={{ opacity: 0, x: p.x, y: p.y, rotate: p.rot, scale: 0.6 }}
          transition={{ duration: 1.1, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

export function SolarTour({ tour }: { tour: SolarTourApi }) {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { isOpen, current, planetIndex, planetCount, next, prev, close, goToPlanet } = tour
  const dur = reduce ? 0 : 0.5

  if (!mounted) return null

  const overlay = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-solar-tour
          role="dialog"
          aria-modal="true"
          aria-label="Guided tour of Ankur Singh's portfolio, presented as a solar system"
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-black/80 px-5 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.35 }}
        >
          {/* Close */}
          <button
            type="button"
            onClick={close}
            aria-label="Close tour"
            className="absolute right-5 top-5 z-20 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-xs text-white/80 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            esc · close ✕
          </button>

          <div className="flex w-full max-w-3xl flex-col items-center gap-8 text-center md:flex-row md:items-center md:gap-12 md:text-left">
            {/* Spotlight visual */}
            <div className="relative flex h-44 w-44 shrink-0 items-center justify-center md:h-56 md:w-56">
              {current.kind === 'finale' && <Confetti />}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.kind === 'planet' ? current.planet!.name : current.kind}
                  initial={{ scale: reduce ? 1 : 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: reduce ? 1 : 0.4, opacity: 0 }}
                  transition={{ duration: dur, ease: EASE }}
                  className="flex items-center justify-center"
                >
                  {current.kind === 'planet' ? (
                    <Sphere color={COLOR_BY_NAME[current.planet!.name] ?? '#888'} size={reduce ? 110 : 132} />
                  ) : (
                    <Sphere color="#f59e0b" size={reduce ? 120 : 150} sun />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Glass info card */}
            <div className="w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`card-${current.kind}-${current.kind === 'planet' ? current.planet!.name : ''}`}
                  initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -14 }}
                  transition={{ duration: dur, ease: EASE }}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl md:p-7"
                >
                  {current.kind === 'intro' && (
                    <>
                      <p className="font-mono text-xs uppercase tracking-widest text-amber-300/90">the sun</p>
                      <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
                        Start with me — {siteConfig.name}
                      </h2>
                      <p className="mt-1 text-sm font-medium text-indigo-200">Generalist Software Engineer</p>
                      <p className="mt-4 text-sm leading-relaxed text-slate-300">
                        I create systems. Each planet is a part of my world — let me fly you through them.
                      </p>
                    </>
                  )}

                  {current.kind === 'planet' && (
                    <>
                      <p className="font-mono text-xs uppercase tracking-widest text-indigo-300/90">
                        {current.planet!.name} → {current.planet!.label}
                      </p>
                      <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">{current.planet!.label}</h2>
                      <p className="mt-4 text-sm leading-relaxed text-slate-300">{current.planet!.desc}</p>
                      <button
                        type="button"
                        onClick={() => {
                          const nav = current.planet!
                          close()
                          // let the overlay unmount before scrolling
                          setTimeout(() => navigateTo(nav), reduce ? 0 : 200)
                        }}
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-colors hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                      >
                        Go there →
                      </button>
                    </>
                  )}

                  {current.kind === 'finale' && (
                    <>
                      <p className="font-mono text-xs uppercase tracking-widest text-emerald-300/90">tour complete</p>
                      <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
                        You&apos;ve seen my universe.
                      </h2>
                      <p className="mt-4 text-sm leading-relaxed text-slate-300">
                        Let&apos;s build something real together.
                      </p>
                      <div className="mt-5 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                        <button
                          type="button"
                          onClick={() => {
                            close()
                            setTimeout(
                              () => navigateTo({ name: 'Saturn', label: 'Contact', kind: 'section', target: '#contact', desc: '' }),
                              reduce ? 0 : 200,
                            )
                          }}
                          className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-colors hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                        >
                          Get in touch →
                        </button>
                        <button
                          type="button"
                          onClick={close}
                          className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                        >
                          Back to site
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Footer controls */}
              <div className="mt-6 flex items-center justify-between gap-4">
                {/* Progress dots */}
                <div className="flex items-center gap-1.5" role="tablist" aria-label="Tour progress">
                  {Array.from({ length: planetCount }, (_, i) => {
                    const active = planetIndex === i + 1
                    return (
                      <button
                        key={i}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-label={`Planet ${i + 1} of ${planetCount}`}
                        onClick={() => goToPlanet(i + 1)}
                        className="grid h-4 w-4 place-items-center focus-visible:outline-none"
                      >
                        <span
                          className={`block rounded-full transition-all ${
                            active ? 'h-2 w-2 bg-white' : 'h-1.5 w-1.5 bg-white/30 hover:bg-white/60'
                          } ${active && !reduce ? 'animate-pulse' : ''}`}
                        />
                      </button>
                    )
                  })}
                </div>

                {/* Prev / Next */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prev}
                    disabled={current.kind === 'intro'}
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-xs text-white/80 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    ← prev
                  </button>
                  {current.kind !== 'finale' && (
                    <button
                      type="button"
                      onClick={next}
                      className="rounded-full border border-white/25 bg-white/10 px-4 py-2 font-mono text-xs font-semibold text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                      next →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(overlay, document.body)
}

'use client'

import { type ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { PlanetNav } from '@/lib/universe-nav'
import { useUniverse } from '@/lib/hooks/useUniverse'

export function PlanetWorld({
  nav,
  eyebrow,
  title,
  intro,
  children,
}: {
  nav: PlanetNav
  eyebrow: string
  title: string
  intro?: string
  children: ReactNode
}) {
  const reduce = useReducedMotion()
  const { exitWorld } = useUniverse()
  const accent = nav.accent

  return (
    <motion.section
      role="dialog"
      aria-modal="true"
      aria-label={`${nav.label} world`}
      className="fixed inset-0 z-50 overflow-y-auto bg-[#05070f]/95 backdrop-blur-md"
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.12, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
      transition={{ duration: reduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Atmospheric glow in the planet's colour */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background: `radial-gradient(120% 80% at 50% -10%, ${accent}22 0%, transparent 55%)`,
        }}
      />

      {/* Top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/5 bg-[#05070f]/70 px-5 py-3 backdrop-blur-xl md:px-8">
        <button
          type="button"
          onClick={exitWorld}
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 font-mono text-xs text-white/80 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">←</span>
          back to space
        </button>

        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-white/40">
          <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
          {nav.name}
        </div>

        <button
          type="button"
          onClick={exitWorld}
          aria-label="Close and return to the solar system"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-lg text-white/70 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="relative mx-auto w-full max-w-5xl px-5 py-10 md:px-8 md:py-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: accent }}>
            {eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white md:text-6xl">{title}</h1>
          {intro && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
              {intro}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.28 }}
          className="mt-12"
        >
          {children}
        </motion.div>
      </div>
    </motion.section>
  )
}

/** A reusable dark glass card used across worlds. */
export function GlassCard({
  children,
  className = '',
  accent,
}: {
  children: ReactNode
  className?: string
  accent?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition-colors hover:border-white/20 ${className}`}
      style={accent ? { boxShadow: `inset 0 1px 0 0 ${accent}22` } : undefined}
    >
      {children}
    </div>
  )
}

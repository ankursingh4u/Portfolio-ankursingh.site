'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { PLANETS, positionFor } from '@/lib/ephemeris'
import { PLANET_NAV, navigateTo } from '@/lib/solar-nav'
import { useMouseParallax } from '@/lib/hooks/useMouseParallax'

/** How many simulated days pass per real second (keeps inner planets visibly moving). */
const DAYS_PER_SECOND = 8
const MS_PER_DAY = 86400000

// Pre-compute the orbit-radius weighting so all 8 orbits fit on screen.
const aValues = PLANETS.map((p) => p.el[0])
const pw = (a: number) => Math.pow(a, 0.42)
const pMin = pw(Math.min(...aValues))
const pMax = pw(Math.max(...aValues))
const orbitFraction = (a: number) => 0.13 + 0.85 * ((pw(a) - pMin) / (pMax - pMin))

// Deterministic starfield (same on server & client → no hydration mismatch).
function makeStars(seed: number, count: number) {
  let s = seed
  const r = () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
  return Array.from({ length: count }, () => ({
    x: r() * 100,
    y: r() * 100,
    size: r() * 1.8 + 0.4,
    op: r() * 0.6 + 0.2,
    delay: r() * 4,
  }))
}
const STARS = makeStars(20260623, 110)

export function SolarSystem({ fill = false }: { fill?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const planetRefs = useRef<(HTMLDivElement | null)[]>([])
  const [R, setR] = useState(0)
  const [mounted, setMounted] = useState(false)
  const dark = fill
  const reduce = useReducedMotion()

  const stars = useMemo(() => STARS, [])
  const parallax = useMouseParallax(fill ? 18 : 0)

  // Measure the container so orbits scale with the available space.
  useEffect(() => {
    const measure = () => {
      const el = wrapRef.current
      if (!el) return
      setR(fill ? Math.max(el.clientWidth, el.clientHeight) / 2 : el.clientWidth / 2)
    }
    measure()
    setMounted(true)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [fill])

  // Animation loop — advance simulated time, place each planet at its real angle.
  // With prefers-reduced-motion we place every planet exactly once and stop.
  useEffect(() => {
    if (!R) return
    const baseMs = Date.now()
    const startPerf = performance.now()
    let raf = 0

    const place = (simDate: Date) => {
      for (let i = 0; i < PLANETS.length; i++) {
        const node = planetRefs.current[i]
        if (!node) continue
        const { longitude } = positionFor(PLANETS[i], simDate)
        const orbR = orbitFraction(PLANETS[i].el[0]) * R
        const x = orbR * Math.cos(longitude)
        const y = orbR * Math.sin(longitude)
        node.style.setProperty('--ox', `${x.toFixed(2)}px`)
        node.style.setProperty('--oy', `${y.toFixed(2)}px`)
        node.style.transform = `translate(-50%, -50%) translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`
      }
    }

    if (reduce) {
      place(new Date(baseMs))
      return
    }

    const tick = () => {
      const elapsedSec = (performance.now() - startPerf) / 1000
      place(new Date(baseMs + elapsedSec * DAYS_PER_SECOND * MS_PER_DAY))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [R, reduce])

  const sunSize = fill ? 64 : 46
  const planetScale = fill ? 1.9 : 1

  return (
    <div
      ref={wrapRef}
      className={
        fill
          ? 'pointer-events-none absolute inset-0 h-full w-full'
          : 'pointer-events-none relative mx-auto aspect-square w-full max-w-[560px]'
      }
    >
      {/* Parallax layer — drifts toward the cursor; static under reduced-motion. */}
      <motion.div className="absolute inset-0" style={fill ? { x: parallax.x, y: parallax.y } : undefined}>
        {/* Starfield (dark mode only) */}
        {dark &&
          stars.map((st, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="twinkle-star absolute rounded-full bg-white"
              style={{
                left: `${st.x}%`,
                top: `${st.y}%`,
                width: st.size,
                height: st.size,
                opacity: st.op,
                '--tw-dur': `${3 + (i % 4)}s`,
                '--tw-delay': `${st.delay}s`,
              } as React.CSSProperties}
            />
          ))}

        {/* Orbit rings */}
        {mounted &&
          R > 0 &&
          PLANETS.map((p) => {
            const d = orbitFraction(p.el[0]) * R * 2
            return (
              <div
                key={`ring-${p.name}`}
                aria-hidden="true"
                className={`absolute left-1/2 top-1/2 rounded-full border ${
                  dark ? 'border-white/[0.07]' : 'border-slate-300/50'
                }`}
                style={{ width: d, height: d, transform: 'translate(-50%, -50%)' }}
              />
            )
          })}

        {/* The Sun */}
        <div aria-hidden="true" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="sun-core" style={{ width: sunSize, height: sunSize }} />
        </div>

        {/* Planets — interactive navigation nodes */}
        {PLANETS.map((p, i) => {
          const px = Math.max(7, Math.round((p.size * 3.4 + 4) * planetScale))
          const nav = PLANET_NAV[p.name]
          const isLink = nav?.kind === 'link'
          const ariaLabel = nav
            ? isLink
              ? `Open ${nav.label.replace(' ↗', '')} (${p.name}) in a new tab`
              : `Go to ${nav.label} section (${p.name})`
            : p.name

          const sphere = (
            <span
              className="block rounded-full ring-1 ring-black/20 transition-transform duration-200 group-hover:scale-[1.6] group-focus-visible:scale-[1.6]"
              style={{
                width: px,
                height: px,
                background: `radial-gradient(circle at 32% 30%, rgba(255,255,255,0.85), ${p.color} 46%, rgba(0,0,0,0.5) 100%)`,
                boxShadow: `0 0 ${Math.round(px * 0.8)}px ${p.color}${dark ? '88' : '55'}`,
              }}
            />
          )

          const label = (
            <span
              className={`pointer-events-none absolute left-1/2 bottom-full mb-2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-medium opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 ${
                dark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
              }`}
            >
              {nav ? (
                <>
                  <span className="font-mono">{nav.label}</span>
                  <span className={dark ? 'ml-1.5 text-slate-500' : 'ml-1.5 text-slate-400'}>· {p.name}</span>
                </>
              ) : (
                p.name
              )}
            </span>
          )

          const saturnRing = p.name === 'Saturn' && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border"
              style={{
                width: px * 2.1,
                height: px * 0.7,
                borderColor: dark ? 'rgba(227,210,160,0.6)' : 'rgba(245,200,120,0.7)',
                transform: 'translate(-50%, -50%) rotate(-18deg)',
              }}
            />
          )

          const innerClass =
            'group relative grid -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full outline-none pointer-events-auto focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent'

          return (
            <div
              key={p.name}
              ref={(el) => {
                planetRefs.current[i] = el
              }}
              className="absolute left-1/2 top-1/2 z-10"
              style={{ opacity: mounted ? 1 : 0, transition: 'opacity 1s ease' }}
            >
              {nav && isLink ? (
                <a
                  href={nav.target}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={ariaLabel}
                  data-cursor-visit
                  className={innerClass}
                >
                  {saturnRing}
                  {sphere}
                  {label}
                </a>
              ) : (
                <button
                  type="button"
                  aria-label={ariaLabel}
                  data-cursor-visit
                  onClick={() => nav && navigateTo(nav)}
                  className={innerClass}
                >
                  {saturnRing}
                  {sphere}
                  {label}
                </button>
              )}
            </div>
          )
        })}
      </motion.div>

      <style jsx>{`
        .sun-core {
          border-radius: 9999px;
          background: radial-gradient(circle at 50% 50%, #fff7d6 0%, #ffd34d 38%, #f59e0b 70%, #ea7a0b 100%);
          box-shadow:
            0 0 28px 8px rgba(245, 158, 11, 0.6),
            0 0 70px 22px rgba(245, 158, 11, 0.4),
            0 0 150px 50px rgba(245, 158, 11, 0.22);
          animation: sunPulse 4s ease-in-out infinite;
        }
        .twinkle-star {
          animation: twinkle var(--tw-dur, 3s) ease-in-out var(--tw-delay, 0s) infinite;
        }
        @keyframes sunPulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.18); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.9; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sun-core { animation: none; }
          .twinkle-star { animation: none; }
        }
      `}</style>
    </div>
  )
}

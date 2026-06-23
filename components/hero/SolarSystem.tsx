'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { PLANETS, positionFor } from '@/lib/ephemeris'

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

  const stars = useMemo(() => STARS, [])

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
  useEffect(() => {
    if (!R) return
    const baseMs = Date.now()
    const startPerf = performance.now()
    let raf = 0
    const tick = () => {
      const elapsedSec = (performance.now() - startPerf) / 1000
      const simDate = new Date(baseMs + elapsedSec * DAYS_PER_SECOND * MS_PER_DAY)
      for (let i = 0; i < PLANETS.length; i++) {
        const node = planetRefs.current[i]
        if (!node) continue
        const { longitude } = positionFor(PLANETS[i], simDate)
        const orbR = orbitFraction(PLANETS[i].el[0]) * R
        const x = orbR * Math.cos(longitude)
        const y = orbR * Math.sin(longitude)
        node.style.transform = `translate(-50%, -50%) translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [R])

  const sunSize = fill ? 64 : 46
  const planetScale = fill ? 1.9 : 1

  return (
    <div
      ref={wrapRef}
      className={fill ? 'absolute inset-0 h-full w-full' : 'relative mx-auto aspect-square w-full max-w-[560px]'}
      aria-hidden="true"
    >
      {/* Starfield (dark mode only) */}
      {dark &&
        stars.map((st, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${st.x}%`,
              top: `${st.y}%`,
              width: st.size,
              height: st.size,
              opacity: st.op,
              animation: `twinkle ${3 + (i % 4)}s ease-in-out ${st.delay}s infinite`,
            }}
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
              className={`absolute left-1/2 top-1/2 rounded-full border ${
                dark ? 'border-white/[0.07]' : 'border-slate-300/50'
              }`}
              style={{ width: d, height: d, transform: 'translate(-50%, -50%)' }}
            />
          )
        })}

      {/* The Sun */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="sun-core" style={{ width: sunSize, height: sunSize }} />
      </div>

      {/* Planets */}
      {PLANETS.map((p, i) => {
        const px = Math.max(7, Math.round((p.size * 3.4 + 4) * planetScale))
        return (
          <div
            key={p.name}
            ref={(el) => {
              planetRefs.current[i] = el
            }}
            className="group absolute left-1/2 top-1/2 z-10"
            style={{ opacity: mounted ? 1 : 0, transition: 'opacity 1s ease' }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              {/* realistic shaded sphere */}
              <div
                className="rounded-full ring-1 ring-black/20 transition-transform duration-200 group-hover:scale-[1.6] cursor-default"
                style={{
                  width: px,
                  height: px,
                  background: `radial-gradient(circle at 32% 30%, rgba(255,255,255,0.85), ${p.color} 46%, rgba(0,0,0,0.5) 100%)`,
                  boxShadow: `0 0 ${Math.round(px * 0.8)}px ${p.color}${dark ? '88' : '55'}`,
                }}
              />
              {/* Saturn ring */}
              {p.name === 'Saturn' && (
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border"
                  style={{
                    width: px * 2.1,
                    height: px * 0.7,
                    borderColor: dark ? 'rgba(227,210,160,0.6)' : 'rgba(245,200,120,0.7)',
                    transform: 'translate(-50%, -50%) rotate(-18deg)',
                  }}
                />
              )}
              {/* hover label */}
              <span
                className={`pointer-events-none absolute left-1/2 bottom-full mb-2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-medium opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 ${
                  dark ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                }`}
              >
                {p.name}
              </span>
            </div>
          </div>
        )
      })}

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
        @keyframes sunPulse {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.18); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.9; }
        }
      `}</style>
    </div>
  )
}

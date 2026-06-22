'use client'

import { useEffect, useRef, useState } from 'react'
import { PLANETS, positionFor } from '@/lib/ephemeris'

/** How many simulated days pass per real second (keeps inner planets visibly moving). */
const DAYS_PER_SECOND = 8
const MS_PER_DAY = 86400000

// Pre-compute the orbit-radius weighting so all 8 orbits fit on screen.
// Real semi-major axes span 0.39 → 30 AU, so we log/power-compress them.
const aValues = PLANETS.map((p) => p.el[0])
const pw = (a: number) => Math.pow(a, 0.42)
const pMin = pw(Math.min(...aValues))
const pMax = pw(Math.max(...aValues))
const orbitFraction = (a: number) => 0.17 + 0.81 * ((pw(a) - pMin) / (pMax - pMin))

export function SolarSystem() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const planetRefs = useRef<(HTMLDivElement | null)[]>([])
  const [R, setR] = useState(0) // half of the square's pixel size
  const [mounted, setMounted] = useState(false)

  // Measure the container so orbits scale with the available space.
  useEffect(() => {
    const measure = () => {
      if (wrapRef.current) setR(wrapRef.current.clientWidth / 2)
    }
    measure()
    setMounted(true)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Animation loop — advance simulated time and place each planet at its real angle.
  useEffect(() => {
    if (!R) return
    const baseMs = Date.now() // real "now" → real positions for today
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

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto aspect-square w-full max-w-[560px]"
      aria-hidden="true"
    >
      {/* Orbit rings */}
      {mounted &&
        R > 0 &&
        PLANETS.map((p) => {
          const d = orbitFraction(p.el[0]) * R * 2
          return (
            <div
              key={`ring-${p.name}`}
              className="absolute left-1/2 top-1/2 rounded-full border border-slate-300/50"
              style={{
                width: d,
                height: d,
                transform: 'translate(-50%, -50%)',
              }}
            />
          )
        })}

      {/* The Sun */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="sun-core" />
      </div>

      {/* Planets */}
      {PLANETS.map((p, i) => {
        const px = Math.max(6, Math.round(p.size * 3.4 + 4))
        return (
          <div
            key={p.name}
            ref={(el) => {
              planetRefs.current[i] = el
            }}
            className="group absolute left-1/2 top-1/2 z-10"
            style={{
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.8s ease',
            }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              {/* planet body */}
              <div
                className="rounded-full ring-1 ring-black/10 transition-transform duration-200 group-hover:scale-[1.7] cursor-default"
                style={{
                  width: px,
                  height: px,
                  background: `radial-gradient(circle at 32% 30%, #ffffff55, ${p.color})`,
                  boxShadow: `0 0 ${px}px ${p.color}66`,
                }}
              />
              {/* Saturn ring accent */}
              {p.name === 'Saturn' && (
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-amber-300/70"
                  style={{
                    width: px * 2.1,
                    height: px * 0.7,
                    transform: 'translate(-50%, -50%) rotate(-18deg)',
                  }}
                />
              )}
              {/* hover label */}
              <span className="pointer-events-none absolute left-1/2 bottom-full mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                {p.name}
              </span>
            </div>
          </div>
        )
      })}

      <style jsx>{`
        .sun-core {
          width: 46px;
          height: 46px;
          border-radius: 9999px;
          background: radial-gradient(circle at 50% 50%, #fff7d6 0%, #ffd34d 38%, #f59e0b 70%, #ea7a0b 100%);
          box-shadow:
            0 0 24px 6px rgba(245, 158, 11, 0.55),
            0 0 60px 18px rgba(245, 158, 11, 0.35),
            0 0 120px 40px rgba(245, 158, 11, 0.18);
          animation: sunPulse 4s ease-in-out infinite;
        }
        @keyframes sunPulse {
          0%, 100% {
            box-shadow:
              0 0 24px 6px rgba(245, 158, 11, 0.55),
              0 0 60px 18px rgba(245, 158, 11, 0.35),
              0 0 120px 40px rgba(245, 158, 11, 0.18);
          }
          50% {
            box-shadow:
              0 0 30px 8px rgba(245, 158, 11, 0.7),
              0 0 78px 22px rgba(245, 158, 11, 0.45),
              0 0 150px 52px rgba(245, 158, 11, 0.22);
          }
        }
      `}</style>
    </div>
  )
}

'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { PLANETS, positionFor } from '@/lib/ephemeris'
import { PLANET_NAV } from '@/lib/universe-nav'
import { useUniverse } from '@/lib/hooks/useUniverse'

const TWO_PI = Math.PI * 2
const aMin = Math.min(...PLANETS.map((p) => p.el[0]))

// Orbit radii are spaced EVENLY by planet rank (sun-outward) so every orbit is
// clearly separated — physical distances are wildly uneven (Venus & Earth would
// overlap), and the radii were never to scale anyway. Real angles are kept.
const ORBIT_FRAC = PLANETS.map((_, i) => 0.18 + 0.8 * (i / (PLANETS.length - 1)))

// Synthetic orbital speed (rad/sec). We keep each planet's REAL starting angle
// from the ephemeris, but give it a *visible* angular velocity so the whole
// system is alive — inner planets faster than outer (Kepler-like), but the
// range is compressed so even Neptune visibly drifts instead of looking frozen.
const INNER_PERIOD_SEC = 16 // innermost planet completes an orbit in ~16s
const omegaFor = (a: number) => TWO_PI / (INNER_PERIOD_SEC * Math.pow(a / aMin, 0.55))

// Deterministic starfield (identical on server & client → no hydration mismatch).
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
const STARS = makeStars(20260626, 150)

export function SolarStage() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const planetRefs = useRef<(HTMLDivElement | null)[]>([])
  const [R, setR] = useState(0)
  const [mounted, setMounted] = useState(false)
  const reduce = useReducedMotion()

  const { camera, frozen, enterWorld, registerPlanet, setSpotlight, tourActive, tourIndex, openBio } =
    useUniverse()

  const stars = useMemo(() => STARS, [])

  // Phones zoom in just as hard but on a tiny viewport, so the camera ends up
  // chasing a fast inner planet across a heavily-magnified view — nauseating.
  // Detect a small screen once and soften the whole tour: gentler spring, less
  // zoom, slower orbits. Desktop is left exactly as-is.
  const [isSmall] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768,
  )

  // ── Camera as springs so it can smoothly FOLLOW a moving planet ──────────
  // Mobile stays a touch softer than desktop (less nausea on a small viewport),
  // but firm enough to visibly ARRIVE within a card's dwell — too limp reads as
  // "nothing happened".
  const camSpring = isSmall
    ? { stiffness: 52, damping: 26, mass: 1 }
    : { stiffness: 60, damping: 18, mass: 1 }
  const scaleMV = useSpring(1, camSpring)
  const xMV = useSpring(0, camSpring)
  const yMV = useSpring(0, camSpring)
  const opacityMV = useSpring(1, { stiffness: 120, damping: 26 })
  const blurMV = useSpring(0, { stiffness: 120, damping: 26 })
  const filterMV = useTransform(blurMV, (b) => `blur(${b}px)`)

  // Is the tour currently flying alongside a planet? (sun/finale use camera state)
  const followingName =
    tourActive && tourIndex >= 1 && tourIndex <= PLANETS.length
      ? (['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'] as const)[
          tourIndex - 1
        ]
      : null
  const spotlightName = followingName
  const followNav = followingName ? PLANET_NAV[followingName] : null

  // The rAF loop reads tour state through a ref so the loop closure stays stable
  // (re-running the effect would teleport the planets to fresh ephemeris angles).
  const followRef = useRef<string | null>(null)
  useEffect(() => {
    followRef.current = followingName
    // No planet under the spotlight (sun / finale / home / reduced motion) →
    // drop the leader-line anchor so the Tour caption re-centres cleanly.
    if (!followingName) setSpotlight(null)
  }, [followingName, setSpotlight])

  // When NOT following a planet (home / warp / world / sun / finale / bio),
  // drive the springs from the declarative camera state.
  useEffect(() => {
    if (followingName) return
    scaleMV.set(camera.scale)
    xMV.set(camera.x)
    yMV.set(camera.y)
    opacityMV.set(camera.opacity)
    blurMV.set(camera.blur)
  }, [camera, followingName, scaleMV, xMV, yMV, opacityMV, blurMV])

  // Measure container so orbits scale with the viewport.
  useEffect(() => {
    const measure = () => {
      const el = wrapRef.current
      if (!el) return
      const next = Math.min(el.clientWidth, el.clientHeight) / 2
      // Ignore a 0/partial reading — on some mobile browsers the fixed layer
      // reports no height on the very first frame, which would leave R=0 and
      // freeze the whole system until a resize. A ResizeObserver (below) fires
      // again once real dimensions land.
      if (next > 0) setR(next)
    }
    measure()
    setMounted(true)
    window.addEventListener('resize', measure)
    // Re-measure once the container has a settled box (covers the "dead on first
    // load, refresh fixes it" race where the initial read was 0 or partial).
    const ro =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    if (ro && wrapRef.current) ro.observe(wrapRef.current)
    return () => {
      window.removeEventListener('resize', measure)
      ro?.disconnect()
    }
  }, [])

  // Orbital animation loop. Each planet keeps its REAL starting angle (from the
  // ephemeris) and then advances at a synthetic, visible angular velocity.
  useEffect(() => {
    if (!R) return
    // Real starting longitude per planet + its synthetic angular speed.
    const now = new Date()
    // Calm the whole system down on phones so the followed planet drifts gently
    // instead of racing under the zoomed-in tour camera.
    const speed = isSmall ? 0.6 : 1
    const base = PLANETS.map((p, i) => ({
      angle0: positionFor(p, now).longitude,
      omega: omegaFor(p.el[0]) * speed,
      orbR: ORBIT_FRAC[i] * R,
    }))
    let raf = 0
    let prevPerf = performance.now()
    // PER-PLANET accumulated orbit time. Every planet advances on its own clock
    // so we can pause JUST the spotlighted one (camera locks onto a still target)
    // while the rest of the system keeps orbiting — freezing everything made the
    // whole cosmos look dead. A per-planet clock also means a paused planet simply
    // resumes from where it stopped (no position "snap") once the spotlight lifts.
    const pt = PLANETS.map(() => 0)

    // Remember the last camera target we pushed so we only touch the springs /
    // spotlight when it actually changes. Because the spotlighted planet is
    // PAUSED, its target is constant for the whole step — so this fires once per
    // step instead of every frame, which is what stopped the caption re-rendering
    // (and re-blurring) 60×/second.
    let lastFollow: string | null = null
    let lastFx = NaN
    let lastFy = NaN

    const place = (t: number[]) => {
      const follow = followRef.current
      for (let i = 0; i < PLANETS.length; i++) {
        const b = base[i]
        const angle = b.angle0 + t[i] * b.omega
        const x = b.orbR * Math.cos(angle)
        const y = b.orbR * Math.sin(angle)
        const node = planetRefs.current[i]
        if (node) {
          // The wrapper anchor sits at the stage centre; translate it to the
          // orbit point. The sphere inside re-centres on the anchor via -50%.
          node.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`
        }
        registerPlanet(PLANETS[i].name, x, y)

        // Camera flies alongside the spotlighted planet (keeps it centred &
        // prominent, pushing the Sun toward the edge so the focus is obvious).
        // The planet is paused, so we only (re)aim the camera when the target
        // actually changes — once per step, not every frame.
        if (follow && PLANETS[i].name === follow) {
          if (follow !== lastFollow || x !== lastFx || y !== lastFy) {
            lastFollow = follow
            lastFx = x
            lastFy = y

            const dist = Math.hypot(x, y)
            const vw = window.innerWidth
            const vh = window.innerHeight
            const vmin = Math.min(vw, vh)
            // Target zoom scales inversely with the planet's orbit radius, but the
            // OUTER planets (Jupiter→Neptune) sit so far out that the raw formula
            // lands below the floor and every one of them snapped to the minimum —
            // a limp 2.4× that read as "the camera isn't doing anything". Bump the
            // factor and, crucially, the floor so even the farthest world gets a
            // real fly-in. Inner planets are already close, so they're unaffected
            // by the floor and stay capped by the ceiling.
            const factor = isSmall ? 0.42 : 0.55
            const fallback = isSmall ? 3.0 : 4.2
            let S = dist > 4 ? (vmin * factor) / dist : fallback
            S = isSmall ? Math.max(2.4, Math.min(3.4, S)) : Math.max(3.2, Math.min(5.5, S))
            const vOffset = vh * 0.12
            scaleMV.set(S)
            xMV.set(-x * S)
            yMV.set(-y * S - vOffset)
            opacityMV.set(1)
            blurMV.set(0)

            // The camera centres this planet (minus the vertical offset), so once
            // it settles the planet ALWAYS lands here. Publish that resting point
            // once — no per-frame getBoundingClientRect (a forced reflow) and no
            // per-frame caption re-render. The caption is placed at its final spot
            // immediately and the planet flies into it.
            const px = Math.max(10, Math.round((PLANETS[i].size * 3.2 + 5) * 1.55))
            setSpotlight({ x: vw / 2, y: vh / 2 - vOffset, r: (px / 2) * S })
          }
        }
      }
    }

    // Reduced motion OR frozen (warping / in a world) → place once, stop.
    if (reduce || frozen) {
      place(pt)
      return
    }

    const tick = () => {
      const nowPerf = performance.now()
      const dt = (nowPerf - prevPerf) / 1000
      prevPerf = nowPerf
      const follow = followRef.current
      // Advance every planet EXCEPT the spotlighted one. Chasing a still-orbiting
      // planet with the camera spring at high zoom never settles — it made the
      // whole view and the pinned caption shudder ("fumble"). Pausing only the
      // focused planet lets the fly-in land and hold still, while the rest of the
      // system keeps orbiting so the cosmos stays alive.
      for (let i = 0; i < PLANETS.length; i++) {
        if (!(follow && PLANETS[i].name === follow)) pt[i] += dt
      }
      place(pt)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [R, reduce, frozen, registerPlanet])

  const sunSize = 70

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#05070f]">
      {/* Deep-space backdrop (outside the camera so it doesn't zoom). */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 48%, #101a33 0%, #0a1124 45%, #05070f 100%)',
        }}
      />

      {/* Camera — the whole system zooms/pans through this layer. */}
      <motion.div
        ref={wrapRef}
        className="absolute inset-0 h-full w-full"
        style={{
          transformOrigin: 'center center',
          willChange: 'transform',
          scale: scaleMV,
          x: xMV,
          y: yMV,
          opacity: opacityMV,
          filter: filterMV,
        }}
      >
        {/* Starfield */}
        {stars.map((st, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="twinkle-star absolute rounded-full bg-white"
            style={
              {
                left: `${st.x}%`,
                top: `${st.y}%`,
                width: st.size,
                height: st.size,
                opacity: st.op,
                '--tw-dur': `${3 + (i % 4)}s`,
                '--tw-delay': `${st.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}

        {/* Orbit rings */}
        {mounted &&
          R > 0 &&
          PLANETS.map((p, i) => {
            const d = ORBIT_FRAC[i] * R * 2
            return (
              <div
                key={`ring-${p.name}`}
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 rounded-full border border-white/[0.06]"
                style={{ width: d, height: d, transform: 'translate(-50%, -50%)' }}
              />
            )
          })}

        {/* The Sun — click for the full bio */}
        <button
          type="button"
          onClick={openBio}
          data-cursor-visit
          aria-label="About Ankur Singh — the centre of the cosmos"
          className="group absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full outline-none pointer-events-auto focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <div
            className="sun-core transition-transform duration-200 group-hover:scale-110"
            style={{ width: sunSize, height: sunSize }}
          />
          <span className="pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2.5 py-1 text-[11px] font-medium text-slate-900 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
            <span className="font-mono">Ankur Singh</span>
            <span className="ml-1.5 text-slate-400">· who I am</span>
          </span>
        </button>

        {/* Planets — interactive destinations */}
        {PLANETS.map((p, i) => {
          const px = Math.max(10, Math.round((p.size * 3.2 + 5) * 1.55))
          const nav = PLANET_NAV[p.name]
          const isLink = nav?.kind === 'link'
          const spotlighted = spotlightName === p.name
          const ariaLabel = nav
            ? isLink
              ? `Open ${nav.label.replace(' ↗', '')} in a new tab`
              : `Fly to the ${nav.label} world`
            : p.name

          const sphere = (
            <span
              className="block rounded-full ring-1 ring-black/30 transition-transform duration-200 group-hover:scale-[1.55] group-focus-visible:scale-[1.55]"
              style={{
                width: px,
                height: px,
                background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.9), ${p.color} 46%, rgba(0,0,0,0.55) 100%)`,
                boxShadow: `0 0 ${Math.round(px * 0.9)}px ${p.color}aa`,
              }}
            />
          )

          const ringGlow = spotlighted && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 rounded-full blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.45, 0.8, 0.45], scale: [1, 1.12, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: px * 3.4,
                height: px * 3.4,
                transform: 'translate(-50%, -50%)',
                background: `radial-gradient(circle, ${p.color}66 0%, ${p.color}22 42%, transparent 70%)`,
              }}
            />
          )

          const label = (
            <span className="pointer-events-none absolute left-1/2 bottom-full mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-[11px] font-medium text-slate-900 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              <span className="font-mono">{nav ? nav.label : p.name}</span>
              {nav && <span className="ml-1.5 text-slate-400">· {nav.tag}</span>}
            </span>
          )

          const saturnRing = p.name === 'Saturn' && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border"
              style={{
                width: px * 2.1,
                height: px * 0.7,
                borderColor: 'rgba(227,210,160,0.6)',
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
                  {ringGlow}
                  {sphere}
                  {label}
                </a>
              ) : (
                <button
                  type="button"
                  aria-label={ariaLabel}
                  data-cursor-visit
                  onClick={() => nav && enterWorld(nav)}
                  className={innerClass}
                >
                  {ringGlow}
                  {saturnRing}
                  {sphere}
                  {label}
                </button>
              )}
            </div>
          )
        })}
      </motion.div>

      {/* Tour: name tag pinned over the spotlighted planet (which the camera
          keeps centred). Lives outside the camera so it stays crisp at any zoom. */}
      {followNav && (
        <motion.div
          key={followNav.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none fixed left-1/2 top-[30%] z-30 -translate-x-1/2 -translate-y-1/2"
        >
          <span
            className="flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-semibold text-white shadow-lg"
            style={{ borderColor: `${followNav.accent}66`, background: 'rgba(11,19,39,0.85)' }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: followNav.accent }} />
            {followNav.label.replace(' ↗', '')}
          </span>
        </motion.div>
      )}

      <style jsx>{`
        .sun-core {
          border-radius: 9999px;
          background: radial-gradient(circle at 50% 50%, #fff7d6 0%, #ffd34d 38%, #f59e0b 70%, #ea7a0b 100%);
          box-shadow:
            0 0 32px 10px rgba(245, 158, 11, 0.6),
            0 0 80px 26px rgba(245, 158, 11, 0.4),
            0 0 170px 60px rgba(245, 158, 11, 0.22);
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

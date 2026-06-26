'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { siteConfig } from '@/lib/site-config'
import { navByDest } from '@/lib/universe-nav'
import { useUniverse } from '@/lib/hooks/useUniverse'

const EASE = [0.16, 1, 0.3, 1] as const

/** Where the caption card is anchored on screen + where its leader line lands. */
interface Anchor {
  /** card centre-x and top (fixed px) */
  cardX: number
  cardTop: number
  /** the connecting point ON the card (top- or bottom-centre) */
  joinX: number
  joinY: number
  /** the planet target the line points AT */
  targetX: number
  targetY: number
  targetR: number
}

const GAP = 30 // breathing room between the planet edge and the card
const CARD_W = 'min(92vw, 30rem)'

export function Tour() {
  const reduce = useReducedMotion()
  const {
    tourActive,
    tourStep,
    tourIndex,
    tourCount,
    tourNext,
    tourPrev,
    tourGoTo,
    endTour,
    enterWorld,
    getSpotlight,
  } = useUniverse()

  const cardRef = useRef<HTMLDivElement>(null)
  const [anchor, setAnchor] = useState<Anchor | null>(null)

  const isPlanet = tourStep?.kind === 'planet'

  // Track the spotlighted planet's live screen position and place the caption
  // beside it with an accurate leader line. The camera holds the planet roughly
  // centred during each step, so this settles in a few frames then stays put.
  useEffect(() => {
    if (!tourActive || !isPlanet) {
      setAnchor(null)
      return
    }
    let raf = 0
    const tick = () => {
      const s = getSpotlight()
      if (s) {
        const vw = window.innerWidth
        const vh = window.innerHeight
        const cardH = cardRef.current?.offsetHeight ?? 220
        // Half the card width in px (CARD_W = min(92vw, 30rem)).
        const halfW = Math.min(vw * 0.92, 480) / 2
        const cardX = Math.max(halfW + 14, Math.min(vw - halfW - 14, s.x))

        // Prefer placing the card BELOW the planet; flip above if it would
        // overflow the bottom (where the controls dock lives).
        const belowTop = s.y + s.r + GAP
        const fitsBelow = belowTop + cardH + 96 <= vh
        const cardTop = fitsBelow ? belowTop : s.y - s.r - GAP - cardH
        const joinY = fitsBelow ? cardTop : cardTop + cardH

        setAnchor((prev) => {
          const next: Anchor = {
            cardX,
            cardTop,
            joinX: cardX,
            joinY,
            targetX: s.x,
            targetY: s.y,
            targetR: s.r,
          }
          // Skip the state update when nothing meaningfully moved (avoids a
          // per-frame re-render once the planet is parked under the camera).
          if (
            prev &&
            Math.abs(prev.cardX - next.cardX) < 0.5 &&
            Math.abs(prev.cardTop - next.cardTop) < 0.5 &&
            Math.abs(prev.targetX - next.targetX) < 0.5 &&
            Math.abs(prev.targetY - next.targetY) < 0.5
          ) {
            return prev
          }
          return next
        })
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [tourActive, isPlanet, tourIndex, getSpotlight])

  if (!tourActive || !tourStep) return null

  const stepKey = tourStep.kind === 'planet' ? tourStep.nav.name : tourStep.kind
  const contact = navByDest('contact')
  const accent =
    tourStep.kind === 'planet' ? tourStep.nav.accent : 'rgba(255,255,255,0.6)'

  // Floating beside the planet only when we have a fresh anchor for THIS step.
  const floating = isPlanet && !!anchor

  const cardInner = (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, y: reduce ? 0 : 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: reduce ? 0 : -12 }}
        transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
        className="pointer-events-auto rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-center shadow-[0_24px_70px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl"
      >
        {tourStep.kind === 'sun' && (
          <>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-300/90">
              the sun · start here
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
              This is {siteConfig.name}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              At the centre of it all. Everything in this system orbits the work —
              let me fly you through each world, one planet at a time.
            </p>
          </>
        )}

        {tourStep.kind === 'planet' && (
          <>
            <p
              className="font-mono text-xs uppercase tracking-[0.25em]"
              style={{ color: tourStep.nav.accent }}
            >
              {tourStep.nav.name} → {tourStep.nav.label.replace(' ↗', '')}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
              {tourStep.nav.label.replace(' ↗', '')}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              {tourStep.nav.blurb}
            </p>
            {tourStep.nav.kind === 'world' ? (
              <button
                type="button"
                onClick={() => {
                  const nav = tourStep.nav
                  endTour()
                  setTimeout(() => enterWorld(nav), reduce ? 0 : 120)
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-[#05070f]"
                style={{ background: tourStep.nav.accent }}
              >
                Fly to this world →
              </button>
            ) : (
              <a
                href={tourStep.nav.target}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Open {tourStep.nav.label}
              </a>
            )}
          </>
        )}

        {tourStep.kind === 'finale' && (
          <>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-300/90">
              tour complete
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
              You’ve seen my cosmos.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              Now explore it yourself — or jump straight to working together.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  endTour()
                  if (contact) setTimeout(() => enterWorld(contact), reduce ? 0 : 120)
                }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white"
              >
                Let’s talk →
              </button>
              <button
                type="button"
                onClick={endTour}
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                Explore freely
              </button>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-[55]">
      {/* Skip / close */}
      <div className="pointer-events-auto absolute right-0 top-0 p-5">
        <button
          type="button"
          onClick={endTour}
          className="rounded-full border border-white/15 bg-black/40 px-4 py-2 font-mono text-xs text-white/80 backdrop-blur-md transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          esc · skip tour ✕
        </button>
      </div>

      {/* Leader line from the card to the spotlighted planet */}
      {floating && anchor && (
        <svg
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[54] h-full w-full"
        >
          <motion.line
            key={stepKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            x1={anchor.targetX}
            y1={anchor.targetY}
            x2={anchor.joinX}
            y2={anchor.joinY}
            stroke={accent}
            strokeWidth={1.5}
            strokeDasharray="2 5"
            strokeLinecap="round"
          />
          <circle cx={anchor.targetX} cy={anchor.targetY} r={4} fill={accent} />
          <circle
            cx={anchor.targetX}
            cy={anchor.targetY}
            r={9}
            fill="none"
            stroke={accent}
            strokeWidth={1}
            opacity={0.4}
          />
          <circle cx={anchor.joinX} cy={anchor.joinY} r={2.5} fill={accent} />
        </svg>
      )}

      {/* Caption card — floats beside the planet, or centres for sun/finale */}
      {floating && anchor ? (
        <div
          ref={cardRef}
          className="fixed z-[56]"
          style={{
            left: anchor.cardX,
            top: anchor.cardTop,
            width: CARD_W,
            transform: 'translateX(-50%)',
          }}
        >
          {cardInner}
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-x-0 bottom-28 px-4 md:bottom-32">
          <div ref={cardRef} className="mx-auto" style={{ width: CARD_W }}>
            {cardInner}
          </div>
        </div>
      )}

      {/* Controls dock — pinned to the bottom edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#05070f] via-[#05070f]/70 to-transparent px-4 pb-6 pt-10">
        <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-4">
          <div className="pointer-events-auto flex items-center gap-1.5">
            {Array.from({ length: tourCount + 2 }, (_, i) => {
              const active = tourIndex === i
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => tourGoTo(i)}
                  aria-label={`Go to tour step ${i + 1}`}
                  className="grid h-4 w-4 place-items-center focus-visible:outline-none"
                >
                  <span
                    className={`block rounded-full transition-all ${
                      active ? 'h-2 w-2 bg-white' : 'h-1.5 w-1.5 bg-white/30 hover:bg-white/60'
                    }`}
                  />
                </button>
              )
            })}
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={tourPrev}
              disabled={tourIndex === 0}
              className="rounded-full border border-white/15 bg-black/30 px-4 py-2 font-mono text-xs text-white/80 backdrop-blur-md transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            >
              ← prev
            </button>
            {tourIndex < tourCount + 1 && (
              <button
                type="button"
                onClick={tourNext}
                className="rounded-full border border-white/25 bg-white/10 px-4 py-2 font-mono text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

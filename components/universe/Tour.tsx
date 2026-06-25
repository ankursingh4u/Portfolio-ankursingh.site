'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { siteConfig } from '@/lib/site-config'
import { navByDest } from '@/lib/universe-nav'
import { useUniverse } from '@/lib/hooks/useUniverse'

const EASE = [0.16, 1, 0.3, 1] as const

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
  } = useUniverse()

  if (!tourActive || !tourStep) return null

  const stepKey =
    tourStep.kind === 'planet' ? tourStep.nav.name : tourStep.kind
  const contact = navByDest('contact')

  return (
    <div className="pointer-events-none fixed inset-0 z-[55] flex flex-col">
      {/* Skip / close */}
      <div className="pointer-events-auto flex justify-end p-5">
        <button
          type="button"
          onClick={endTour}
          className="rounded-full border border-white/15 bg-black/40 px-4 py-2 font-mono text-xs text-white/80 backdrop-blur-md transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          esc · skip tour ✕
        </button>
      </div>

      <div className="flex-1" />

      {/* Caption dock */}
      <div className="pointer-events-none bg-gradient-to-t from-[#05070f] via-[#05070f]/70 to-transparent px-4 pb-6 pt-10 md:px-5 md:pb-7 md:pt-16">
        <div className="mx-auto w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepKey}
              initial={{ opacity: 0, y: reduce ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -16 }}
              transition={{ duration: reduce ? 0 : 0.45, ease: EASE }}
              className="pointer-events-auto rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-center backdrop-blur-xl"
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
                    At the centre of it all. Everything in this system orbits the
                    work — let me fly you through each world, one planet at a time.
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
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{tourStep.nav.blurb}</p>
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

          {/* Controls */}
          <div className="pointer-events-auto mt-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
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

            <div className="flex items-center gap-2">
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
    </div>
  )
}

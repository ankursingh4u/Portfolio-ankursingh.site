'use client'

import { aboutContent, techStack } from '@/lib/site-config'
import { aboutMe } from '@/lib/about-me'
import type { PlanetNav } from '@/lib/universe-nav'
import { PlanetWorld, GlassCard } from '../PlanetWorld'

const stackGroups: { label: string; items: string[] }[] = [
  { label: 'languages', items: techStack.languages },
  { label: 'frontend', items: techStack.frontend },
  { label: 'backend', items: techStack.backend },
  { label: 'tools', items: techStack.tools },
  { label: 'learning', items: techStack.learning },
]

export function AboutWorld({ nav }: { nav: PlanetNav }) {
  return (
    <PlanetWorld
      nav={nav}
      eyebrow="Saturn · about"
      title="The story behind the system"
      intro={aboutContent.intro}
    >
      {/* Narrative */}
      <div className="grid gap-5 md:grid-cols-3">
        {[
          { label: 'the journey', text: aboutContent.journey },
          { label: 'the approach', text: aboutContent.approach },
          { label: 'right now', text: aboutContent.current },
        ].map((b) => (
          <GlassCard key={b.label} accent={nav.accent}>
            <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: nav.accent }}>
              {b.label}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{b.text}</p>
          </GlassCard>
        ))}
      </div>

      {/* How I think */}
      <h2 className="mt-12 text-xl font-bold text-white">How I’m wired</h2>
      <div className="mt-4 grid gap-5 md:grid-cols-2">
        <GlassCard>
          <div className="flex flex-wrap gap-2">
            {aboutMe.strengths.map((s) => (
              <span
                key={s.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200"
              >
                <span aria-hidden>{s.icon}</span> {s.label}
              </span>
            ))}
          </div>
          <ul className="mt-5 space-y-2">
            {aboutMe.principles.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-slate-300">
                <span style={{ color: nav.accent }}>›</span> {p}
              </li>
            ))}
          </ul>
        </GlassCard>
        <GlassCard>
          <p className="font-mono text-[11px] uppercase tracking-widest text-slate-400">core loop</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {aboutMe.corePattern.map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span className="rounded-md bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-200">
                  {step}
                </span>
                {i < aboutMe.corePattern.length - 1 && (
                  <span style={{ color: nav.accent }}>→</span>
                )}
              </span>
            ))}
          </div>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-widest text-slate-400">after</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{aboutMe.ambitionLine}</p>
          <p className="mt-4 text-sm italic text-slate-400">{aboutContent.beyond}</p>
        </GlassCard>
      </div>

      {/* The stack */}
      <h2 className="mt-12 text-xl font-bold text-white">The stack I build with</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stackGroups.map((g) => (
          <GlassCard key={g.label}>
            <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: nav.accent }}>
              {g.label}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {g.items.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </PlanetWorld>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { PlanetNav } from '@/lib/universe-nav'
import { navByDest } from '@/lib/universe-nav'
import { useUniverse } from '@/lib/hooks/useUniverse'
import { PlanetWorld, GlassCard } from '../PlanetWorld'

type Currency = 'USD' | 'INR'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    tag: 'Individuals & small business',
    value: 'Converts visitors into leads — live in ~5 days.',
    usd: 149,
    inr: 12400,
    pages: '1 page',
    sections: 'Up to 5 sections',
    features: [
      '1 landing page',
      'Up to 5 custom sections',
      'Responsive design',
      'Basic animations',
      'Contact form',
      '1 revision round',
      'Delivery in ~5 days',
    ],
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    tag: 'Multi-page sites & portfolios',
    value: 'More organic reach — and a funnel that captures it.',
    usd: 399,
    inr: 33200,
    pages: 'Up to 4 pages',
    sections: 'Up to 16 sections',
    features: [
      'Up to 4 pages',
      'Up to 16 custom sections',
      'Advanced animations',
      'CMS / blog integration',
      'SEO setup',
      '3 revision rounds',
      'Delivery in ~10 days',
      '7-day post-launch support',
    ],
    highlight: true,
  },
  {
    id: 'custom',
    name: 'Custom',
    tag: 'Full-scale apps & platforms',
    value: 'A product that earns — not just a website.',
    usd: 799,
    inr: 66500,
    pages: 'Unlimited pages',
    sections: 'Unlimited sections',
    features: [
      'Unlimited pages & sections',
      'Full-stack development',
      'Auth, payments, dashboards',
      'API integrations',
      'Performance optimization',
      'Unlimited revisions',
      'Delivery timeline scoped',
      '30-day priority support',
    ],
    highlight: false,
    fromPrice: true,
  },
]

const addons = [
  { label: 'Extra page', usd: 60, inr: 5000 },
  { label: 'Custom section', usd: 35, inr: 2900 },
  { label: 'Advanced animation', usd: 50, inr: 4200 },
  { label: 'CMS integration', usd: 120, inr: 10000 },
  { label: 'Auth system', usd: 150, inr: 12500 },
  { label: 'Payment gateway', usd: 180, inr: 15000 },
]

function price(usd: number, inr: number, c: Currency, from?: boolean) {
  const prefix = from ? 'from ' : ''
  return c === 'USD' ? `${prefix}$${usd.toLocaleString()}` : `${prefix}₹${inr.toLocaleString()}`
}

export function PricingWorld({ nav }: { nav: PlanetNav }) {
  const [currency, setCurrency] = useState<Currency>('USD')
  const { enterWorld } = useUniverse()
  const contact = navByDest('contact')

  return (
    <PlanetWorld
      nav={nav}
      eyebrow="Uranus · pricing"
      title="Transparent & fair"
      intro="Project estimates, not hourly mystery. Pick a starting point — the exact quote comes after a quick discovery call."
    >
      {/* Currency toggle */}
      <div className="mb-8 flex items-center gap-3">
        <span className="font-mono text-xs text-slate-500">currency:</span>
        <div className="flex overflow-hidden rounded-full border border-white/15">
          {(['USD', 'INR'] as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-4 py-1.5 font-mono text-xs transition-colors ${
                currency === c ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {c === 'USD' ? '$ USD' : '₹ INR'}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="grid items-stretch gap-5 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-2xl border p-6 backdrop-blur-xl ${
              plan.highlight
                ? 'border-white/30 bg-white/[0.07]'
                : 'border-white/10 bg-white/[0.04]'
            }`}
            style={plan.highlight ? { boxShadow: `0 0 40px -10px ${nav.accent}66` } : undefined}
          >
            {plan.highlight && (
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 font-mono text-[10px] font-bold text-[#05070f]"
                style={{ background: nav.accent }}
              >
                MOST POPULAR
              </span>
            )}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{plan.name}</h3>
              <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                {plan.pages}
              </span>
            </div>
            <p className="mt-1 font-mono text-[11px] text-slate-500">{plan.tag}</p>
            <p className="mt-1.5 text-[12px] leading-snug" style={{ color: nav.accent }}>
              {plan.value}
            </p>
            <motion.div
              key={currency}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 border-y border-white/10 py-3 text-3xl font-bold text-white"
            >
              {price(plan.usd, plan.inr, currency, plan.fromPrice)}
            </motion.div>
            <ul className="mt-4 flex-1 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-slate-300">
                  <span style={{ color: nav.accent }}>›</span> {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => contact && enterWorld(contact)}
              className={`mt-5 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                plan.highlight
                  ? 'text-[#05070f]'
                  : 'border border-white/20 text-white hover:bg-white/10'
              }`}
              style={plan.highlight ? { background: nav.accent } : undefined}
            >
              Start a project →
            </button>
          </div>
        ))}
      </div>

      {/* Add-ons */}
      <h2 className="mt-12 text-xl font-bold text-white">Add-ons — extend any plan</h2>
      <GlassCard className="mt-4">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {addons.map((a) => (
            <div
              key={a.label}
              className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2.5"
            >
              <span className="font-mono text-xs text-slate-300">{a.label}</span>
              <span className="font-mono text-xs" style={{ color: nav.accent }}>
                {currency === 'USD' ? `+$${a.usd}` : `+₹${a.inr.toLocaleString()}`}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
      <p className="mt-6 text-center font-mono text-xs text-slate-500">
        all prices are project estimates · exact quote after a brief discovery call
      </p>
    </PlanetWorld>
  )
}

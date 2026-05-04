'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlitchOnScroll, NeonPulse, AnimatedBorder } from '../effects'
import { TerminalWindow } from '../terminal'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

type Currency = 'USD' | 'INR'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    tag: 'Individuals & small business',
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
    cta: 'Get Started',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    tag: 'Multi-page sites & portfolios',
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
    cta: 'Start Project',
    highlight: true,
  },
  {
    id: 'custom',
    name: 'Custom',
    tag: 'Full-scale apps & platforms',
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
    cta: 'Let\'s Talk',
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

function formatPrice(usd: number, inr: number, currency: Currency, from?: boolean) {
  const prefix = from ? 'from ' : ''
  if (currency === 'USD') return `${prefix}$${usd.toLocaleString()}`
  return `${prefix}₹${inr.toLocaleString()}`
}

function AddonPrice({ usd, inr, currency }: { usd: number; inr: number; currency: Currency }) {
  if (currency === 'USD') return <span>+${usd}</span>
  return <span>+₹{inr.toLocaleString()}</span>
}

export function PricingSection() {
  const [currency, setCurrency] = useState<Currency>('USD')

  return (
    <section id="pricing" className="section relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-terminal-accent/[0.02] to-transparent pointer-events-none" />

      <div className="container-narrow mx-auto relative z-10">
        <GlitchOnScroll>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-header"
          >
            <h2 className="section-title">
              <NeonPulse color="#22c55e">pricing</NeonPulse>
            </h2>
            <span className="text-xs text-terminal-dim font-mono">// transparent & fair</span>
          </motion.div>
        </GlitchOnScroll>

        {/* Currency toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-10"
        >
          <span className="text-xs text-terminal-dim font-mono">$ currency:</span>
          <div className="flex border border-terminal-border rounded overflow-hidden">
            {(['USD', 'INR'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-4 py-1.5 text-xs font-mono transition-all ${
                  currency === c
                    ? 'bg-terminal-accent/20 text-terminal-accent border-terminal-accent/40'
                    : 'text-terminal-dim hover:text-terminal-text'
                }`}
              >
                {c === 'USD' ? '$ USD' : '₹ INR'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Plans */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-3 mb-12 items-stretch mt-4"
        >
          {plans.map((plan) => (
            <motion.div key={plan.id} variants={itemVariants} className="relative flex flex-col">
              {/* Badge placeholder keeps height consistent */}
              <div className="h-5 flex items-center justify-center mb-2">
                {plan.highlight && (
                  <span className="bg-terminal-accent text-terminal-bg text-[10px] font-mono font-bold px-3 py-0.5 rounded-full">
                    POPULAR
                  </span>
                )}
              </div>
              <AnimatedBorder borderColor={plan.highlight ? 'green' : undefined} className="flex-1 flex flex-col">
                <div
                  className={`flex-1 rounded-lg p-5 flex flex-col gap-4 ${
                    plan.highlight
                      ? 'bg-terminal-surface border border-terminal-accent/30'
                      : 'bg-terminal-surface border border-terminal-border'
                  }`}
                >
                  {/* Plan header */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-mono font-bold text-terminal-text">{plan.name}</h3>
                      <span className="text-[10px] font-mono text-terminal-dim bg-terminal-bg px-2 py-0.5 rounded">
                        {plan.pages}
                      </span>
                    </div>
                    <p className="text-[11px] text-terminal-dim font-mono">{plan.tag}</p>
                  </div>

                  {/* Price */}
                  <div className="border-t border-b border-terminal-border/50 py-3">
                    <motion.div
                      key={currency}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`text-2xl font-bold font-mono ${plan.highlight ? 'text-terminal-accent' : 'text-terminal-text'}`}
                    >
                      {formatPrice(plan.usd, plan.inr, currency, plan.fromPrice)}
                    </motion.div>
                    <div className="text-[10px] text-terminal-dim font-mono mt-0.5">{plan.sections}</div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs font-mono text-terminal-dim">
                        <span className="text-terminal-accent mt-0.5 shrink-0">›</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <motion.a
                    href="#contact"
                    className={`block text-center text-xs font-mono py-2.5 px-4 rounded border transition-all ${
                      plan.highlight
                        ? 'bg-terminal-accent/20 border-terminal-accent text-terminal-accent hover:bg-terminal-accent/30'
                        : 'border-terminal-border text-terminal-dim hover:border-terminal-accent hover:text-terminal-accent'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {plan.cta} →
                  </motion.a>
                </div>
              </AnimatedBorder>
            </motion.div>
          ))}
        </motion.div>

        {/* Add-ons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <TerminalWindow title="addons.sh">
            <div className="space-y-2">
              <div className="text-xs text-terminal-dim font-mono mb-3">
                <span className="text-terminal-muted">$</span> cat add-ons.txt{' '}
                <span className="text-terminal-dim">// extend any plan</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {addons.map((addon) => (
                  <motion.div
                    key={addon.label}
                    className="flex items-center justify-between p-2.5 rounded border border-terminal-border/50 bg-terminal-bg/40"
                    whileHover={{ borderColor: 'rgba(34,197,94,0.3)', x: 2 }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className="text-xs font-mono text-terminal-dim">{addon.label}</span>
                    <motion.span
                      key={currency}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs font-mono text-terminal-accent"
                    >
                      <AddonPrice usd={addon.usd} inr={addon.inr} currency={currency} />
                    </motion.span>
                  </motion.div>
                ))}
              </div>
            </div>
          </TerminalWindow>
        </motion.div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-terminal-dim font-mono mt-6"
        >
          // all prices are project estimates · exact quote after a brief discovery call
        </motion.p>
      </div>
    </section>
  )
}

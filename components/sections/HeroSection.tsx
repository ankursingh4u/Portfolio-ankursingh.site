'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '@/lib/site-config'
import { SolarSystem } from '../hero/SolarSystem'
import { InfoWidget } from '../ui/InfoWidget'

const roles = [
  'Full-Stack Engineer',
  'Shopify App Builder',
  'AI Product Developer',
]

export function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = roles[roleIndex]
    let timeout: NodeJS.Timeout

    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 65)
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800)
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 35)
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false)
      setRoleIndex((i) => (i + 1) % roles.length)
    }

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, roleIndex])

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-indigo-50/40 to-white"
    >
      {/* Soft radial light, centered behind the system */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[62%] h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200/20 blur-3xl" />
      </div>

      {/* Corner info widget */}
      <div className="absolute right-4 top-20 z-30 md:right-8">
        <InfoWidget />
      </div>

      {/* Centered, stacked column — text on top, solar system below.
          They share the same horizontal center but never overlap. */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-start gap-6 px-6 pt-28 pb-20 text-center md:justify-center md:gap-8 md:pt-24">
        {/* Intro block (centered) */}
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {siteConfig.status} · India
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-sans text-5xl font-bold leading-[1.05] tracking-tight text-slate-900 md:text-6xl lg:text-7xl"
          >
            {siteConfig.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 flex h-8 items-center justify-center gap-2"
          >
            <span className="font-mono text-lg text-indigo-600">{displayed}</span>
            <span className="inline-block h-5 w-0.5 animate-pulse bg-indigo-600" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mt-5 max-w-md text-base leading-relaxed text-slate-600"
          >
            I build production-ready systems — AI products, Shopify apps, and
            client platforms that orbit around solving real problems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-3"
          >
            <motion.a
              href="#work"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-colors hover:bg-indigo-700"
            >
              View my work
            </motion.a>
            <motion.a
              href="/resume"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900"
            >
              Résumé
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-6 flex items-center justify-center gap-5 text-sm text-slate-500"
          >
            {[
              { label: 'GitHub', href: siteConfig.social.github },
              { label: 'LinkedIn', href: siteConfig.social.linkedin },
              { label: 'X', href: siteConfig.social.X },
              { label: 'Instagram', href: siteConfig.social.instagram },
            ].map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2 }}
                className="transition-colors hover:text-indigo-600"
              >
                {s.label} ↗
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Real-time solar system (centered, below the text) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="w-full max-w-[440px]"
        >
          <SolarSystem />
          <p className="mt-2 text-center font-mono text-[11px] text-slate-400">
            ◦ live solar system — real planetary positions · hover a planet
          </p>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-1 text-slate-400"
        >
          <span className="text-xs">scroll</span>
          <div className="h-6 w-px bg-gradient-to-b from-slate-400 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  )
}

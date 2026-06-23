'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '@/lib/site-config'
import { SolarSystem } from '../hero/SolarSystem'
import { InfoWidget } from '../ui/InfoWidget'

const roles = ['Full-Stack Engineer', 'Shopify App Builder', 'AI Product Developer']

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
    <section id="home" className="relative min-h-screen overflow-hidden bg-[#070b16]">
      {/* Deep-space backdrop */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, #131c33 0%, #0b1224 45%, #070b16 100%)',
        }}
      />

      {/* Full-bleed real-time solar system */}
      <SolarSystem fill />

      {/* Vignette behind the text so the name stays readable over the sun */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 42% 38% at 50% 46%, rgba(7,11,22,0.78) 0%, rgba(7,11,22,0.35) 55%, transparent 100%)',
        }}
      />

      {/* Corner info widget */}
      <div className="absolute right-4 top-20 z-30 md:right-8">
        <InfoWidget />
      </div>

      {/* Centered content */}
      <div className="relative z-20 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-indigo-200 backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {siteConfig.status} · India
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-sans text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl"
          style={{ textShadow: '0 2px 30px rgba(0,0,0,0.5)' }}
        >
          {siteConfig.name}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 flex h-8 items-center justify-center gap-2"
        >
          <span className="font-mono text-lg text-indigo-300">{displayed}</span>
          <span className="inline-block h-5 w-0.5 animate-pulse bg-indigo-300" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mx-auto mt-5 max-w-md text-base leading-relaxed text-slate-300"
        >
          I build production-ready systems — AI products, Shopify apps, and
          client platforms that orbit around solving real problems.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.a
            href="#work"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-colors hover:bg-indigo-400"
          >
            View my work
          </motion.a>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            Get in touch
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-8 flex items-center justify-center gap-5 text-sm text-slate-400"
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
              className="transition-colors hover:text-indigo-300"
            >
              {s.label} ↗
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2"
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

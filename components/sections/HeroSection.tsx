'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '@/lib/site-config'
import { GlitchText, FloatingParticles, CircuitLines } from '../effects'

const roles = [
  'Full-Stack Engineer',
  'Shopify App Builder',
  'AI Product Developer',
  'LLM Analytics Creator',
]

export function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const current = roles[roleIndex]
    let timeout: NodeJS.Timeout

    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 60)
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000)
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
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Subtle particle field */}
      <FloatingParticles count={30} opacity={0.25} />

      {/* Circuit lines */}
      <CircuitLines />

      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Radial highlight from center */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse, rgba(34,197,94,0.3) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Gradient fade top/bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-terminal-bg via-transparent to-terminal-bg pointer-events-none z-[2]" />

      {/* Main content — centered */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 py-20 text-center">

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-terminal-accent/30 bg-terminal-accent/5 text-xs font-mono text-terminal-dim">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-terminal-accent block"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            {siteConfig.status} · India · IST
          </div>
        </motion.div>

        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-terminal-text leading-none">
            <GlitchText
              text="Ankur Singh"
              className="text-terminal-text"
              glitchInterval={6000}
              glitchDuration={120}
            />
          </h1>
        </motion.div>

        {/* Typewriter role */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-5 h-8 flex items-center justify-center gap-2"
        >
          <span className="text-terminal-muted font-mono text-lg">{'>'}</span>
          <span className="text-terminal-accent font-mono text-lg md:text-xl">
            {displayed}
            <motion.span
              className="inline-block w-0.5 h-5 bg-terminal-accent ml-0.5 align-middle"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-terminal-dim text-base max-w-md mx-auto leading-relaxed mb-8"
        >
          Building production-ready systems — AI products, Shopify apps, and client systems that solve real problems for real users.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-8"
        >
          <motion.a
            href="#clients"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-terminal-accent text-terminal-bg text-sm font-mono font-medium rounded hover:bg-terminal-accent-dim transition-colors"
            whileHover={{ scale: 1.03, boxShadow: '0 0 24px rgba(34,197,94,0.4)' }}
            whileTap={{ scale: 0.97 }}
          >
            View My Work
          </motion.a>
          <motion.a
            href="/resume"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-terminal-border text-terminal-text text-sm font-mono rounded hover:border-terminal-accent hover:text-terminal-accent transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Resume
          </motion.a>
          <motion.a
            href="#contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-terminal-border text-terminal-dim text-sm font-mono rounded hover:border-terminal-muted hover:text-terminal-text transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Contact
          </motion.a>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex items-center justify-center gap-5 text-xs font-mono text-terminal-dim"
        >
          {[
            { label: 'github', href: siteConfig.social.github },
            { label: 'linkedin', href: siteConfig.social.linkedin },
            { label: 'x / twitter', href: siteConfig.social.X },
          ].map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-terminal-accent transition-colors"
              whileHover={{ y: -2 }}
            >
              ↗ {s.label}
            </motion.a>
          ))}
        </motion.div>

      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          className="flex flex-col items-center gap-1 text-terminal-muted"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs font-mono">scroll</span>
          <div className="w-px h-6 bg-gradient-to-b from-terminal-muted to-transparent" />
        </motion.div>
      </motion.div>

      {/* Corner accents */}
      <div className="absolute top-5 left-5 w-6 h-6 border-l border-t border-terminal-accent/20 hidden md:block z-10" />
      <div className="absolute top-5 right-5 w-6 h-6 border-r border-t border-terminal-accent/20 hidden md:block z-10" />
      <div className="absolute bottom-5 left-5 w-6 h-6 border-l border-b border-terminal-accent/20 hidden md:block z-10" />
      <div className="absolute bottom-5 right-5 w-6 h-6 border-r border-b border-terminal-accent/20 hidden md:block z-10" />
    </section>
  )
}

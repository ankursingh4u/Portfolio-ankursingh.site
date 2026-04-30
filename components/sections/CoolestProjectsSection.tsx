'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { coolestProjects } from '@/lib/site-config'
import { GlitchOnScroll, NeonPulse, TiltCard } from '../effects'

const colorMap = {
  emerald: {
    accent: '#10b981',
    border: 'border-emerald-500/40 hover:border-emerald-500',
    glow: '0 0 30px rgba(16,185,129,0.2)',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    tag: 'border-emerald-500/30 text-emerald-400/70 hover:border-emerald-400 hover:text-emerald-300',
    number: 'text-emerald-500/30',
    dot: 'bg-emerald-400',
    stat: 'text-emerald-400',
    featureDot: 'bg-emerald-500',
    gradFrom: 'from-emerald-900/10',
    link: 'border-emerald-500/50 text-emerald-400 hover:bg-emerald-500 hover:text-black',
  },
  blue: {
    accent: '#3b82f6',
    border: 'border-blue-500/40 hover:border-blue-500',
    glow: '0 0 30px rgba(59,130,246,0.2)',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    tag: 'border-blue-500/30 text-blue-400/70 hover:border-blue-400 hover:text-blue-300',
    number: 'text-blue-500/30',
    dot: 'bg-blue-400',
    stat: 'text-blue-400',
    featureDot: 'bg-blue-500',
    gradFrom: 'from-blue-900/10',
    link: 'border-blue-500/50 text-blue-400 hover:bg-blue-500 hover:text-black',
  },
  purple: {
    accent: '#a855f7',
    border: 'border-purple-500/40 hover:border-purple-500',
    glow: '0 0 30px rgba(168,85,247,0.2)',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    tag: 'border-purple-500/30 text-purple-400/70 hover:border-purple-400 hover:text-purple-300',
    number: 'text-purple-500/30',
    dot: 'bg-purple-400',
    stat: 'text-purple-400',
    featureDot: 'bg-purple-500',
    gradFrom: 'from-purple-900/10',
    link: 'border-purple-500/50 text-purple-400 hover:bg-purple-500 hover:text-black',
  },
}

const statusLabel: Record<string, string> = {
  live: 'LIVE',
  completed: 'COMPLETED',
  'launching-soon': 'LAUNCHING MAY 2026',
}

export function CoolestProjectsSection() {
  return (
    <section
      id="showcase"
      className="py-20 px-6 md:px-8 relative overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #0a0a0b 0%, #0d0d10 40%, #0a0a0b 100%)',
      }}
    >
      {/* Background image overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: 'url(/bg-tech.jpg)' }}
      />

      {/* Subtle grid */}
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header */}
        <GlitchOnScroll>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-header mb-4"
          >
            <h2 className="section-title">
              <NeonPulse color="#22c55e">showcase</NeonPulse>
            </h2>
            <span className="text-xs text-terminal-dim font-mono">
              // flagship projects that define me
            </span>
          </motion.div>
        </GlitchOnScroll>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-terminal-dim text-sm mb-12 max-w-2xl"
        >
          These are not side projects. Each one solves a real problem, was built
          with production-grade thinking, and represents a different dimension of
          what I can build.
        </motion.p>

        {/* Project cards */}
        <div className="space-y-8">
          {coolestProjects.map((project, index) => (
            <ProjectShowcase key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectShowcase({
  project,
  index,
}: {
  project: (typeof coolestProjects)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const c = colorMap[project.color]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
    >
      <TiltCard glareEnabled>
        <motion.article
          className={`relative terminal-window ${c.border} transition-all duration-500 overflow-hidden`}
          whileHover={{ boxShadow: c.glow }}
        >
          {/* Gradient top strip */}
          <div
            className={`absolute top-0 left-0 right-0 h-px`}
            style={{
              background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)`,
            }}
          />

          {/* Big project number watermark */}
          <div
            className={`absolute top-4 right-6 text-8xl font-bold font-mono ${c.number} select-none pointer-events-none leading-none`}
          >
            {project.number}
          </div>

          <div className="p-6 md:p-8">
            {/* Header row */}
            <div className="flex flex-wrap items-start gap-4 mb-6">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded border ${c.badge}`}
                  >
                    {statusLabel[project.status]}
                  </span>
                  {project.status === 'live' && (
                    <span className="flex items-center gap-1.5 text-xs text-terminal-dim">
                      <motion.span
                        className={`w-1.5 h-1.5 rounded-full ${c.dot} block`}
                        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      deployed
                    </span>
                  )}
                  {project.status === 'launching-soon' && (
                    <motion.span
                      className="text-xs text-terminal-dim font-mono"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      MVP ready · launching soon
                    </motion.span>
                  )}
                </div>
                <h3 className="text-2xl md:text-3xl font-medium text-terminal-text mb-1">
                  {project.name}
                </h3>
                <p
                  className="text-base md:text-lg font-mono"
                  style={{ color: c.accent }}
                >
                  {project.tagline}
                </p>
              </div>
            </div>

            {/* Two-column body */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Left: problem + solution */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-px bg-terminal-muted" />
                    <span className="text-xs font-mono text-terminal-dim uppercase tracking-widest">
                      The Problem
                    </span>
                  </div>
                  <p className="text-sm text-terminal-dim leading-relaxed">
                    {project.problem}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-px" style={{ background: c.accent }} />
                    <span
                      className="text-xs font-mono uppercase tracking-widest"
                      style={{ color: c.accent }}
                    >
                      The Solution
                    </span>
                  </div>
                  <p className="text-sm text-terminal-dim leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              </div>

              {/* Right: features */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-px bg-terminal-muted" />
                  <span className="text-xs font-mono text-terminal-dim uppercase tracking-widest">
                    Key Features
                  </span>
                </div>
                <ul className="space-y-2">
                  {project.features.map((f, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-2 text-sm text-terminal-dim"
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.3 + i * 0.07, duration: 0.4 }}
                    >
                      <span
                        className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${c.featureDot}`}
                      />
                      {f}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-terminal-bg/50 rounded-lg border border-terminal-border/50">
              {project.stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className={`text-xl font-bold font-mono ${c.stat}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-terminal-dim mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer row: tech + links */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className={`tag ${c.tag} transition-all duration-200 cursor-default`}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {(project.link || project.github) && (
                <div className="flex gap-3 shrink-0">
                  {project.link && (
                    <motion.a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-1.5 text-sm font-mono rounded border transition-all duration-200 ${c.link}`}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      [live_demo]
                    </motion.a>
                  )}
                  {project.github && (
                    <motion.a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-1.5 text-sm font-mono rounded border transition-all duration-200 ${c.link}`}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      [source]
                    </motion.a>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.article>
      </TiltCard>
    </motion.div>
  )
}

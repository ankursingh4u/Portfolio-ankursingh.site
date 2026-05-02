'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { clientProjects } from '@/lib/site-config'
import { GlitchOnScroll, NeonPulse, TiltCard } from '../effects'

const colorMap = {
  amber: {
    accent: '#f59e0b',
    border: 'border-amber-500/50 hover:border-amber-400',
    glow: '0 0 35px rgba(245,158,11,0.18)',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    strip: 'from-amber-500/70 via-amber-400/30 to-transparent',
    dot: 'bg-amber-400',
    systemType: 'text-amber-400/80',
    bullet: 'bg-amber-500',
    link: 'border-amber-500/60 text-amber-400 hover:bg-amber-500 hover:text-black',
    divider: 'border-amber-500/15',
    meta: 'text-amber-400/50',
    playBtn: 'bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500 hover:text-black',
  },
  cyan: {
    accent: '#06b6d4',
    border: 'border-cyan-500/50 hover:border-cyan-400',
    glow: '0 0 35px rgba(6,182,212,0.18)',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    strip: 'from-cyan-500/70 via-cyan-400/30 to-transparent',
    dot: 'bg-cyan-400',
    systemType: 'text-cyan-400/80',
    bullet: 'bg-cyan-500',
    link: 'border-cyan-500/60 text-cyan-400 hover:bg-cyan-500 hover:text-black',
    divider: 'border-cyan-500/15',
    meta: 'text-cyan-400/50',
    playBtn: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black',
  },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export function ClientSystemsSection() {
  return (
    <section
      id="clients"
      className="pt-6 pb-14 px-6 md:px-8 relative overflow-hidden"
      style={{
        scrollMarginTop: '72px',
        background: 'linear-gradient(180deg, #0a0a0b 0%, #0c0d0a 50%, #0a0a0b 100%)',
      }}
    >
      <div className="absolute inset-0 grid-bg opacity-[0.06] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/[0.05] via-transparent to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full relative z-10">
        {/* Header */}
        <GlitchOnScroll>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-header mb-3"
          >
            <h2 className="section-title">
              <NeonPulse color="#f59e0b">client_systems</NeonPulse>
            </h2>
            <span className="text-xs text-terminal-dim font-mono">// real paid work · live in production</span>
          </motion.div>
        </GlitchOnScroll>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-terminal-dim text-sm mb-8 max-w-xl leading-relaxed"
        >
          Real systems built for actual businesses — live, used daily, and solving
          real operational problems.
        </motion.p>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8"
        >
          {clientProjects.map((project, index) => (
            <ClientCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <CTABlock />
        </motion.div>
      </div>
    </section>
  )
}

function ClientCard({
  project,
  index,
}: {
  project: (typeof clientProjects)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [playing, setPlaying] = useState(false)
  const c = colorMap[project.color]

  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
      setPlaying(false)
    } else {
      videoRef.current.play()
      setPlaying(true)
    }
  }

  return (
    <motion.div ref={ref} variants={itemVariants} className="h-full">
      <TiltCard glareEnabled>
        <motion.article
          className={`relative terminal-window ${c.border} transition-all duration-500 overflow-hidden h-full flex flex-col`}
          whileHover={{ boxShadow: c.glow }}
        >
          {/* Top gradient strip */}
          <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${c.strip}`} />

          {/* Video Preview */}
          <div
            className="relative w-full overflow-hidden bg-terminal-bg cursor-pointer group/video"
            style={{ aspectRatio: '16/6' }}
            onClick={togglePlay}
          >
            <video
              ref={videoRef}
              src={project.video}
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover object-top"
              onEnded={() => setPlaying(false)}
            />

            {/* Dark overlay when paused */}
            <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${playing ? 'opacity-0 group-hover/video:opacity-20' : 'opacity-100 group-hover/video:opacity-60'}`} />

            {/* Play / Pause button */}
            <motion.button
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${playing ? 'opacity-0 group-hover/video:opacity-100' : 'opacity-100'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              <span className={`flex items-center justify-center w-12 h-12 rounded-full border backdrop-blur-sm transition-all duration-200 ${c.playBtn}`}>
                {playing ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </span>
            </motion.button>

            {/* Live badge */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none">
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded border font-bold backdrop-blur-sm ${c.badge}`}>
                LIVE
              </span>
              <motion.span
                className={`w-1.5 h-1.5 rounded-full ${c.dot}`}
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.4 }}
              />
            </div>

            {/* System type watermark bottom-right */}
            <div className="absolute bottom-2 right-2 pointer-events-none">
              <span className="text-2xs font-mono text-white/50 backdrop-blur-sm px-1.5 py-0.5 rounded bg-black/30">
                {project.systemType}
              </span>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-3 flex flex-col flex-1">
            {/* Name + year */}
            <div className="flex items-start justify-between gap-2 mb-0.5">
              <h3 className="text-sm font-medium text-terminal-text leading-tight">
                {project.name}
              </h3>
              <span className="text-xs text-terminal-dim font-mono shrink-0">{project.year}</span>
            </div>
            <p className="text-xs text-terminal-dim mb-2">{project.businessType}</p>

            {/* Capabilities */}
            <ul className="space-y-1 mb-2 flex-1">
              {project.capabilities.slice(0, 3).map((cap, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-1.5 text-xs text-terminal-dim"
                  initial={{ opacity: 0, x: -6 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.15 + i * 0.06 }}
                >
                  <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${c.bullet}`} />
                  {cap}
                </motion.li>
              ))}
            </ul>

            {/* Footer */}
            <div className={`border-t ${c.divider} pt-2 flex items-center justify-between gap-3`}>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span>
                  <span className={`${c.meta} mr-1`}>built in</span>
                  <span className="text-terminal-text">{project.deliveredIn}</span>
                </span>
                {project.maintained && (
                  <span>
                    <span className={`${c.meta} mr-1`}>maintained</span>
                    <span className="text-terminal-text">yes</span>
                  </span>
                )}
              </div>
              <motion.a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs font-mono px-3 py-1 rounded border transition-all duration-200 shrink-0 ${c.link}`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                [view_live]
              </motion.a>
            </div>
          </div>
        </motion.article>
      </TiltCard>
    </motion.div>
  )
}

function CTABlock() {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden border border-amber-500/40"
      style={{ background: 'linear-gradient(135deg, #0f0e09 0%, #130f05 50%, #0a0a0b 100%)' }}
      whileHover={{ boxShadow: '0 0 50px rgba(245,158,11,0.15)' }}
      transition={{ duration: 0.3 }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      {/* Corner glows */}
      <div className="absolute top-0 left-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)', transform: 'translate(-40%, -40%)' }} />
      <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)', transform: 'translate(40%, 40%)' }} />

      <div className="relative z-10 px-8 py-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-mono text-amber-400 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Available for new projects
        </div>

        <h3 className="text-2xl md:text-3xl font-medium text-terminal-text mb-3">
          Want a system like this for your business?
        </h3>

        <p className="text-terminal-dim text-sm max-w-md mx-auto mb-8 leading-relaxed">
          I build production-ready systems — not templates. If you have a real operational problem, I can engineer the solution and keep it running.
        </p>

        <motion.a
          href="#contact"
          className="inline-flex items-center gap-3 px-8 py-3.5 font-mono text-sm font-medium bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-all duration-200"
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(245,158,11,0.4)' }}
          whileTap={{ scale: 0.97 }}
        >
          Start Your Project
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </motion.a>
      </div>
    </motion.div>
  )
}

'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { techStack } from '@/lib/site-config'
import { GlitchOnScroll, NeonPulse } from '../effects'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
}

const techMeta: Record<string, { color: string; bg: string; icon: string }> = {
  TypeScript:    { color: '#3178c6', bg: 'rgba(49,120,198,0.12)', icon: 'TS' },
  JavaScript:    { color: '#f1e05a', bg: 'rgba(241,224,90,0.10)', icon: 'JS' },
  Python:        { color: '#3572A5', bg: 'rgba(53,114,165,0.12)', icon: 'Py' },
  React:         { color: '#61dafb', bg: 'rgba(97,218,251,0.10)', icon: '⚛' },
  'Next.js':     { color: '#e6edf3', bg: 'rgba(230,237,243,0.07)', icon: 'N' },
  'Tailwind CSS':{ color: '#06b6d4', bg: 'rgba(6,182,212,0.10)', icon: '~' },
  HTML5:         { color: '#e34c26', bg: 'rgba(227,76,38,0.10)', icon: '5' },
  'Node.js':     { color: '#68a063', bg: 'rgba(104,160,99,0.10)', icon: 'N' },
  Express:       { color: '#8b949e', bg: 'rgba(139,148,158,0.10)', icon: 'Ex' },
  PostgreSQL:    { color: '#336791', bg: 'rgba(51,103,145,0.12)', icon: '🐘' },
  MongoDB:       { color: '#4db33d', bg: 'rgba(77,179,61,0.10)', icon: 'M' },
  Supabase:      { color: '#3ecf8e', bg: 'rgba(62,207,142,0.10)', icon: 'SB' },
  Git:           { color: '#f05032', bg: 'rgba(240,80,50,0.10)', icon: 'G' },
  'VS Code':     { color: '#007acc', bg: 'rgba(0,122,204,0.10)', icon: '{ }' },
  Vercel:        { color: '#e6edf3', bg: 'rgba(230,237,243,0.07)', icon: '▲' },
  AWS:           { color: '#ff9900', bg: 'rgba(255,153,0,0.10)', icon: 'A' },
  Docker:        { color: '#2496ed', bg: 'rgba(36,150,237,0.10)', icon: '🐳' },
  'React Native':{ color: '#61dafb', bg: 'rgba(97,218,251,0.08)', icon: '📱' },
  DevOps:        { color: '#a855f7', bg: 'rgba(168,85,247,0.10)', icon: '⚙' },
  'System Design':{ color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', icon: '∞' },
  DSA:           { color: '#4f46e5', bg: 'rgba(34,197,94,0.10)', icon: '<>' },
}

const stackCategories = [
  { key: 'languages' as const, label: 'Languages', color: '#3178c6' },
  { key: 'frontend' as const, label: 'Frontend', color: '#61dafb' },
  { key: 'backend' as const, label: 'Backend', color: '#68a063' },
  { key: 'tools' as const, label: 'Tools & DevOps', color: '#f59e0b' },
  { key: 'learning' as const, label: 'Currently Learning', color: '#a855f7' },
]

export function StackSection() {
  return (
    <section id="stack" className="section bg-terminal-surface/30 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      {/* Subtle radial accent */}
      <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4f46e5 0%, transparent 70%)' }} />

      <div className="container-wide mx-auto relative z-10">
        <GlitchOnScroll>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-header"
          >
            <h2 className="section-title">
              <NeonPulse color="#4f46e5">stack</NeonPulse>
            </h2>
            <span className="text-xs text-terminal-dim font-mono">// technical capabilities</span>
          </motion.div>
        </GlitchOnScroll>

        {/* Two-column: tech tiles left, keyboard image right */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* Tech tiles */}
          <div className="flex-1 space-y-7">
            {stackCategories.map((cat) => (
              <CategoryBlock
                key={cat.key}
                label={cat.label}
                color={cat.color}
                items={techStack[cat.key]}
                isLearning={cat.key === 'learning'}
              />
            ))}
          </div>

          {/* Image stack — sticky on desktop */}
          <div className="hidden lg:flex flex-col gap-3 w-[240px] shrink-0 sticky top-24 self-start">
            <div className="rounded-xl overflow-hidden border border-terminal-accent/20 shadow-[0_0_30px_rgba(34,197,94,0.08)]">
              <Image
                src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=480&auto=format&fit=crop&q=85"
                alt="Developer at dark workstation"
                width={480}
                height={320}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="rounded-xl overflow-hidden border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.06)]">
              <Image
                src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=480&auto=format&fit=crop&q=85"
                alt="Code on monitor"
                width={480}
                height={300}
                className="w-full h-auto object-cover"
              />
            </div>
            <p className="text-xs text-terminal-dim font-mono text-center opacity-50">
              // tools of the trade
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}

function CategoryBlock({
  label,
  color,
  items,
  isLearning,
}: {
  label: string
  color: string
  items: string[]
  isLearning?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {/* Category label */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 rounded-full" style={{ background: color }} />
        <span className="text-xs font-mono uppercase tracking-widest" style={{ color }}>
          {label}
        </span>
        {isLearning && (
          <motion.span
            className="text-2xs text-terminal-dim font-mono"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            · in progress
          </motion.span>
        )}
      </div>

      {/* Icon tiles */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-wrap gap-2"
      >
        {items.map((tech) => {
          const meta = techMeta[tech] ?? { color: '#8b949e', bg: 'rgba(139,148,158,0.10)', icon: tech.slice(0, 2) }
          return (
            <motion.div
              key={tech}
              variants={itemVariants}
              whileHover={{ scale: 1.08, y: -2, boxShadow: `0 4px 16px ${meta.color}25` }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 cursor-default ${isLearning ? 'border-dashed' : ''}`}
              style={{
                background: meta.bg,
                borderColor: `${meta.color}40`,
              }}
            >
              <span
                className="text-xs font-mono font-bold leading-none w-5 text-center shrink-0"
                style={{ color: meta.color }}
              >
                {meta.icon}
              </span>
              <span className="text-xs text-terminal-text whitespace-nowrap">{tech}</span>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}

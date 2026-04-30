'use client'

import { useState, useEffect, type FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlitchOnScroll, NeonPulse } from '../effects'

type ChapterId = 'intro' | 'journey' | 'approach' | 'current' | 'beyond'

interface ChapterDef {
  id: ChapterId
  number: string
  title: string
  teaser: string
  accent: string
}

const CHAPTERS: ChapterDef[] = [
  { id: 'intro', number: '01', title: 'Who I Am', teaser: 'Engineer · Builder · Solver', accent: '#22c55e' },
  { id: 'journey', number: '02', title: 'Web3 Journey', teaser: '200+ projects · 2018–2023', accent: '#8b5cf6' },
  { id: 'approach', number: '03', title: 'How I Build', teaser: 'Clean code · Real products', accent: '#3b82f6' },
  { id: 'current', number: '04', title: 'Current Focus', teaser: 'DSA · React Native · DevOps', accent: '#f59e0b' },
  { id: 'beyond', number: '05', title: 'Beyond Code', teaser: 'Books · Calisthenics · Films', accent: '#f43f5e' },
]

// ─── Card Illustrations ────────────────────────────────────────────────────────

function IntroIllustration({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 80 52" fill="none" className="w-full h-full">
      <rect x="4" y="3" width="72" height="46" rx="5" stroke={accent} strokeWidth="1.5" fill={accent + '08'} />
      <rect x="4" y="3" width="72" height="11" rx="5" fill={accent + '15'} />
      <circle cx="15" cy="8.5" r="2.5" fill="#f43f5e" opacity="0.7" />
      <circle cx="23" cy="8.5" r="2.5" fill="#f59e0b" opacity="0.7" />
      <circle cx="31" cy="8.5" r="2.5" fill="#22c55e" opacity="0.7" />
      <rect x="12" y="22" width="20" height="2.5" rx="1.25" fill={accent} opacity="0.65" />
      <rect x="12" y="29" width="34" height="2.5" rx="1.25" fill={accent} opacity="0.35" />
      <rect x="12" y="36" width="26" height="2.5" rx="1.25" fill={accent} opacity="0.45" />
      <rect x="52" y="22" width="8" height="2.5" rx="0.5" fill={accent} opacity="0.9" />
    </svg>
  )
}

function JourneyIllustration({ accent }: { accent: string }) {
  const xs = [10, 26, 42, 58, 74, 90]
  return (
    <svg viewBox="0 0 100 52" fill="none" className="w-full h-full">
      <line x1="10" y1="26" x2="90" y2="26" stroke={accent} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.35" />
      {xs.map((x, i) => {
        const hex = `M${x},${16} L${x + 7},${21} L${x + 7},${31} L${x},${36} L${x - 7},${31} L${x - 7},${21} Z`
        return (
          <g key={i}>
            <path d={hex} stroke={accent} strokeWidth="1.3" fill={accent + '10'} opacity={0.3 + i * 0.13} />
            <text x={x} y={27} textAnchor="middle" dominantBaseline="middle" fill={accent} fontSize="4.5" fontFamily="monospace" opacity="0.9">
              {`'${18 + i}`}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function ApproachIllustration({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 80 52" fill="none" className="w-full h-full">
      <text x="8" y="38" fill={accent} fontSize="28" fontFamily="monospace" opacity="0.55" fontWeight="700">{'{'}</text>
      <text x="60" y="38" fill={accent} fontSize="28" fontFamily="monospace" opacity="0.55" fontWeight="700">{'}'}</text>
      <circle cx="40" cy="24" r="12" stroke={accent} strokeWidth="1.5" fill={accent + '10'} />
      <circle cx="40" cy="24" r="5" fill={accent} opacity="0.3" />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const r = (deg * Math.PI) / 180
        const x1 = 40 + 12 * Math.cos(r); const y1 = 24 + 12 * Math.sin(r)
        const x2 = 40 + 15.5 * Math.cos(r); const y2 = 24 + 15.5 * Math.sin(r)
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent} strokeWidth="1.8" opacity="0.5" strokeLinecap="round" />
      })}
    </svg>
  )
}

function FocusIllustration({ accent }: { accent: string }) {
  const bars = [72, 45, 38, 28]
  return (
    <svg viewBox="0 0 80 52" fill="none" className="w-full h-full">
      {bars.map((w, i) => (
        <g key={i}>
          <rect x="8" y={6 + i * 11} width="64" height="7" rx="3.5" fill={accent + '15'} />
          <rect x="8" y={6 + i * 11} width={(w / 100) * 64} height="7" rx="3.5" fill={accent} opacity={0.45 + i * 0.08} />
        </g>
      ))}
    </svg>
  )
}

function BeyondIllustration({ accent }: { accent: string }) {
  return (
    <svg viewBox="0 0 80 52" fill="none" className="w-full h-full">
      <path d="M16 12 L40 17 L64 12 L64 40 L40 45 L16 40 Z" stroke={accent} strokeWidth="1.2" fill={accent + '10'} />
      <line x1="40" y1="17" x2="40" y2="45" stroke={accent} strokeWidth="0.8" opacity="0.5" />
      <line x1="20" y1="22" x2="36" y2="19" stroke={accent} strokeWidth="0.6" opacity="0.4" />
      <line x1="20" y1="27" x2="36" y2="24" stroke={accent} strokeWidth="0.6" opacity="0.4" />
      <line x1="20" y1="32" x2="36" y2="29" stroke={accent} strokeWidth="0.6" opacity="0.4" />
      <line x1="44" y1="19" x2="60" y2="22" stroke={accent} strokeWidth="0.6" opacity="0.4" />
      <line x1="44" y1="24" x2="60" y2="27" stroke={accent} strokeWidth="0.6" opacity="0.4" />
      <circle cx="60" cy="47" r="4" stroke={accent} strokeWidth="1" fill={accent + '15'} opacity="0.7" />
      <rect x="62" y="45.5" width="6" height="3" rx="0.5" fill={accent} opacity="0.5" />
      <circle cx="70" cy="47" r="4" stroke={accent} strokeWidth="1" fill={accent + '15'} opacity="0.7" />
    </svg>
  )
}

const ILLUSTRATIONS: Record<ChapterId, FC<{ accent: string }>> = {
  intro: IntroIllustration,
  journey: JourneyIllustration,
  approach: ApproachIllustration,
  current: FocusIllustration,
  beyond: BeyondIllustration,
}

// ─── Modal Scenes ─────────────────────────────────────────────────────────────

function IntroScene() {
  const lines = [
    { k: 'role', v: '"Full-Stack Engineer"', vc: '#22c55e' },
    { k: 'company', v: '"Sabai Innovations"', vc: '#22c55e' },
    { k: 'type', v: '"Full-Stack Engineer (Production)"', vc: '#22c55e' },
    { k: 'focus', v: '["Shopify", "AI", "SaaS"]', vc: '#3b82f6' },
    { k: 'values', v: '["ownership", "clarity", "reliability"]', vc: '#8b5cf6' },
  ]
  return (
    <div className="space-y-4">
      <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-xs border border-emerald-900/40">
        <div className="text-emerald-700 mb-3 text-[10px]">// ankur.profile.json</div>
        {lines.map((l, i) => (
          <motion.div
            key={l.k}
            className="flex gap-2 mb-1.5 flex-wrap"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <span className="text-blue-400">"{l.k}"</span>
            <span className="text-[#8b949e]">:</span>
            <span style={{ color: l.vc }}>{l.v}</span>
          </motion.div>
        ))}
      </div>
      <p className="text-sm text-[#8b949e] leading-relaxed">
        I am a Full-Stack Software Engineer who genuinely enjoys the entire process of turning an idea into a working product — from the first conversation about requirements all the way through architecture, development, deployment, and ongoing maintenance. I do not just write code and hand it off; I own what I build, which means I am accountable for every edge case, every deployment decision, and every bug that surfaces at 2am on a Monday.
      </p>
      <p className="text-sm text-[#8b949e] leading-relaxed">
        Currently working as a Full-Stack Engineer at Sabai Innovations / CodersHive, where I operate like a complete engineering team — gathering product requirements, designing database schemas, writing frontend and backend code, integrating third-party APIs, deploying to production, and maintaining live systems that real Shopify merchants depend on every single day. I have shipped three production apps: AnnounceFlow, Countdown Bar, and Social Proof — each a fully independent product with its own OAuth flow, multi-merchant PostgreSQL schema, Shopify API integrations, and merchant-facing dashboard built on Shopify Polaris.
      </p>
      <div className="flex flex-wrap gap-2">
        {['TypeScript', 'Next.js', 'React', 'PostgreSQL', 'Node.js', 'Shopify'].map(t => (
          <span key={t} className="px-2 py-0.5 bg-emerald-950/50 border border-emerald-800/40 text-emerald-400 text-xs rounded">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

function Web3Scene() {
  const nodes = [
    { year: "'18", label: 'First crypto', sub: 'DeFi protocols' },
    { year: "'19", label: 'NFT markets', sub: 'Early adoption' },
    { year: "'20", label: 'DeFi deep dive', sub: 'Smart contracts' },
    { year: "'21", label: '50+ projects', sub: 'Peak research' },
    { year: "'22", label: 'DAO & Gov', sub: 'Tokenomics' },
    { year: "'23", label: 'Pivot →', sub: 'Full-stack' },
  ]
  return (
    <div className="space-y-5">
      {/* Hexagon timeline */}
      <div className="relative py-2">
        <div className="absolute top-9 left-0 right-0 h-px bg-gradient-to-r from-violet-900 via-violet-500/50 to-violet-900 mx-2" />
        <div className="flex justify-between relative">
          {nodes.map((node, i) => (
            <motion.div
              key={node.year}
              className="flex flex-col items-center w-12"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.35 }}
            >
              <div className="relative w-10 h-10 flex items-center justify-center mb-1">
                <svg viewBox="0 0 32 32" className="absolute inset-0 w-full h-full">
                  <path
                    d="M16,4 L26,10 L26,22 L16,28 L6,22 L6,10 Z"
                    stroke="#8b5cf6"
                    strokeWidth="1.5"
                    fill={i === 5 ? '#8b5cf640' : '#8b5cf610'}
                  />
                </svg>
                <span className="text-[8px] font-bold text-violet-300 font-mono relative z-10">{node.year}</span>
              </div>
              <div className="text-center">
                <div className="text-[8px] text-violet-200 font-medium leading-tight">{node.label}</div>
                <div className="text-[7px] text-[#8b949e] leading-tight">{node.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="p-3 bg-violet-950/25 border border-violet-800/30 rounded-lg">
        <div className="text-xs font-bold text-violet-300 mb-2">What five years of deep research built in me:</div>
        <ul className="space-y-1.5">
          {[
            'Systems thinking — understanding how incentive structures, token economics, and network effects interact at scale',
            'Product analysis discipline — evaluating 200+ projects taught me to quickly identify what is real value versus what is noise',
            'Distributed architecture intuition — studying on-chain protocols gave me a mental model for designing resilient, decentralised systems',
          ].map(p => (
            <li key={p} className="text-xs text-[#8b949e] flex gap-2 items-start">
              <span className="text-violet-500 flex-shrink-0 mt-0.5">▸</span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-[#8b949e] leading-relaxed">
        From 2018 to 2023 I was deeply embedded in the decentralised web — researching over 200 projects spanning DeFi protocols, NFT ecosystems, DAO governance models, and Layer-2 scaling solutions. This was not passive reading; I was actively evaluating tokenomics, stress-testing whitepapers, and tracking how projects evolved from concept to collapse or success. That experience gave me a rare combination of analytical rigour and big-picture thinking that I carry directly into how I approach software engineering today. When I pivoted to building practical products, I did not abandon that mindset — I applied it. The result is an engineer who thinks in systems, not just in functions.
      </p>
    </div>
  )
}

function ApproachScene() {
  const principles = [
    {
      title: 'Clean Architecture',
      desc: 'I write code as if the next person to read it is a senior engineer with no context on what I was thinking. That means clear naming, obvious structure, no clever one-liners that save three characters but cost three minutes of comprehension. Good code does not need a lot of comments — it explains itself.',
      color: '#3b82f6',
    },
    {
      title: 'Ship Real Products',
      desc: 'I believe the only way to truly learn engineering is to put something in front of real users and watch what breaks. Every project I build is deployed to a live URL, used by actual people, and maintained over time. That accountability loop — build, ship, observe, fix — is where most of the real learning happens.',
      color: '#22c55e',
    },
    {
      title: 'First Principles Thinking',
      desc: 'Before reaching for a library, a pattern, or a framework, I ask: what problem are we actually solving here? I try to understand the problem at its root before deciding how to solve it. This prevents over-engineering, premature abstractions, and the very common mistake of copying a solution that does not actually fit the problem.',
      color: '#8b5cf6',
    },
    {
      title: 'Full Ownership',
      desc: 'I take responsibility for the complete lifecycle of what I build — not just the happy path, but the error states, the performance under load, the deployment pipeline, and the maintenance six months after launch. If it is in production and I built it, it is mine to understand, fix, and improve.',
      color: '#f59e0b',
    },
  ]
  return (
    <div className="space-y-3">
      {principles.map((p, i) => (
        <motion.div
          key={p.title}
          className="flex gap-3 items-start p-3 rounded-lg border"
          style={{ backgroundColor: p.color + '0A', borderColor: p.color + '30' }}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.09, duration: 0.35 }}
        >
          <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: p.color }} />
          <div>
            <div className="text-sm font-semibold" style={{ color: p.color }}>{p.title}</div>
            <div className="text-xs text-[#8b949e] mt-0.5 leading-relaxed">{p.desc}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function FocusScene() {
  const items = [
    { label: 'Data Structures & Algorithms', pct: 65, color: '#f59e0b' },
    { label: 'React Native', pct: 30, color: '#f97316' },
    { label: 'System Design', pct: 42, color: '#eab308' },
    { label: 'DevOps Fundamentals', pct: 28, color: '#84cc16' },
  ]
  return (
    <div className="space-y-5">
      {items.map((item, i) => (
        <motion.div key={item.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-[#e2e8f0] font-medium">{item.label}</span>
            <span style={{ color: item.color }} className="font-mono font-semibold">{item.pct}%</span>
          </div>
          <div className="h-2 bg-[#21262d] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: item.color }}
              initial={{ width: 0 }}
              animate={{ width: `${item.pct}%` }}
              transition={{ delay: i * 0.1 + 0.2, duration: 0.9, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      ))}
      <p className="text-sm text-[#8b949e] leading-relaxed pt-1">
        While I am already shipping production software professionally, I believe a strong engineer never stops sharpening their fundamentals. Data Structures and Algorithms is not just interview prep for me — it is about training the part of my brain that breaks down complex problems into their simplest possible form before writing a single line of code. React Native is next because I want to own the mobile layer of a product the same way I own the web layer — without depending on someone else. DevOps is the final frontier: I want to understand every step between my code and the user's screen, from CI/CD pipelines and containerisation to monitoring and incident response. Full ownership of the stack is the goal.
      </p>
    </div>
  )
}

function BeyondScene() {
  return (
    <div className="space-y-5">
      {/* Animated characters */}
      <div className="flex gap-8 justify-center items-end pt-2">

        {/* Reading character */}
        <div className="flex flex-col items-center gap-1.5">
          <motion.div
            animate={{ rotate: [-1.5, 1.5, -1.5] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg viewBox="0 0 70 88" fill="none" width="82" height="102">
              {/* Chair */}
              <rect x="48" y="46" width="3" height="28" rx="1.5" fill="#334155" />
              <rect x="30" y="60" width="24" height="3" rx="1.5" fill="#334155" />
              <rect x="30" y="70" width="24" height="3" rx="1.5" fill="#334155" />
              {/* Body */}
              <rect x="27" y="44" width="20" height="22" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="1" />
              {/* Head */}
              <circle cx="37" cy="33" r="10" fill="#1e293b" stroke="#334155" strokeWidth="1.2" />
              {/* Glasses */}
              <rect x="30" y="30" width="7" height="5.5" rx="1.5" stroke="#475569" strokeWidth="0.9" fill="none" />
              <rect x="38.5" y="30" width="7" height="5.5" rx="1.5" stroke="#475569" strokeWidth="0.9" fill="none" />
              <line x1="37" y1="32.8" x2="38.5" y2="32.8" stroke="#475569" strokeWidth="0.9" />
              {/* Eyes blinking */}
              <motion.ellipse cx="33.5" cy="32.8" rx="1.5" ry="1.8" fill="#22c55e"
                animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 5, repeat: Infinity, times: [0, 0.92, 1] }} />
              <motion.ellipse cx="42" cy="32.8" rx="1.5" ry="1.8" fill="#22c55e"
                animate={{ scaleY: [1, 0.1, 1] }} transition={{ duration: 5, repeat: Infinity, times: [0, 0.92, 1] }} />
              {/* Arms */}
              <rect x="13" y="52" width="14" height="3" rx="1.5" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
              <rect x="47" y="52" width="14" height="3" rx="1.5" fill="#1e293b" stroke="#334155" strokeWidth="0.8" />
              {/* Open book */}
              <path d="M14 43 L37 39 L60 43 L60 60 L37 64 L14 60 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" />
              <line x1="37" y1="39" x2="37" y2="64" stroke="#94a3b8" strokeWidth="0.7" />
              <line x1="18" y1="48" x2="34" y2="44.5" stroke="#cbd5e1" strokeWidth="0.6" />
              <line x1="18" y1="52.5" x2="34" y2="49" stroke="#cbd5e1" strokeWidth="0.6" />
              <line x1="18" y1="57" x2="34" y2="53.5" stroke="#cbd5e1" strokeWidth="0.6" />
              <line x1="40" y1="44.5" x2="56" y2="48" stroke="#cbd5e1" strokeWidth="0.6" />
              <line x1="40" y1="49" x2="56" y2="52.5" stroke="#cbd5e1" strokeWidth="0.6" />
              <line x1="40" y1="53.5" x2="56" y2="57" stroke="#cbd5e1" strokeWidth="0.6" />
              {/* Legs */}
              <rect x="28" y="66" width="8" height="17" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="0.9" />
              <rect x="38" y="66" width="8" height="17" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="0.9" />
            </svg>
          </motion.div>
          <span className="text-xs text-[#8b949e]">Reading</span>
        </div>

        {/* Pull-up character */}
        <div className="flex flex-col items-center gap-1.5">
          <svg viewBox="0 0 60 90" fill="none" width="72" height="108">
            {/* Bar */}
            <rect x="6" y="8" width="48" height="4" rx="2" fill="#334155" stroke="#475569" strokeWidth="0.6" />
            <rect x="7" y="2" width="3" height="10" rx="1" fill="#475569" />
            <rect x="50" y="2" width="3" height="10" rx="1" fill="#475569" />
            {/* Animated figure */}
            <motion.g
              animate={{ y: [0, -18, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Hands */}
              <rect x="19" y="10" width="4" height="12" rx="2" fill="#f43f5e" opacity="0.8" />
              <rect x="37" y="10" width="4" height="12" rx="2" fill="#f43f5e" opacity="0.8" />
              {/* Head */}
              <circle cx="30" cy="30" r="8" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.2" />
              {/* Determined eyes */}
              <line x1="26" y1="29" x2="28.5" y2="29" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="31.5" y1="29" x2="34" y2="29" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M27 34.5 Q30 32.5 33 34.5" stroke="#f43f5e" strokeWidth="1" fill="none" strokeLinecap="round" />
              {/* Body */}
              <rect x="23" y="38" width="14" height="20" rx="5" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.1" />
              {/* Legs bent */}
              <path d="M25 58 Q21 67 25 71" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M35 58 Q39 67 35 71" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" fill="none" />
            </motion.g>
          </svg>
          <span className="text-xs text-[#8b949e]">Calisthenics</span>
        </div>
      </div>

      {/* Activity pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { label: 'Reading', color: '#22c55e' },
          { label: 'Calisthenics', color: '#f43f5e' },
          { label: 'Travelling', color: '#3b82f6' },
          { label: 'Films', color: '#f59e0b' },
        ].map(({ label, color }) => (
          <span
            key={label}
            className="px-3 py-1 text-xs rounded-full border font-medium"
            style={{ color, borderColor: color + '45', backgroundColor: color + '12' }}
          >
            {label}
          </span>
        ))}
      </div>

      <p className="text-sm text-[#8b949e] leading-relaxed">
        Engineering is a mental craft, and like any craft it requires rest, variety, and inspiration from outside the discipline. Reading keeps my thinking precise — I gravitate toward books on systems, psychology, and history because understanding how things work at a human level makes me a better product engineer. Calisthenics keeps me disciplined in a way that sitting at a desk never can; the consistency required to progress at pull-ups and handstands maps directly onto the consistency required to improve as an engineer. Travelling exposes me to problems I would never encounter behind a screen, and those problems often spark the most interesting product ideas. Films, especially well-crafted ones, remind me that storytelling and structure matter in everything — including how you design a user interface or write documentation that a real person has to read.
      </p>
    </div>
  )
}

const SCENES: Record<ChapterId, FC> = {
  intro: IntroScene,
  journey: Web3Scene,
  approach: ApproachScene,
  current: FocusScene,
  beyond: BeyondScene,
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function ChapterCard({
  chapter,
  index,
  onClick,
}: {
  chapter: ChapterDef
  index: number
  onClick: () => void
}) {
  const Illustration = ILLUSTRATIONS[chapter.id]
  return (
    <motion.button
      onClick={onClick}
      className="relative w-full text-left overflow-hidden rounded-xl border border-[#21262d] bg-[#161b22] cursor-pointer group focus:outline-none"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      {/* Hover glow border */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px ${chapter.accent}60` }}
      />
      {/* Hover radial gradient */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${chapter.accent}0D, transparent 65%)` }}
      />
      {/* Number watermark */}
      <div
        className="absolute -top-1 right-2 text-7xl font-black select-none leading-none pointer-events-none"
        style={{ color: chapter.accent, opacity: 0.04 }}
      >
        {chapter.number}
      </div>

      {/* Illustration */}
      <div className="h-[72px] px-5 pt-4 pb-0 relative z-10">
        <Illustration accent={chapter.accent} />
      </div>

      {/* Text */}
      <div className="px-5 pb-4 pt-2 relative z-10">
        <div className="text-[9px] tracking-widest font-mono text-[#484f58] mb-1">CHAPTER {chapter.number}</div>
        <div className="text-sm font-bold text-[#e2e8f0]">{chapter.title}</div>
        <div className="text-xs text-[#8b949e] mt-0.5">{chapter.teaser}</div>
        <div
          className="mt-3 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
          style={{ color: chapter.accent }}
        >
          Explore <span>→</span>
        </div>
      </div>
    </motion.button>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function ChapterModal({ chapter, onClose }: { chapter: ChapterDef; onClose: () => void }) {
  const Scene = SCENES[chapter.id]
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Card */}
      <motion.div
        className="relative z-10 w-full max-w-lg bg-[#0d1117] border rounded-2xl overflow-hidden shadow-2xl"
        style={{ borderColor: chapter.accent + '45' }}
        initial={{ scale: 0.85, opacity: 0, y: 32 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
      >
        {/* Top accent stripe */}
        <div className="h-1 w-full" style={{ backgroundColor: chapter.accent }} />

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black leading-none select-none" style={{ color: chapter.accent, opacity: 0.2 }}>
              {chapter.number}
            </span>
            <h3 className="text-base font-bold text-white">{chapter.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-[#8b949e] hover:text-white hover:bg-white/10 transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Scene content */}
        <div className="px-5 pb-4 max-h-[65vh] overflow-y-auto">
          <Scene />
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-[#21262d] flex justify-between items-center">
          <span className="text-[10px] text-[#484f58] font-mono">chapter {chapter.number} of 05</span>
          <button onClick={onClose} className="text-[10px] text-[#484f58] hover:text-[#8b949e] transition-colors">
            close esc
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function AboutSection() {
  const [active, setActive] = useState<ChapterId | null>(null)
  const activeChapter = active ? CHAPTERS.find(c => c.id === active) ?? null : null

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <section id="about" className="section bg-terminal-surface/30 relative overflow-hidden">
      <div className="container-narrow mx-auto relative z-10">
        {/* Header */}
        <GlitchOnScroll>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-header"
          >
            <h2 className="section-title">
              <NeonPulse color="#22c55e">about</NeonPulse>
            </h2>
            <span className="text-xs text-terminal-dim font-mono">// my story in chapters</span>
          </motion.div>
        </GlitchOnScroll>

        {/* Top row: 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHAPTERS.slice(0, 3).map((ch, i) => (
            <ChapterCard key={ch.id} chapter={ch} index={i} onClick={() => setActive(ch.id)} />
          ))}
        </div>
        {/* Bottom row: 2 cards centered */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 lg:w-2/3 lg:mx-auto">
          {CHAPTERS.slice(3).map((ch, i) => (
            <ChapterCard key={ch.id} chapter={ch} index={i + 3} onClick={() => setActive(ch.id)} />
          ))}
        </div>
      </div>

      {/* Modal overlay */}
      <AnimatePresence>
        {activeChapter && (
          <ChapterModal chapter={activeChapter} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

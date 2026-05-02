'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '@/lib/site-config'
import { GlitchOnScroll, NeonPulse, TiltCard } from '../effects'

interface Repo {
  name: string
  description: string | null
  language: string | null
  stars: number
  pushed_at: string
  html_url: string
  topics: string[]
  account: string
}

const langColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Rust: '#dea584',
  Go: '#00ADD8',
  Liquid: '#6f42c1',
  EJS: '#a97bff',
  Vue: '#41b883',
  Shell: '#89e051',
  Ruby: '#701516',
  Java: '#b07219',
  'C#': '#239120',
  'C++': '#f34b7d',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`
  return `${Math.floor(diff / 31536000)}y ago`
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export function GitHubSection() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/github')
      .then((r) => r.json())
      .then((data) => {
        setRepos(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section id="github" className="section bg-terminal-surface/20 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full relative z-10">
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
              <NeonPulse color="#22c55e">github</NeonPulse>
            </h2>
            <span className="text-xs text-terminal-dim font-mono">
              // public repositories · live sync
            </span>
          </motion.div>
        </GlitchOnScroll>

        {/* Profile strips — both accounts */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {[
            { handle: 'ankursingh4u', url: siteConfig.social.github, label: 'primary' },
            { handle: 'ankur4work', url: 'https://github.com/ankur4work', label: 'work' },
          ].map((acc) => (
            <div
              key={acc.handle}
              className="flex flex-1 min-w-[200px] items-center justify-between gap-3 p-3 terminal-window"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-terminal-accent/10 border border-terminal-accent/30 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-terminal-accent" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-terminal-text font-mono">{acc.handle}</div>
                  <div className="text-2xs text-terminal-dim">{acc.label}</div>
                </div>
              </div>
              <motion.a
                href={acc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="terminal-btn text-xs py-1 px-2.5"
                whileHover={{ scale: 1.03, borderColor: '#22c55e' }}
                whileTap={{ scale: 0.97 }}
              >
                [view]
              </motion.a>
            </div>
          ))}
        </motion.div>

        {/* Repos grid */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : repos.length === 0 ? (
          <div className="text-center py-12 text-terminal-dim font-mono text-sm">
            <span className="text-terminal-muted">{'>'}</span> could not fetch repos at this time
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {repos.map((repo) => (
              <RepoCard key={repo.name} repo={repo} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}

function RepoCard({ repo }: { repo: Repo }) {
  const dotColor = repo.language ? langColors[repo.language] ?? '#71717a' : '#71717a'

  return (
    <motion.div variants={itemVariants}>
      <TiltCard>
        <motion.a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block h-full terminal-window border-terminal-border/60 hover:border-terminal-accent/50 transition-all duration-300 hover-glow"
          whileHover={{ boxShadow: '0 0 20px rgba(34,197,94,0.1)' }}
        >
          <div className="p-4 flex flex-col h-full min-h-[140px]">
            {/* Repo name */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-sm font-medium text-terminal-text group-hover:text-terminal-accent transition-colors leading-tight break-all">
                {repo.name}
              </h3>
              {repo.stars > 0 && (
                <div className="flex items-center gap-1 shrink-0 text-xs text-terminal-dim">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {repo.stars}
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-terminal-dim leading-relaxed flex-1 mb-3 line-clamp-2">
              {repo.description ?? (
                <span className="italic opacity-50">no description</span>
              )}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-terminal-border/50">
              <div className="flex items-center gap-1.5">
                {repo.language && (
                  <>
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: dotColor }}
                    />
                    <span className="text-xs text-terminal-dim">{repo.language}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {repo.account && (
                  <span className="text-2xs text-terminal-muted font-mono">@{repo.account}</span>
                )}
                <span className="text-2xs text-terminal-muted font-mono">
                  {timeAgo(repo.pushed_at)}
                </span>
              </div>
            </div>
          </div>
        </motion.a>
      </TiltCard>
    </motion.div>
  )
}

function SkeletonCard() {
  return (
    <motion.div
      className="terminal-window p-4 min-h-[140px]"
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="h-4 w-3/4 bg-terminal-border rounded mb-3" />
      <div className="h-3 w-full bg-terminal-border/60 rounded mb-2" />
      <div className="h-3 w-2/3 bg-terminal-border/60 rounded mb-4" />
      <div className="h-px bg-terminal-border/50 mb-2" />
      <div className="flex justify-between">
        <div className="h-2.5 w-16 bg-terminal-border/50 rounded" />
        <div className="h-2.5 w-12 bg-terminal-border/40 rounded" />
      </div>
    </motion.div>
  )
}

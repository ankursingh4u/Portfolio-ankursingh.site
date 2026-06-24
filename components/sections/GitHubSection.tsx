'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '@/lib/site-config'

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

function langColor(lang: string | null): string {
  return lang ? langColors[lang] ?? '#94a3b8' : '#cbd5e1'
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 3600) return `${Math.max(1, Math.floor(diff / 60))}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`
  return `${Math.floor(diff / 31536000)}y ago`
}

function monthLabel(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString([], { month: 'short', year: 'numeric' })
}

export function GitHubSection() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/github')
      .then((r) => r.json())
      .then((data: Repo[]) => {
        setRepos(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Group repos by the month they were last pushed (already date-sorted by the API).
  const groups = useMemo(() => {
    const map = new Map<string, Repo[]>()
    for (const r of repos) {
      const key = monthLabel(r.pushed_at)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(r)
    }
    return Array.from(map.entries())
  }, [repos])

  return (
    <section id="github" className="section relative overflow-hidden bg-slate-50/60">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-3 flex items-center gap-3"
        >
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Open source</h2>
          <span className="font-mono text-xs text-slate-400">/ live from GitHub</span>
        </motion.div>
        <p className="mb-8 max-w-xl text-sm text-slate-500">
          A timeline of recent repositories, arranged by date. Each tile is a
          repo — hover to reveal its name, click to open it.
        </p>

        {/* Profile strips */}
        <div className="mb-10 flex flex-wrap gap-3">
          {[
            { handle: 'ankursingh4u', url: siteConfig.social.github, label: 'primary' },
            { handle: 'ankur4work', url: 'https://github.com/ankur4work', label: 'work' },
          ].map((acc) => (
            <a
              key={acc.handle}
              href={acc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-1 min-w-[200px] items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-indigo-300"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </div>
                <div>
                  <div className="font-mono text-xs text-slate-900">{acc.handle}</div>
                  <div className="text-[10px] text-slate-400">{acc.label}</div>
                </div>
              </div>
              <span className="font-mono text-xs text-indigo-600 group-hover:underline">view →</span>
            </a>
          ))}
        </div>

        {/* Calendar of repos */}
        {loading ? (
          <div className="flex flex-wrap gap-2.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="h-16 w-16 animate-pulse rounded-xl bg-slate-200"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        ) : repos.length === 0 ? (
          <div className="py-10 text-center font-mono text-sm text-slate-400">
            could not load repositories right now
          </div>
        ) : (
          <div className="space-y-8">
            {groups.map(([month, monthRepos], gi) => (
              <div key={month} className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                {/* date column */}
                <div className="shrink-0 sm:w-28 sm:pt-1.5">
                  <div className="font-mono text-sm font-semibold text-slate-700">{month}</div>
                  <div className="text-[11px] text-slate-400">
                    {monthRepos.length} {monthRepos.length === 1 ? 'repo' : 'repos'}
                  </div>
                </div>
                {/* boxes */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
                  className="flex flex-1 flex-wrap gap-2.5"
                >
                  {monthRepos.map((repo) => (
                    <RepoBox key={`${repo.account}/${repo.name}`} repo={repo} />
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function RepoBox({ repo }: { repo: Repo }) {
  const color = langColor(repo.language)
  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
      }}
      whileHover={{ scale: 1.12, zIndex: 20 }}
      className="group relative flex h-16 w-16 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-slate-300"
      title={repo.name}
    >
      {/* language swatch */}
      <span
        className="h-7 w-7 rounded-lg ring-1 ring-black/5"
        style={{ background: color }}
      />
      {repo.stars > 0 && (
        <span className="absolute right-1 top-1 text-[9px] font-medium text-amber-500">
          ★{repo.stars}
        </span>
      )}

      {/* hover tooltip with the repo name */}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-max max-w-[220px] -translate-x-1/2 rounded-lg bg-slate-900 px-2.5 py-1.5 text-left shadow-xl group-hover:block">
        <span className="block text-xs font-semibold text-white">{repo.name}</span>
        <span className="block text-[10px] text-slate-300">
          {repo.language ?? 'code'} · {timeAgo(repo.pushed_at)}
        </span>
        {repo.description && (
          <span className="mt-1 block whitespace-normal text-[10px] leading-snug text-slate-400">
            {repo.description}
          </span>
        )}
      </span>
    </motion.a>
  )
}

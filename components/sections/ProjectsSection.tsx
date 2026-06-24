'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

type Badge = 'Live' | 'Shopify App' | 'Client' | 'Learning'

interface Project {
  name: string
  tagline: string
  tech: string[]
  link: string | null
  repo: string | null
  badge: Badge
  /** true → render the real site live in an <iframe>; false → live screenshot */
  embed?: boolean
  /** brand gradient used for the placeholder when there's no live URL */
  gradient?: string
}

interface Category {
  id: string
  label: string
  sub: string
  accent: string
  items: Project[]
}

const CATEGORIES: Category[] = [
  {
    id: 'products',
    label: 'My Products',
    sub: 'SaaS I own and ship end-to-end',
    accent: '#4f46e5',
    items: [
      {
        name: 'SEO4AI',
        tagline: 'Track & grow your brand’s visibility inside AI answers.',
        tech: ['Next.js', 'OpenAI', 'Gemini', 'PostgreSQL'],
        link: 'https://seo4ai.app',
        repo: 'https://github.com/ankursingh4u/seo4ai',
        badge: 'Live',
        embed: true,
      },
      {
        name: 'DemandRadar',
        tagline: 'LLM brand analytics — live on the Shopify App Store.',
        tech: ['Next.js', 'Shopify API', 'LLMs'],
        link: 'https://apps.shopify.com/demandradar',
        repo: null,
        badge: 'Shopify App',
      },
      {
        name: 'Palm Insights',
        tagline: 'Turns raw data into clear, actionable insights.',
        tech: ['Next.js', 'Tailwind', 'Vercel'],
        link: 'https://palm-drab.vercel.app',
        repo: 'https://github.com/ankursingh4u/PalmInsights',
        badge: 'Live',
        embed: true,
      },
    ],
  },
  {
    id: 'clients',
    label: 'Client Work',
    sub: 'Paid projects, live in production',
    accent: '#0891b2',
    items: [
      {
        name: 'Steel Line Logistics',
        tagline: 'Truck booking & fleet management for a cargo company.',
        tech: ['Next.js', 'Node.js', 'PostgreSQL'],
        link: 'https://www.steellinelogistics.in',
        repo: null,
        badge: 'Client',
        embed: true,
      },
      {
        name: "Salty's Seafood",
        tagline: 'Online ordering system for an Australian takeaway.',
        tech: ['Next.js', 'Node.js', 'Stripe'],
        link: 'https://www.saltysseafood.com',
        repo: 'https://github.com/ankursingh4u/seafood',
        badge: 'Client',
        embed: true,
      },
      {
        name: 'DraftInvitations',
        tagline: 'Create & share digital invitations with RSVP links.',
        tech: ['Next.js', 'React', 'Tailwind'],
        link: 'https://draftinvitations.in',
        repo: null,
        badge: 'Client',
        embed: true,
      },
    ],
  },
  {
    id: 'company',
    label: 'Company & Learning',
    sub: 'Shopify apps at CodersHive + things I build while learning',
    accent: '#7c3aed',
    items: [
      {
        name: 'AgroMind',
        tagline: 'AI farming assistant giving crop advice in any language.',
        tech: ['Node.js', 'MongoDB', 'GPT-4o'],
        link: 'http://agromind-app.onrender.com/login.html',
        repo: 'https://github.com/ankursingh4u/agromind-app',
        badge: 'Learning',
      },
      {
        name: 'DocDrawer',
        tagline: 'Secure full-stack file upload & sharing app.',
        tech: ['Node.js', 'Express', 'Supabase'],
        link: 'https://docdrawer.onrender.com',
        repo: 'https://github.com/ankursingh4u/DocDrawer',
        badge: 'Learning',
      },
      {
        name: 'AnnounceFlow',
        tagline: 'Shopify announcement bars with timers & A/B testing.',
        tech: ['Next.js', 'Shopify API', 'Polaris'],
        link: null,
        repo: null,
        badge: 'Shopify App',
        gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      },
      {
        name: 'Countdown Bar',
        tagline: 'Evergreen urgency timers for Shopify stores.',
        tech: ['React', 'Shopify API', 'Node.js'],
        link: null,
        repo: null,
        badge: 'Shopify App',
        gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      },
      {
        name: 'Social Proof',
        tagline: 'Real-time purchase & visitor trust signals.',
        tech: ['Next.js', 'WebSockets', 'PostgreSQL'],
        link: null,
        repo: null,
        badge: 'Shopify App',
        gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
      },
    ],
  },
]

const badgeStyles: Record<Badge, string> = {
  Live: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'Shopify App': 'bg-green-50 text-green-700 ring-green-200',
  Client: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
  Learning: 'bg-amber-50 text-amber-700 ring-amber-200',
}

/** microlink — free, keyless live screenshot of any public URL. */
function shotUrl(url: string): string {
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`
}

/** virtual width the iframe renders at before being scaled down to fit the card */
const FRAME_W = 1280

function PreviewCard({ project }: { project: Project }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.3)

  const isLive = !!project.link && project.embed && !failed
  const isShot = !!project.link && !project.embed && !failed
  const domain = project.link?.replace(/^https?:\/\//, '').replace(/\/.*$/, '')

  // Scale the full-size iframe down to fit the card's preview box.
  useEffect(() => {
    if (!isLive) return
    const el = boxRef.current
    if (!el) return
    const update = () => setScale(el.clientWidth / FRAME_W)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [isLive])

  return (
    <motion.article
      variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      {/* Browser chrome bar */}
      <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-3 py-1.5">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        <span className="h-2 w-2 rounded-full bg-green-400" />
        <span className="ml-1.5 truncate font-mono text-[10px] text-slate-400">
          {domain ?? 'private'}
        </span>
        {isLive && (
          <span className="ml-auto flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-emerald-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            live
          </span>
        )}
      </div>

      {/* Preview box */}
      <div ref={boxRef} className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {isLive ? (
          <a href={project.link as string} target="_blank" rel="noopener noreferrer" className="absolute inset-0 block">
            {!loaded && (
              <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-br from-slate-100 to-slate-200" />
            )}
            {/* Real site rendered live, scaled to fit; pointer-events off so it acts as a thumbnail */}
            <iframe
              src={project.link as string}
              title={`${project.name} live`}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              tabIndex={-1}
              scrolling="no"
              className="absolute left-0 top-0 origin-top-left border-0"
              style={{
                width: FRAME_W,
                height: FRAME_W * (10 / 16),
                transform: `scale(${scale})`,
                pointerEvents: 'none',
              }}
            />
            {/* hover overlay */}
            <div className="absolute inset-0 z-20 flex items-end justify-center bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
              <span className="mb-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-800 shadow">
                Open live ↗
              </span>
            </div>
          </a>
        ) : isShot ? (
          <>
            {!loaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-100 to-slate-200" />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shotUrl(project.link as string)}
              alt={`${project.name} preview`}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              className={`h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04] ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </>
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-0.5"
            style={{ background: project.gradient ?? 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
          >
            <span className="text-lg font-bold text-white/95">{project.name}</span>
            {domain && <span className="font-mono text-[10px] text-white/70">{domain}</span>}
          </div>
        )}
      </div>

      {/* Content — compact */}
      <div className="flex flex-1 flex-col p-3.5">
        <div className="mb-1 flex items-center justify-between gap-2">
          <h3 className="truncate text-[15px] font-bold text-slate-900">{project.name}</h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${badgeStyles[project.badge]}`}
          >
            {project.badge}
          </span>
        </div>

        <p className="mb-3 line-clamp-2 text-[13px] leading-snug text-slate-600">
          {project.tagline}
        </p>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-2.5">
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-indigo-600 transition-colors hover:text-indigo-800"
            >
              Visit ↗
            </a>
          ) : (
            <span className="text-[11px] text-slate-400">Company codebase</span>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-medium text-slate-500 transition-colors hover:text-slate-900"
            >
              Code
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export function ProjectsSection() {
  return (
    <section id="work" className="section relative overflow-hidden bg-slate-50/60">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 max-w-2xl"
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Things I&apos;ve built
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Products I own, paid client work, and what I ship at my company —
            Next.js apps, Shopify integrations, and AI products, each with a live
            preview.
          </p>
        </motion.div>

        {/* Categories */}
        <div className="space-y-12">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} id={cat.id} className="scroll-mt-24">
              <div className="mb-5 flex items-center gap-2.5">
                <span className="h-5 w-1.5 rounded-full" style={{ background: cat.accent }} />
                <h3 className="text-lg font-bold text-slate-900">{cat.label}</h3>
                <span className="hidden text-sm text-slate-400 sm:inline">— {cat.sub}</span>
              </div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {cat.items.map((p) => (
                  <PreviewCard key={p.name} project={p} />
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

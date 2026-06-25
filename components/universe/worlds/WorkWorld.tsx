'use client'

import { useEffect, useState } from 'react'
import { personalProjects, companyProjects, coolestProjects } from '@/lib/site-config'
import type { PlanetNav } from '@/lib/universe-nav'
import { PlanetWorld, GlassCard } from '../PlanetWorld'

interface Repo {
  name: string
  description: string | null
  html_url: string
  language: string | null
  stargazers_count: number
}

// ── My own SaaS products (featured, with live preview) ──────────────────────
const saasProducts = [
  {
    id: 'seo4ai',
    name: 'SEO4AI',
    tagline: 'Track & grow your brand inside AI answers',
    desc: 'Measures whether ChatGPT, Gemini, Perplexity & Claude recommend you — and how to grow your AI share-of-voice.',
    url: 'https://seo4ai.app',
    tech: ['Next.js', 'TypeScript', 'OpenAI', 'Gemini', 'PostgreSQL'],
    accent: '#5b8def',
  },
  {
    id: 'demandradar',
    name: 'DemandRadar',
    tagline: 'Turn missed searches into your next products',
    desc: 'A Shopify app that catches what shoppers search for but the store doesn’t sell — surfacing that hidden demand so merchants know exactly which products to add next and stop losing sales to zero-result searches.',
    url: 'https://apps.shopify.com/demandradar',
    tech: ['Next.js', 'TypeScript', 'Shopify API', 'PostgreSQL', 'Polaris'],
    accent: '#a855f7',
  },
  {
    id: 'palm',
    name: 'Palm Insights',
    tagline: 'Turns raw data into clear insights',
    desc: 'A clean analytics layer that turns messy raw data into decisions you can actually act on.',
    url: 'https://palm-drab.vercel.app',
    tech: ['Next.js', 'TypeScript', 'Vercel'],
    accent: '#34d399',
  },
]

// ── Paid client work, live in production ─────────────────────────────────────
const clientWork = [
  {
    id: 'saltys',
    name: "Salty's Seafood",
    sub: 'Seafood takeaway · Australia',
    desc: 'Full online ordering system — browse the menu, place orders, owner dashboard to manage them. Replaced a paper + call-only flow.',
    url: 'https://www.saltysseafood.com/',
    video: '/saltys-seafood.mp4',
    meta: 'delivered in 2 weeks',
    accent: '#f59e0b',
  },
  {
    id: 'steelline',
    name: 'Steel Line Logistics',
    sub: 'Truck cargo shipping · India',
    desc: 'Client truck-booking + an admin panel to manage bookings, drivers and trips from a single dashboard.',
    url: 'https://www.steellinelogistics.in/',
    video: '/steelline-logistics.mp4',
    meta: 'delivered in 3 weeks',
    accent: '#22d3ee',
  },
  {
    id: 'draftinvitations',
    name: 'DraftInvitations',
    sub: 'Digital invitations · India',
    desc: 'Create and share beautiful digital invitations in minutes — wedding, birthday & event cards with RSVP-ready links.',
    url: 'https://draftinvitations.in',
    video: null as string | null,
    meta: 'live product',
    accent: '#ec4899',
  },
]

/** A Vercel-style live preview: local video if we have it, else a live screenshot. */
function LivePreview({
  url,
  video,
  name,
}: {
  url: string
  video?: string | null
  name: string
}) {
  const [srcIdx, setSrcIdx] = useState(0)
  const [tries, setTries] = useState(0)
  const [ready, setReady] = useState(false)
  const [err, setErr] = useState(false)
  const domain = url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
  const enc = encodeURIComponent(url)

  // Free, no-key live-screenshot providers, tried in order. mShots serves a
  // small "generating…" placeholder on the first hit, so we re-fetch a few
  // times until the real (full-width) screenshot is ready; if a provider fails
  // we fall through to the next, then to a clean domain card.
  const providers = [
    (n: number) => `https://s.wordpress.com/mshots/v1/${enc}?w=1000&h=750${n ? `&n=${n}` : ''}`,
    () => `https://api.microlink.io/?url=${enc}&screenshot=true&embed=screenshot.url&meta=false`,
  ]
  const shot = providers[srcIdx](tries)

  useEffect(() => {
    if (video || ready || err || srcIdx !== 0 || tries >= 4) return
    const id = setTimeout(() => setTries((t) => t + 1), 3000)
    return () => clearTimeout(id)
  }, [video, ready, err, srcIdx, tries])

  const handleError = () => {
    if (srcIdx < providers.length - 1) {
      setSrcIdx((i) => i + 1)
      setTries(0)
      setReady(false)
    } else {
      setErr(true)
    }
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-video overflow-hidden bg-[#0a0f1f]"
    >
      {/* loading shimmer until a real shot lands */}
      {!video && !ready && !err && (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-white/[0.06] to-transparent">
          <span className="animate-pulse font-mono text-xs text-white/40">loading preview…</span>
        </div>
      )}

      {video ? (
        <video
          src={video}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : !err ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={shot}
          alt={`Live preview of ${name}`}
          loading="lazy"
          onLoad={(e) => {
            // mShots' placeholder is small; a real screenshot is ~1000px wide.
            if (srcIdx > 0 || e.currentTarget.naturalWidth >= 700) setReady(true)
          }}
          onError={handleError}
          className={`h-full w-full object-cover object-top transition-all duration-500 group-hover:scale-[1.04] ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-white/[0.06] to-transparent">
          <span className="font-mono text-sm text-white/60">{domain}</span>
        </div>
      )}

      {/* browser-chrome dots + domain (Vercel-card feel) */}
      <div className="absolute inset-x-0 top-0 flex items-center gap-1.5 bg-gradient-to-b from-black/70 to-transparent px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400/70" />
        <span className="h-2 w-2 rounded-full bg-amber-400/70" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
        <span className="ml-2 truncate font-mono text-[10px] text-white/70">{domain}</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-end bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8">
        <span className="rounded-full bg-white/15 px-2.5 py-1 font-mono text-[10px] text-white backdrop-blur">
          open live ↗
        </span>
      </div>
    </a>
  )
}

export function WorkWorld({ nav }: { nav: PlanetNav }) {
  const [repos, setRepos] = useState<Repo[]>([])

  useEffect(() => {
    let cancelled = false
    fetch('/api/github')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return
        const list: Repo[] = Array.isArray(data) ? data : data.repos ?? []
        setRepos(list.slice(0, 6))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <PlanetWorld
      nav={nav}
      eyebrow="Jupiter · work"
      title="Things I’ve shipped"
      intro="My own SaaS products first, then real paid client systems — every one live in production. The proof, not the pitch."
    >
      {/* ── My SaaS products ── */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-white">My SaaS products</h2>
        <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-slate-400">
          owned & shipped
        </span>
      </div>
      <div className="mt-4 grid gap-6 md:grid-cols-3">
        {saasProducts.map((p) => (
          <div
            key={p.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition-colors hover:border-white/25"
            style={{ boxShadow: `inset 0 1px 0 0 ${p.accent}22` }}
          >
            <LivePreview url={p.url} name={p.name} />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] uppercase text-emerald-300">
                  live
                </span>
              </div>
              <p className="mt-0.5 text-sm font-medium" style={{ color: p.accent }}>
                {p.tagline}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{p.desc}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tech.map((t) => (
                  <span key={t} className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Client work ── */}
      <h2 className="mt-12 text-xl font-bold text-white">Paid client systems</h2>
      <p className="mt-1 text-sm text-slate-400">Real businesses, live in production.</p>
      <div className="mt-4 grid gap-6 md:grid-cols-3">
        {clientWork.map((c) => (
          <div
            key={c.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition-colors hover:border-white/25"
          >
            <LivePreview url={c.url} video={c.video} name={c.name} />
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-lg font-bold text-white">{c.name}</h3>
              <p className="mt-0.5 font-mono text-[11px] text-slate-500">{c.sub}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{c.desc}</p>
              <p className="mt-4 font-mono text-[11px] text-slate-500">⚡ {c.meta}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── More builds ── */}
      <h2 className="mt-12 text-xl font-bold text-white">More builds</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...coolestProjects.filter((p) => p.id === 'agromind' || p.id === 'smart-search'),
          ...personalProjects.filter((p) => p.id === 'farmer-assistant' || p.id === 'drive-clone'),
          ...companyProjects].map((p) => (
          <GlassCard key={p.id}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">{p.name}</h3>
              <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[9px] uppercase text-slate-400">
                {('status' in p ? p.status : '').toString().replace('-', ' ')}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-3">
              {'tagline' in p ? p.tagline : 'description' in p ? p.description : ''}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {('tech' in p ? p.tech : []).slice(0, 4).map((t) => (
                <span key={t} className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                  {t}
                </span>
              ))}
            </div>
            {'link' in p && p.link && (
              <a
                href={p.link as string}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block font-mono text-[11px] text-white/70 underline-offset-2 hover:underline"
              >
                open ↗
              </a>
            )}
          </GlassCard>
        ))}
      </div>

      {/* ── Live GitHub ── */}
      {repos.length > 0 && (
        <>
          <h2 className="mt-12 text-xl font-bold text-white">Live from GitHub</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {repos.map((r) => (
              <a
                key={r.name}
                href={r.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-white/25"
              >
                <div className="flex items-center justify-between">
                  <h3 className="truncate font-mono text-sm font-bold text-white">{r.name}</h3>
                  {r.stargazers_count > 0 && (
                    <span className="font-mono text-[11px] text-amber-300">★ {r.stargazers_count}</span>
                  )}
                </div>
                {r.description && (
                  <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-2">{r.description}</p>
                )}
                {r.language && <p className="mt-3 font-mono text-[11px] text-slate-500">{r.language}</p>}
              </a>
            ))}
          </div>
        </>
      )}
    </PlanetWorld>
  )
}

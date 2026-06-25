import { siteConfig } from '@/lib/site-config'

/**
 * The "Solar System OS" navigation model.
 *
 * Each real planet (keyed by the `name` in lib/ephemeris.ts) is a destination.
 * Rule of the universe:
 *   • Big, slow, outer planets = the substance → full "worlds" you fly into.
 *   • Small, fast, inner planets = quick external links (social), ordered by
 *     usefulness (LinkedIn on the fastest planet, Instagram on the least).
 */
export type DestId = 'work' | 'about' | 'pricing' | 'contact'

export interface PlanetNav {
  /** Must match the `name` in lib/ephemeris.ts PLANETS. */
  name: string
  /** Human-facing label shown on hover / in the tour. */
  label: string
  kind: 'world' | 'link'
  /** Set when kind === 'world'. */
  destId?: DestId
  /** Full URL when kind === 'link'. */
  target?: string
  /** Accent colour (matches the planet) used across the world UI. */
  accent: string
  /** Short, punchy tour caption. */
  blurb: string
  /** Tiny tagline shown on the hover label. */
  tag: string
}

export const PLANET_NAV: Record<string, PlanetNav> = {
  // ── Big, slow, outer planets → the real worlds ──────────────────────────
  Jupiter: {
    name: 'Jupiter',
    label: 'Work',
    kind: 'world',
    destId: 'work',
    accent: '#d8a772',
    tag: 'the things I’ve shipped',
    blurb:
      'The largest world — flagship products, paid client systems, and live open-source. The proof.',
  },
  Saturn: {
    name: 'Saturn',
    label: 'About',
    kind: 'world',
    destId: 'about',
    accent: '#e3d2a0',
    tag: 'who I am · the stack',
    blurb:
      'The ringed one. The story, the way I think, and the stack I build my universe with.',
  },
  Uranus: {
    name: 'Uranus',
    label: 'Pricing',
    kind: 'world',
    destId: 'pricing',
    accent: '#a8e0e6',
    tag: 'transparent & fair',
    blurb: 'Clear engagement tiers — from a one-page launch to a full-stack platform.',
  },
  Neptune: {
    name: 'Neptune',
    label: 'Contact',
    kind: 'world',
    destId: 'contact',
    accent: '#6f8ff0',
    tag: 'let’s build something',
    blurb: 'The farthest world, and the most important — this is where we start working together.',
  },

  // ── Small inner planets → social links, least useful closest to the Sun ──
  Mercury: {
    name: 'Mercury',
    label: 'Instagram ↗',
    kind: 'link',
    target: siteConfig.social.instagram,
    accent: '#b8b2a8',
    tag: 'life beyond code',
    blurb: 'Closest to the sun, least essential — life beyond the keyboard.',
  },
  Venus: {
    name: 'Venus',
    label: 'LinkedIn ↗',
    kind: 'link',
    target: siteConfig.social.linkedin,
    accent: '#e8cda2',
    tag: 'connect with me',
    blurb: 'Connect with me professionally.',
  },
  Earth: {
    name: 'Earth',
    label: 'X ↗',
    kind: 'link',
    target: siteConfig.social.X,
    accent: '#5b8def',
    tag: 'thoughts & build logs',
    blurb: 'Home base for thoughts, build logs and the occasional hot take.',
  },
  Mars: {
    name: 'Mars',
    label: 'GitHub ↗',
    kind: 'link',
    target: siteConfig.social.github,
    accent: '#d96f43',
    tag: 'the code',
    blurb: 'The code lives here — @ankursingh4u.',
  },
}

/** Tour visits the system sun-outward, the way the eye already follows the orbits. */
export const TOUR_ORDER = [
  'Mercury',
  'Venus',
  'Earth',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
] as const

/** Quick lookups. */
export const WORLDS = Object.values(PLANET_NAV).filter((n) => n.kind === 'world')
export const navByDest = (id: DestId) => WORLDS.find((w) => w.destId === id)

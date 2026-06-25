import { siteConfig } from '@/lib/site-config'

/**
 * Maps each real planet (from lib/ephemeris.ts, keyed by name) to a destination
 * on the site. Six inner targets are in-page sections; the two outermost planets
 * point at external profiles. Used by both the interactive SolarSystem and the
 * cinematic SolarTour so the two never drift out of sync.
 */
export interface PlanetNav {
  /** Must match the `name` in lib/ephemeris.ts PLANETS. */
  name: string
  /** Human-facing destination label shown on hover / in the tour. */
  label: string
  kind: 'section' | 'link'
  /** '#about' for sections, full URL for links. */
  target: string
  /** One-line description for the tour spotlight card. */
  desc: string
}

export const PLANET_NAV: Record<string, PlanetNav> = {
  Mercury: {
    name: 'Mercury',
    label: 'About',
    kind: 'section',
    target: '#about',
    desc: 'Engineer, observer, systems thinker — where the story starts.',
  },
  Venus: {
    name: 'Venus',
    label: 'Work',
    kind: 'section',
    target: '#work',
    desc: 'Products I own plus real, paid client builds shipped to production.',
  },
  Earth: {
    name: 'Earth',
    label: 'Stack',
    kind: 'section',
    target: '#stack',
    desc: 'TypeScript · Next.js · Node · PostgreSQL — the home base.',
  },
  Mars: {
    name: 'Mars',
    label: 'GitHub',
    kind: 'section',
    target: '#github',
    desc: 'Open-source repositories and live build activity.',
  },
  Jupiter: {
    name: 'Jupiter',
    label: 'Pricing',
    kind: 'section',
    target: '#pricing',
    desc: 'Transparent engagement tiers — from Starter to fully Custom.',
  },
  Saturn: {
    name: 'Saturn',
    label: 'Contact',
    kind: 'section',
    target: '#contact',
    desc: "Let's build something real together.",
  },
  Uranus: {
    name: 'Uranus',
    label: 'GitHub ↗',
    kind: 'link',
    target: siteConfig.social.github,
    desc: 'My primary GitHub — @ankursingh4u.',
  },
  Neptune: {
    name: 'Neptune',
    label: 'LinkedIn ↗',
    kind: 'link',
    target: siteConfig.social.linkedin,
    desc: 'Connect with me on LinkedIn.',
  },
}

/** Tour visits planets sun-outward, mirroring the orbits the eye already follows. */
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

/** Smooth-scroll to a section or open an external link in a new tab. */
export function navigateTo(nav: PlanetNav): void {
  if (typeof window === 'undefined') return
  if (nav.kind === 'link') {
    window.open(nav.target, '_blank', 'noopener,noreferrer')
    return
  }
  const el = document.querySelector(nav.target)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  else window.location.hash = nav.target
}

/**
 * Low-precision planetary ephemeris.
 *
 * Uses the Keplerian orbital elements published by NASA/JPL (E. M. Standish,
 * "Keplerian Elements for Approximate Positions of the Major Planets"),
 * valid for 1800 AD – 2050 AD. For each planet we compute the heliocentric
 * ecliptic longitude and Sun-distance for any given Date — the real angular
 * position of the planet around the Sun.
 *
 * We only need a top-down (2D ecliptic-plane) view, so inclination and the
 * ascending node are intentionally ignored — the longitude in the orbital
 * plane is what places a planet at its true angle for a date.
 */

export interface PlanetElements {
  name: string
  color: string
  /** relative display size (Earth = 1) — log-compressed, not to scale */
  size: number
  /** [a (AU), e, I (deg), L (deg), longPeri (deg), longNode (deg)] at J2000 */
  el: [number, number, number, number, number, number]
  /** per-century rates for the six elements above */
  rate: [number, number, number, number, number, number]
}

// a, e, I, L, longPeri (ϖ), longNode (Ω)
export const PLANETS: PlanetElements[] = [
  {
    name: 'Mercury',
    color: '#b8b2a8',
    size: 0.5,
    el: [0.38709927, 0.20563593, 7.00497902, 252.2503235, 77.45779628, 48.33076593],
    rate: [0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081],
  },
  {
    name: 'Venus',
    color: '#e8cda2',
    size: 0.9,
    el: [0.72333566, 0.00677672, 3.39467605, 181.9790995, 131.60246718, 76.67984255],
    rate: [0.0000039, -0.00004107, -0.0007889, 58517.81538729, 0.00268329, -0.27769418],
  },
  {
    name: 'Earth',
    color: '#5b8def',
    size: 1,
    el: [1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0.0],
    rate: [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0.0],
  },
  {
    name: 'Mars',
    color: '#d96f43',
    size: 0.7,
    el: [1.52371034, 0.0933941, 1.84969142, -4.55343205, -23.94362959, 49.55953891],
    rate: [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343],
  },
  {
    name: 'Jupiter',
    color: '#d8a772',
    size: 2.6,
    el: [5.202887, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909],
    rate: [-0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106],
  },
  {
    name: 'Saturn',
    color: '#e3d2a0',
    size: 2.2,
    el: [9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448],
    rate: [-0.0012506, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794],
  },
  {
    name: 'Uranus',
    color: '#a8e0e6',
    size: 1.6,
    el: [19.18916464, 0.04725744, 0.77263783, 313.23810451, 170.9542763, 74.01692503],
    rate: [-0.00196176, -0.00004397, -0.00242939, 428.48202785, 0.40805281, 0.04240589],
  },
  {
    name: 'Neptune',
    color: '#6f8ff0',
    size: 1.5,
    el: [30.06992276, 0.00859048, 1.77004347, -55.12002969, 44.96476227, 131.78422574],
    rate: [0.00026291, 0.00005105, 0.00035372, 218.45945325, -0.32241464, -0.00508664],
  },
]

const DEG = Math.PI / 180

/** Julian Date from a JS Date (UTC milliseconds). */
function julianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5
}

function normalizeDeg(d: number): number {
  let x = d % 360
  if (x > 180) x -= 360
  if (x < -180) x += 360
  return x
}

export interface PlanetPosition {
  /** heliocentric ecliptic longitude in radians (0 = +x axis) */
  longitude: number
  /** distance from Sun in AU */
  r: number
  /** semi-major axis in AU */
  a: number
}

/** Compute the heliocentric position of one planet at a given date. */
export function positionFor(p: PlanetElements, date: Date): PlanetPosition {
  const T = (julianDate(date) - 2451545.0) / 36525 // Julian centuries since J2000

  const a = p.el[0] + p.rate[0] * T
  const e = p.el[1] + p.rate[1] * T
  const L = p.el[3] + p.rate[3] * T
  const peri = p.el[4] + p.rate[4] * T

  // Mean anomaly
  const M = normalizeDeg(L - peri) * DEG

  // Solve Kepler's equation  M = E - e*sin(E)  (Newton iteration)
  let E = M + e * Math.sin(M)
  for (let i = 0; i < 6; i++) {
    const dE = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E))
    E -= dE
    if (Math.abs(dE) < 1e-7) break
  }

  // Position in the orbital (perifocal) plane
  const xv = a * (Math.cos(E) - e)
  const yv = a * Math.sqrt(1 - e * e) * Math.sin(E)

  const trueAnomaly = Math.atan2(yv, xv)
  const r = Math.sqrt(xv * xv + yv * yv)

  // Ecliptic longitude = longitude of perihelion + true anomaly
  const longitude = peri * DEG + trueAnomaly

  return { longitude, r, a }
}

/** Positions of every planet for a date. */
export function allPositions(date: Date): PlanetPosition[] {
  return PLANETS.map((p) => positionFor(p, date))
}

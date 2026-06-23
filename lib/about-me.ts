/**
 * me.json — a structured self-portrait.
 * The honest, distilled version of who I am and how I operate.
 * (Private/emotional layers intentionally left out of the public site.)
 */
export const aboutMe = {
  // One-line answer to "who are you?"
  identity:
    'An independent, system-oriented builder who prefers understanding and creating over following — still refining direction, but already operating differently from the majority.',

  // The loop I run on everything
  corePattern: ['Observe', 'Question', 'Detach', 'Build my own version'],

  principles: [
    'I learn by building, not by consuming.',
    'I question “why” before “how”.',
    'I don’t follow trends, frameworks, or systems blindly.',
    'I’m not trying to fit into tech — I’m shaping my own space in it.',
  ],

  // How my thinking is wired
  thinking: [
    { label: 'Analytical', note: 'systems, backend, architecture', color: '#4f46e5' },
    { label: 'Philosophical', note: 'humans, behavior, meaning', color: '#8b5cf6' },
    { label: 'Independent', note: 'low influence from trends', color: '#0891b2' },
  ],

  strengths: [
    { icon: '🧠', label: 'Systems thinking' },
    { icon: '🛠️', label: 'Builder mindset — I ship real things' },
    { icon: '🔍', label: 'Deep self-awareness' },
    { icon: '🧭', label: 'Low herd mentality' },
  ],

  // Honest growth edges (the weak points, reframed as work-in-progress)
  growthEdges: [
    'Turning deep analysis into faster execution',
    'Going deep without losing momentum',
    'Holding long-term focus across many ideas',
  ],

  // What I'm actually after (not fame or validation)
  ambition: ['Control', 'Capability', 'Independence'],
  ambitionLine:
    'Build systems and products, and earn through my own creations — not traditional structures.',

  // Where I am right now
  phase: ['Learner', 'Builder', 'Product Thinker'],
  phaseCurrentIndex: 1, // mid-transition: Builder → Product Thinker
} as const

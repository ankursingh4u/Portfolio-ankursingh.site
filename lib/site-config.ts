export const siteConfig = {
  name: 'Ankur Singh',
  username: 'ankur_singh',
title: 'A Generalist Software Engineer',
  description: 'Building production-ready systems with clarity and ownership.',
  email: 'ankursing4work@gmail.com',
  location: 'India',
  status: 'available for opportunities',

  social: {
    github: 'https://github.com/ankursingh4u',
    linkedin: 'https://www.linkedin.com/in/ankursingh4u',
    X: 'https://x.com/ankursingh4u',
  },

  meta: {
    url: 'https://ankursingh.dev',
    image: '/og-image.png',
    keywords: ['Generalist Software Engineer', 'Full-Stack Engineer', 'Next.js', 'TypeScript', 'React', 'Node.js'],
  },
}

export const companyConfig = {
  name: 'Sabai Innovations / CodersHive',
  role: 'Full-Stack Software Engineer',
  focus: 'Shopify App Development',
  status: 'active',
  description: 'Building production-grade Shopify applications that help merchants grow their businesses.',
}

// Current work - what I'm actively working on
export const currentWork = {
  id: 'production-saas',
  name: 'Enterprise SaaS',
  company: 'Sabai Innovations / CodersHive',
  description: 'Contributing to live production product with feature development, OAuth authentication, and scalable system implementations.',
  tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'OAuth', 'Tailwind'],
  status: 'active',
  year: 'Jan 2026 - present',
}

// Company projects - Shopify apps built at Sabai Innovations
export const companyProjects = [
  {
    id: 'announceflow',
    name: 'AnnounceFlow',
    description: 'Dynamic announcement bars for Shopify stores with countdown timers, A/B testing, and analytics.',
    tech: ['Next.js', 'TypeScript', 'Shopify API', 'PostgreSQL'],
    status: 'completed',
    year: '2026',
    color: 'blue',
  },
  {
    id: 'countdown-bar',
    name: 'Countdown Bar',
    description: 'Create urgency with evergreen countdown timers, custom styling, and multi-language support.',
    tech: ['React', 'TypeScript', 'Shopify API', 'Node.js'],
    status: 'completed',
    year: '2026',
    color: 'amber',
  },
  {
    id: 'social-proof',
    name: 'Social Proof',
    description: 'Build trust with real-time purchase notifications, review integration, and visitor counters.',
    tech: ['Next.js', 'TypeScript', 'WebSockets', 'PostgreSQL'],
    status: 'completed',
    year: '2026',
    color: 'red',
  },
]

// Personal projects - self-initiated work
export const personalProjects = [
  {
    id: 'farmer-assistant',
    name: 'AgroMind',
    description: 'It integrates real-time environmental data, market insights, and crop health monitoring to provide contextual, multi-modal agricultural advice in the farmer\'s own language.',
    tech: ['HTML5', 'CSS', 'Node.js', 'OpenAI API', 'MongoDB', 'Express'],
    status: 'completed',
    year: '2025',
    link: 'http://agromind-app.onrender.com/login.html',
    github: 'https://github.com/ankursingh4u/agromind-app',
  },
  {
    id: 'drive-clone',
    name: 'DocDrawer',
    description: 'A secure, full-stack file upload and download web application built using Node.js, Express, MongoDB, Supabase Storage, and EJS with TailwindCSS.',
    tech: ['Node.js', 'Express', 'MongoDB', 'Supabase', 'TailwindCSS'],
    status: 'completed',
    year: '2025',
    link: 'https://docdrawer.onrender.com',
    github: 'https://github.com/ankursingh4u/DocDrawer',
  },
  {
    id: 'web3-exploration',
    name: 'Web3 Research',
    description: 'Deep exploration across 200+ decentralized projects, developing systems thinking and understanding of blockchain ecosystems.',
    tech: ['NFTs', 'Ethereum', 'DeFi', 'Research'],
    status: 'completed',
    year: '2018-2023',
    link: null,
    github: null,
  },
]

// Legacy export for backwards compatibility
export const projects = [...companyProjects, ...personalProjects]

// Signature / flagship projects — the 3 coolest things built
export const coolestProjects = [
  {
    id: 'agromind',
    number: '01',
    name: 'AgroMind',
    tagline: 'AI Farming Assistant for Bharat',
    problem:
      'Millions of Indian farmers make critical crop decisions with zero access to expert guidance — wrong pesticide, wrong time, wrong crop. Language barriers and geographic isolation make professional advice impossible.',
    solution:
      'Multi-modal AI platform that combines real-time weather, soil, and market data to deliver personalized agricultural advice in the farmer\'s own language — via text, voice, or photo.',
    features: [
      'Voice + photo + text input (multi-modal)',
      'Crop disease detection from photos using GPT-4o vision',
      'Live weather, soil pH, and market price integration',
      'Supports Hindi, English, Bengali, Tamil and more',
      'Farm field mapping with boundary drawing tools',
      '5-day forecast with crop-specific recommendations',
    ],
    tech: ['Node.js', 'Express', 'MongoDB', 'OpenAI GPT-4o', 'OpenWeatherMap', 'Leaflet.js', 'HTML5', 'CSS'],
    status: 'live' as const,
    year: '2025',
    color: 'emerald' as const,
    link: 'http://agromind-app.onrender.com/login.html',
    github: 'https://github.com/ankursingh4u/agromind-app',
    stats: [
      { label: 'Languages supported', value: '5+' },
      { label: 'Data APIs integrated', value: '4' },
      { label: 'Input modes', value: '3' },
    ],
  },
  {
    id: 'smart-search',
    number: '02',
    name: 'Smart Search Suggest',
    tagline: 'Never Lose a Sale to a Bad Search Again',
    problem:
      'Shopify merchants lose revenue daily because customers search "tee shirt" when they sell "cotton t-shirt", or search for a product the store doesn\'t stock yet. Zero visibility = zero sales.',
    solution:
      'A Shopify app that intercepts failed searches and zero-result queries, suggests similar products to customers, and alerts merchants to add missing inventory — automatically tagging products with common search terms.',
    features: [
      'Detects zero-result searches in real time',
      'Fuzzy match engine — "tee shirt" finds "cotton t-shirt"',
      'Merchant dashboard showing missed revenue opportunities',
      'Auto-suggests adding missing products with one click',
      'Auto-tags products with alternate search terms',
      'Analytics: top missed searches, conversion lift tracking',
    ],
    tech: ['Next.js', 'TypeScript', 'Shopify API', 'PostgreSQL', 'Shopify Polaris', 'Node.js'],
    status: 'completed' as const,
    year: '2026',
    color: 'blue' as const,
    link: null,
    github: null,
    stats: [
      { label: 'Search gap detection', value: 'Real-time' },
      { label: 'Product tagging', value: 'Auto' },
      { label: 'Built for', value: 'Shopify' },
    ],
  },
  {
    id: 'llm-analytics',
    number: '03',
    name: 'LLM Brand Analytics',
    tagline: 'Google Analytics — But for AI Conversations',
    problem:
      'ChatGPT, Gemini, and Claude are the new Google. Millions ask AI "best project management tool" or "top running shoes". Brands have zero visibility into whether AI is recommending them — or their competitors.',
    solution:
      'A platform that tracks brand visibility across major LLM responses — showing how often ChatGPT, Gemini, Perplexity, and Claude recommend you, what context triggers mentions, and how to increase your AI share-of-voice.',
    features: [
      'Tracks brand mentions across GPT-4, Gemini, Claude, Perplexity',
      'Shows what prompts trigger your brand vs competitors',
      'Competitive share-of-voice benchmarking',
      'AI-readiness score with actionable improvement suggestions',
      'Weekly automated brand mention reports',
      'Trend analysis: is your LLM visibility growing or shrinking?',
    ],
    tech: ['Next.js', 'TypeScript', 'OpenAI API', 'Gemini API', 'PostgreSQL', 'Vercel', 'Recharts'],
    status: 'launching-soon' as const,
    year: '2026',
    color: 'purple' as const,
    link: null,
    github: null,
    stats: [
      { label: 'LLMs tracked', value: '4+' },
      { label: 'MVP status', value: 'Ready' },
      { label: 'Launch', value: 'May 2026' },
    ],
  },
]

export const aboutContent = {
  intro: `Full-Stack Software Engineer with proven experience delivering production-grade web applications. Currently working as a Full-Stack Engineer at Sabai Innovations / CodersHive, owning the complete engineering lifecycle — from gathering requirements and designing architecture to writing code, deploying to production, and maintaining live systems used by real merchants every day.`,

  journey: `My journey began with deep involvement across 200+ Web3 projects, where I developed strong systems thinking, experimentation discipline, and understanding of decentralized ecosystems. I intentionally transitioned toward building practical, impact-driven digital products focused on usability, clarity, and long-term maintainability.`,

  approach: `I have independently built full-stack applications from scratch, including an AI-powered Farmer Assistant platform. I enjoy working on conceptual and boundary-pushing ideas, but I consistently prioritize clean architecture, readable code, and reliable engineering decisions.`,

  current: `Currently strengthening problem-solving fundamentals through Data Structures and Algorithms, with a focus on logical clarity and first-principles thinking. Looking ahead, I plan to expand into React Native for cross-platform development and DevOps fundamentals.`,

  beyond: `Outside of development, I enjoy reading, traveling, calisthenics, and watching films—which help me maintain discipline, perspective, and creative balance.`,
}

export const techStack = {
  languages: ['TypeScript', 'JavaScript', 'Python'],
  frontend: ['React', 'Next.js', 'Tailwind CSS','HTML5'],
  backend: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Supabase'],
  tools: ['Git', 'VS Code', 'Vercel', 'AWS', 'Docker'],
  learning: ['React Native', 'DevOps', 'System Design', 'DSA'],
}

export const commands = {
  help: 'List available commands',
  about: 'Display engineer profile',
  work: 'Show project portfolio',
  stack: 'List technical capabilities',
  contact: 'Get in touch',
  clear: 'Clear terminal',
}

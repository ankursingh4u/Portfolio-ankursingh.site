'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { siteConfig } from '@/lib/site-config'

interface Msg {
  from: 'me' | 'user'
  text: string
}

const EMAIL = siteConfig.email
const NAME = 'Astro-Ankur'

const GREETING =
  "Hey, I'm Astro-Ankur 🧑‍🚀 — a mini version of Ankur, floating around his cosmos. Ask about my work and products, or tell me what you want to build and I'll scope it, estimate the cost, and even draft a quick PRD."

const NUDGES = [
  '👋 Psst — need a tour guide?',
  'Lost in space? Ask me anything!',
  'Want to know what Ankur builds? 🚀',
]

const SUGGESTIONS = ['Estimate my project', 'Help me write a PRD', 'What do you build?', 'How to hire you']

/** Lightweight, keyless persona engine — answers from real portfolio data. */
function getReply(input: string): string {
  const t = input.toLowerCase().trim()
  const has = (...w: string[]) => w.some((x) => t.includes(x))

  if (/^(hi+|hey+|hello+|yo|sup|namaste|hola|good (morning|afternoon|evening))\b/.test(t))
    return "Hey there! 😄 Great to meet you. Want to hear about my products, my client work, or my stack?"

  if (
    has('girlfriend', 'boyfriend', 'girl friend', 'boy friend', ' gf', ' bf', 'wife', 'husband',
      'married', 'marriage', 'relationship', 'dating', 'are you single', 'love life', 'your crush',
      'family', 'your parents', 'mother', 'father', ' mom', ' dad', 'sibling', 'religion', 'caste',
      'your salary', 'how much do you earn', 'how much do you make', 'net worth', 'networth',
      'your age', 'how old are you', 'where do you live', 'your address', 'phone number', 'your number')
  ) {
    const lines = [
      "Haha, that's my private side — let's keep it to the work 😄 Ask me about what I build!",
      "Nice try 😏 — I keep the personal stuff offline. But I'll happily nerd out about my projects.",
      "That's a vault I don't open here 😅 — but ask me anything about my SaaS or client work!",
      "I'll leave the personal stuff out of this — what would you like to know about my work?",
    ]
    return lines[Math.floor(Math.random() * lines.length)]
  }

  if (has('who are you', 'about you', 'about your', 'yourself', 'who is ankur', 'tell me about'))
    return "I'm Ankur — a generalist full-stack software engineer. I take products from idea to production: architecture, code, deploy, and maintain. By nature I'm also an observer of society, power, and human behavior. Learning, building, exploring — always."

  const askingWhatIBuild = has('what do you build', 'what you build', 'what can you build', 'what do you do', 'what kind of', 'what type of', 'what sort of')

  const wantsBuild =
    !askingWhatIBuild &&
    (/\b(build|building|make|making|create|creating|develop|developing|design|designing|need|want|launch|set ?up)\b[^.?!]*\b(website|web ?app|web ?site|webpage|web page|app|application|platform|landing|dashboard|project|startup|mvp|system|portal|store|shop|e-?commerce|tool|software|saas|page|product|blog|site|api|bot)\b/.test(t) ||
      has('i want to build', 'want to build', 'help me build', 'build me', 'build my', 'need you to build', 'wanna build', 'make me a', 'make me an', 'help me make', 'can you build', 'can you make'))

  if (askingWhatIBuild)
    return "Three kinds of work:\n1) My own SaaS — SEO4AI, DemandRadar, Palm\n2) Client systems — Steel Line Logistics, Salty's Seafood, DraftInvitations\n3) Company + learning — Shopify apps at CodersHive, plus projects like AgroMind & DocDrawer.\nFly to the Work planet (Jupiter) to see live previews!"

  if (wantsBuild || has('prd', 'scope', 'estimate', 'overview', 'requirement'))
    return `Love it — tell me a bit more and I'll put together a project overview, a ballpark cost, and a quick PRD:\n• What are you building & who's it for?\n• Must-have features / number of pages?\n• Any auth, payments, or integrations?\n• Timeline & rough budget?\n(My plans: Starter $149 · Pro $399 · Custom from $799.) Or email me at ${siteConfig.email} to start.`

  if (has('saas', 'product', 'seo4ai', 'demandradar', 'demand radar', 'palm'))
    return "I own and ship a few SaaS products:\n• SEO4AI — track & grow your brand's visibility inside AI answers → https://seo4ai.app\n• DemandRadar — LLM brand analytics, live on the Shopify App Store → https://apps.shopify.com/demandradar\n• Palm Insights — turns raw data into clear insights → https://palm-drab.vercel.app"

  if (has('client', 'freelance work you did', 'steel', 'seafood', 'draftinvitation', 'invitation'))
    return "Paid client work, live in production:\n• Steel Line Logistics — truck booking & fleet system → https://www.steellinelogistics.in\n• Salty's Seafood — online ordering (Australia) → https://www.saltysseafood.com\n• DraftInvitations — digital invitations with RSVP → https://draftinvitations.in"

  if (has('company', 'shopify', 'codershive', 'job', 'announceflow', 'countdown'))
    return "At CodersHive I build production Shopify apps — AnnounceFlow (announcement bars), Countdown Bar, and Social Proof — each with full OAuth and a multi-merchant schema. I own the whole engineering lifecycle there."

  if (has('projects', 'work', 'built', 'portfolio'))
    return "Three kinds of work:\n1) My own SaaS — SEO4AI, DemandRadar, Palm\n2) Client systems — Steel Line Logistics, Salty's Seafood, DraftInvitations\n3) Company + learning — Shopify apps at CodersHive, plus projects like AgroMind & DocDrawer.\nFly to the Work planet (Jupiter) to see live previews!"

  if (has('stack', 'tech', 'technolog', 'language', 'tools', 'framework'))
    return "My stack: TypeScript, JavaScript, Python · React, Next.js, Tailwind · Node.js, Express, PostgreSQL, MongoDB, Supabase · Git, Vercel, AWS, Docker. Currently sharpening DSA, System Design & DevOps."

  if (has('price', 'pricing', 'cost', 'budget', 'rate', 'charge', 'how much', 'quote', 'figure', 'fees'))
    return `Here's my ballpark (it's on the Pricing planet too):\n• Starter — $149 / ₹12,400 (1-page site)\n• Pro — $399 / ₹33,200 (up to 4 pages, most popular)\n• Custom — from $799 / ₹66,500 (full-stack apps)\nExact quote after a quick call — email me at ${siteConfig.email}.`

  if (has('hire', 'work together', 'available', 'availab', 'opportunit', 'collab', 'freelance', 'project for'))
    return `Yes — I'm ${siteConfig.status}. 🚀 Email me at ${siteConfig.email} and let's talk about what you're building.`

  if (has('contact', 'email', 'reach', 'connect', 'dm', 'message you'))
    return `Easiest ways to reach me:\n• Email: ${siteConfig.email}\n• GitHub: ${siteConfig.social.github}\n• LinkedIn: ${siteConfig.social.linkedin}\n• X: ${siteConfig.social.X}\n• Instagram: ${siteConfig.social.instagram}`

  if (has('resume', 'cv'))
    return `Happy to share details — just email me at ${siteConfig.email} and I'll send what you need.`

  if (has('where', 'location', 'country', 'based', 'from'))
    return "I'm based in India 🇮🇳 and work with clients worldwide."

  if (has('hobby', 'hobbies', 'fun', 'beyond', 'free time', 'outside'))
    return 'Outside code: reading, calisthenics (chasing those muscle-ups 💪), travelling, and good films. They keep me disciplined and curious.'

  if (has('ai', 'llm', 'gpt', 'machine learning'))
    return "AI is a big part of my work — SEO4AI and DemandRadar both run on LLMs (OpenAI + Gemini), and AgroMind uses GPT-4o vision. Ask me about any of them!"

  if (has('thank', 'thanks', 'cool', 'nice', 'awesome', 'great'))
    return "Glad to help! 🙌 Anything else you'd like to know?"

  if (has('bye', 'see you', 'goodbye'))
    return 'Take care! Reach out anytime at ' + siteConfig.email + ' 👋'

  return "Good question! I can tell you about my SaaS products, client work, company work, tech stack, or how to hire me. Try a chip below, or email me at " + siteConfig.email + '.'
}

function clean(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s*/gm, '')
    .replace(/^\s*[-*]\s+/gm, '• ')
}

function Linkified({ text: raw }: { text: string }) {
  const text = clean(raw)
  const parts = text.split(/(\bhttps?:\/\/[^\s]+|\b[\w.+-]+@[\w-]+\.[\w.-]+\b)/g)
  return (
    <>
      {parts.map((p, i) => {
        if (/^https?:\/\//.test(p))
          return (
            <a key={i} href={p} target="_blank" rel="noopener noreferrer" className="text-indigo-300 underline underline-offset-2 break-all hover:text-indigo-200">
              {p.replace(/^https?:\/\//, '')}
            </a>
          )
        if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(p))
          return (
            <a key={i} href={`mailto:${p}`} className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200">
              {p}
            </a>
          )
        return <span key={i}>{p}</span>
      })}
    </>
  )
}

export function AstronautChat() {
  const [open, setOpen] = useState(false)
  const [nudge, setNudge] = useState<string | null>(null)
  const [hasOpened, setHasOpened] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'me', text: GREETING }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Proactive: pop a speech bubble shortly after load (only if not opened yet).
  useEffect(() => {
    if (hasOpened) return
    const id = setTimeout(() => setNudge(NUDGES[0]), 3500)
    return () => clearTimeout(id)
  }, [hasOpened])

  // Rotate the nudge text while it's showing.
  useEffect(() => {
    if (!nudge || open) return
    let i = 0
    const id = setInterval(() => {
      i = (i + 1) % NUDGES.length
      setNudge(NUDGES[i])
    }, 5000)
    return () => clearInterval(id)
  }, [nudge, open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing, open])

  const openChat = () => {
    setOpen(true)
    setHasOpened(true)
    setNudge(null)
  }

  const send = async (raw?: string) => {
    const text = (raw ?? input).trim()
    if (!text || typing) return
    const history = [...msgs, { from: 'user' as const, text }]
    setMsgs(history)
    setInput('')
    setTyping(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map((m) => ({
            role: m.from === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data?.reply) {
          setTyping(false)
          setMsgs((m) => [...m, { from: 'me', text: data.reply }])
          return
        }
      } else if (res.status === 429) {
        const data = await res.json().catch(() => null)
        setTyping(false)
        setMsgs((m) => [...m, { from: 'me', text: data?.reply ?? `Easy there! Email me at ${EMAIL}.` }])
        return
      }
      throw new Error('fallback')
    } catch {
      setTyping(false)
      setMsgs((m) => [...m, { from: 'me', text: getReply(text) }])
    }
  }

  return (
    <>
      {/* Floating astronaut launcher */}
      <div className="fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-2">
        {/* Proactive speech bubble */}
        <AnimatePresence>
          {nudge && !open && (
            <motion.button
              type="button"
              onClick={openChat}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              className="max-w-[220px] rounded-2xl rounded-br-sm border border-white/15 bg-white px-3.5 py-2 text-left text-[13px] font-medium text-slate-800 shadow-xl"
            >
              {nudge}
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => (open ? setOpen(false) : openChat())}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 18 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label={`Chat with ${NAME}`}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 py-2 pl-2 pr-4 text-white shadow-xl shadow-indigo-600/40"
        >
          <motion.span
            animate={open ? {} : { y: [0, -4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative grid h-9 w-9 place-items-center rounded-full bg-white/15 text-xl"
          >
            🧑‍🚀
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-indigo-600 bg-emerald-400" />
          </motion.span>
          <span className="text-sm font-semibold">{open ? 'Close' : NAME}</span>
        </motion.button>
      </div>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-24 right-4 z-[70] flex h-[68vh] max-h-[540px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a1024] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-white">
              <span className="relative grid h-9 w-9 place-items-center rounded-full bg-white/20 text-xl">
                🧑‍🚀
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-indigo-600 bg-emerald-400" />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-bold">{NAME}</div>
                <div className="text-[11px] text-white/80">online · mini version of Ankur</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="ml-auto flex h-7 w-7 items-center justify-center rounded-full text-lg text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                aria-label="Close chat"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-[#070b18] px-3.5 py-4">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[82%] whitespace-pre-line rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                      m.from === 'user'
                        ? 'rounded-br-sm bg-indigo-600 text-white'
                        : 'rounded-bl-sm border border-white/10 bg-white/[0.06] text-slate-200'
                    }`}
                  >
                    <Linkified text={m.text} />
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.06] px-3 py-2.5">
                    {[0, 1, 2].map((d) => (
                      <motion.span
                        key={d}
                        className="h-1.5 w-1.5 rounded-full bg-slate-400"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: d * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-1.5 border-t border-white/5 bg-[#0a1024] px-3 pt-2.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition-colors hover:border-indigo-400/50 hover:bg-indigo-500/10 hover:text-indigo-200"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
              className="flex items-center gap-2 bg-[#0a1024] p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-indigo-400"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white transition-colors hover:bg-indigo-500 disabled:opacity-40"
                aria-label="Send"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

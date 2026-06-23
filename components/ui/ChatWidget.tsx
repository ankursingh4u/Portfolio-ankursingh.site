'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { siteConfig } from '@/lib/site-config'

interface Msg {
  from: 'me' | 'user'
  text: string
}

const EMAIL = siteConfig.email

const GREETING =
  "Hey! 👋 I'm a mini version of Ankur. Ask me about my work, my SaaS products, my stack, or how to hire me."

const SUGGESTIONS = ['What do you build?', 'Your SaaS products', 'Your tech stack', 'How to hire you']

/** Lightweight, keyless persona engine — answers from real portfolio data. */
function getReply(input: string): string {
  const t = input.toLowerCase().trim()
  const has = (...w: string[]) => w.some((x) => t.includes(x))

  if (/^(hi+|hey+|hello+|yo|sup|namaste|hola|good (morning|afternoon|evening))\b/.test(t))
    return "Hey there! 😄 Great to meet you. Want to hear about my products, my client work, or my stack?"

  if (has('who are you', 'about you', 'about your', 'yourself', 'who is ankur', 'tell me about'))
    return "I'm Ankur — a generalist full-stack software engineer. I take products from idea to production: architecture, code, deploy, and maintain. By nature I'm also an observer of society, power, and human behavior. Learning, building, exploring — always."

  if (has('saas', 'product', 'seo4ai', 'demandradar', 'demand radar', 'palm'))
    return "I own and ship a few SaaS products:\n• SEO4AI — track & grow your brand's visibility inside AI answers → https://seo4ai.app\n• DemandRadar — LLM brand analytics, live on the Shopify App Store → https://apps.shopify.com/demandradar\n• Palm Insights — turns raw data into clear insights → https://palm-drab.vercel.app"

  if (has('client', 'freelance work you did', 'steel', 'seafood', 'draftinvitation', 'invitation'))
    return "Paid client work, live in production:\n• Steel Line Logistics — truck booking & fleet system → https://www.steellinelogistics.in\n• Salty's Seafood — online ordering (Australia) → https://www.saltysseafood.com\n• DraftInvitations — digital invitations with RSVP → https://draftinvitations.in"

  if (has('company', 'shopify', 'codershive', 'job', 'announceflow', 'countdown'))
    return "At CodersHive I build production Shopify apps — AnnounceFlow (announcement bars), Countdown Bar, and Social Proof — each with full OAuth and a multi-merchant schema. I own the whole engineering lifecycle there."

  if (has('what do you build', 'what you build', 'projects', 'work', 'built', 'portfolio'))
    return "Three kinds of work:\n1) My own SaaS — SEO4AI, DemandRadar, Palm\n2) Client systems — Steel Line Logistics, Salty's Seafood, DraftInvitations\n3) Company + learning — Shopify apps at CodersHive, plus projects like AgroMind & DocDrawer.\nScroll to the 'Things I've built' section to see live previews!"

  if (has('stack', 'tech', 'technolog', 'language', 'tools', 'framework'))
    return "My stack: TypeScript, JavaScript, Python · React, Next.js, Tailwind · Node.js, Express, PostgreSQL, MongoDB, Supabase · Git, Vercel, AWS, Docker. Currently sharpening DSA, System Design & DevOps."

  if (has('price', 'pricing', 'cost', 'budget', 'rate', 'charge', 'how much', 'quote', 'figure', 'fees'))
    return `Here's my ballpark (it's on the Pricing section too):\n• Starter — $149 / ₹12,400 (1-page site)\n• Pro — $399 / ₹33,200 (up to 4 pages, most popular)\n• Custom — from $799 / ₹66,500 (full-stack apps)\nExact quote after a quick call — email me at ${siteConfig.email}.`

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

  return "Good question! I can tell you about my SaaS products, client work, company work, tech stack, or how to hire me. Try one of the chips below, or email me at " + siteConfig.email + '.'
}

/** Render text with clickable links, emails and internal routes. */
function Linkified({ text }: { text: string }) {
  const parts = text.split(/(\bhttps?:\/\/[^\s]+|\b[\w.+-]+@[\w-]+\.[\w.-]+\b|\/resume\b)/g)
  return (
    <>
      {parts.map((p, i) => {
        if (/^https?:\/\//.test(p))
          return (
            <a key={i} href={p} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline underline-offset-2 break-all hover:text-indigo-800">
              {p.replace(/^https?:\/\//, '')}
            </a>
          )
        if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(p))
          return (
            <a key={i} href={`mailto:${p}`} className="text-indigo-600 underline underline-offset-2 hover:text-indigo-800">
              {p}
            </a>
          )
        if (p === '/resume')
          return (
            <a key={i} href="/resume" target="_blank" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-800">
              /resume
            </a>
          )
        return <span key={i}>{p}</span>
      })}
    </>
  )
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'me', text: GREETING }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing, open])

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
      // 503/no key or empty → fall through to local responder
      throw new Error('fallback')
    } catch {
      setTyping(false)
      setMsgs((m) => [...m, { from: 'me', text: getReply(text) }])
    }
  }

  return (
    <>
      {/* Launcher */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Chat with mini Ankur"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-indigo-600 py-2.5 pl-2.5 pr-4 text-white shadow-xl shadow-indigo-600/30"
      >
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
          AS
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-indigo-600 bg-emerald-400" />
        </span>
        <span className="text-sm font-semibold">{open ? 'Close' : 'Chat with me'}</span>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-20 right-4 z-50 flex h-[68vh] max-h-[540px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-white">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
                AS
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-indigo-600 bg-emerald-400" />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-bold">Ankur · mini</div>
                <div className="text-[11px] text-white/80">online · usually replies instantly</div>
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
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-3.5 py-4">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] whitespace-pre-line rounded-2xl px-3 py-2 text-[13px] leading-relaxed shadow-sm ${
                      m.from === 'user'
                        ? 'rounded-br-sm bg-indigo-600 text-white'
                        : 'rounded-bl-sm bg-white text-slate-700 ring-1 ring-slate-200'
                    }`}
                  >
                    <Linkified text={m.text} />
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-white px-3 py-2.5 ring-1 ring-slate-200">
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
            <div className="flex flex-wrap gap-1.5 border-t border-slate-100 bg-white px-3 pt-2.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
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
              className="flex items-center gap-2 bg-white p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-indigo-400 focus:bg-white"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:opacity-40"
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

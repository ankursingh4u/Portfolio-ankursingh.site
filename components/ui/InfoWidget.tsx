'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function InfoWidget() {
  const [now, setNow] = useState<Date | null>(null)

  // Live clock — no location lookups (a geolocation prompt felt intrusive).
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const time = now
    ? now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--'
  const day = now
    ? now.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })
    : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3.5 py-2 shadow-sm backdrop-blur-md"
    >
      <span className="text-base leading-none" aria-hidden>
        🕑
      </span>
      <div className="flex flex-col justify-center leading-tight">
        <div className="font-mono text-sm font-semibold tabular-nums text-slate-900">
          {time}
        </div>
        <div className="text-[10px] text-slate-500">{day}</div>
      </div>
    </motion.div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Weather {
  temp: number
  code: number
  place: string
}

// WMO weather codes → { emoji, label }
function describeWeather(code: number): { icon: string; label: string } {
  if (code === 0) return { icon: '☀️', label: 'Clear' }
  if (code <= 2) return { icon: '🌤️', label: 'Partly cloudy' }
  if (code === 3) return { icon: '☁️', label: 'Overcast' }
  if (code <= 48) return { icon: '🌫️', label: 'Foggy' }
  if (code <= 57) return { icon: '🌦️', label: 'Drizzle' }
  if (code <= 67) return { icon: '🌧️', label: 'Rain' }
  if (code <= 77) return { icon: '🌨️', label: 'Snow' }
  if (code <= 82) return { icon: '🌧️', label: 'Showers' }
  if (code <= 86) return { icon: '🌨️', label: 'Snow showers' }
  if (code <= 99) return { icon: '⛈️', label: 'Thunderstorm' }
  return { icon: '🌡️', label: 'Weather' }
}

const FALLBACK = { lat: 28.6139, lon: 77.209, place: 'New Delhi' }

export function InfoWidget() {
  const [now, setNow] = useState<Date | null>(null)
  const [weather, setWeather] = useState<Weather | null>(null)

  // Live clock
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // Weather — try geolocation, fall back to New Delhi.
  useEffect(() => {
    let cancelled = false

    const load = async (lat: number, lon: number, place: string | null) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
        )
        const data = await res.json()
        let resolvedPlace = place
        if (!resolvedPlace) {
          try {
            const geo = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
            ).then((r) => r.json())
            resolvedPlace = geo.city || geo.locality || geo.principalSubdivision || 'Your area'
          } catch {
            resolvedPlace = 'Your area'
          }
        }
        if (cancelled) return
        setWeather({
          temp: Math.round(data?.current?.temperature_2m ?? 0),
          code: data?.current?.weather_code ?? 0,
          place: resolvedPlace as string,
        })
      } catch {
        /* leave weather null */
      }
    }

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => load(pos.coords.latitude, pos.coords.longitude, null),
        () => load(FALLBACK.lat, FALLBACK.lon, FALLBACK.place),
        { timeout: 6000 }
      )
    } else {
      load(FALLBACK.lat, FALLBACK.lon, FALLBACK.place)
    }

    return () => {
      cancelled = true
    }
  }, [])

  const time = now
    ? now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--'
  const day = now
    ? now.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })
    : ''
  const w = weather ? describeWeather(weather.code) : null

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="flex items-stretch gap-2 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-md"
    >
      {/* Weather */}
      <div className="flex items-center gap-2 pr-3">
        <span className="text-xl leading-none" aria-hidden>
          {w ? w.icon : '🌡️'}
        </span>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-slate-900">
            {weather ? `${weather.temp}°C` : '—'}
          </div>
          <div className="text-[10px] text-slate-500 max-w-[84px] truncate">
            {weather ? weather.place : 'locating…'}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px bg-slate-200" />

      {/* Clock */}
      <div className="flex flex-col justify-center pl-3 leading-tight">
        <div className="font-mono text-sm font-semibold tabular-nums text-slate-900">
          {time}
        </div>
        <div className="text-[10px] text-slate-500">{day}</div>
      </div>
    </motion.div>
  )
}

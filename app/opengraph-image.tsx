import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Ankur Singh — Generalist Software Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Branded social-share card, generated at the edge (no static asset to maintain).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          background:
            'radial-gradient(circle at 28% 28%, #1b264a 0%, #0b1224 55%, #070b16 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <div style={{ width: 14, height: 14, borderRadius: 9999, background: '#34d399' }} />
          <div
            style={{
              fontSize: 26,
              color: '#a5b4fc',
              letterSpacing: 4,
              textTransform: 'uppercase',
            }}
          >
            Generalist Software Engineer
          </div>
        </div>

        <div style={{ fontSize: 132, fontWeight: 700, lineHeight: 1 }}>Ankur Singh</div>

        <div style={{ fontSize: 40, color: '#cbd5e1', marginTop: 32 }}>
          AI Products · Shopify Apps · Next.js
        </div>

        <div style={{ fontSize: 28, color: '#64748b', marginTop: 56 }}>ankursingh.site</div>
      </div>
    ),
    { ...size }
  )
}

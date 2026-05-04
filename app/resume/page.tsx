import type { Metadata } from 'next'
import { PrintButton } from '@/components/resume/PrintButton'
import './resume.css'

export const metadata: Metadata = {
  title: 'Resume - Ankur Singh | Full-Stack Software Engineer',
  description: 'Resume of Ankur Singh, Full-Stack Software Engineer specializing in Next.js, TypeScript, Node.js, Shopify apps, and AI-powered products.',
}

export default function ResumePage() {
  return (
    <>
      {/* Sticky toolbar - hidden on print */}
      <div className="r-toolbar">
        <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginRight: 'auto' }}>
          Ankur Singh — Resume &nbsp;
          <span style={{ color: '#64748b', fontSize: '0.72rem' }}>
            · In print dialog: set <strong style={{ color: '#94a3b8' }}>Destination → Save as PDF</strong>, uncheck <strong style={{ color: '#94a3b8' }}>Headers and footers</strong>
          </span>
        </span>
        <PrintButton />
        <a href="/" className="r-btn-secondary">
          ← Portfolio
        </a>
      </div>

      <div className="resume-page">

        {/* ── HEADER ── */}
        <div>
          <div className="r-name">Ankur Singh</div>
          <div className="r-headline">Full-Stack Software Engineer</div>
          <div className="r-contact">
            ankursing4work@gmail.com &nbsp;|&nbsp;
            <a href="https://github.com/ankursingh4u" target="_blank" rel="noreferrer">github.com/ankursingh4u</a>
            &nbsp;|&nbsp;
            <a href="https://www.linkedin.com/in/ankursingh4u" target="_blank" rel="noreferrer">linkedin.com/in/ankursingh4u</a>
            &nbsp;|&nbsp;
            <a href="https://x.com/ankursingh4u" target="_blank" rel="noreferrer">x.com/ankursingh4u</a>
            &nbsp;|&nbsp; India (IST, UTC+5:30)
          </div>
        </div>

        <hr className="r-divider" />

        {/* ── SUMMARY ── */}
        <div className="r-section">
          <div className="r-section-title">Professional Summary</div>
          <p className="r-entry-desc">
            Results-driven Full-Stack Software Engineer with proven experience delivering production-grade web applications across Shopify app development, AI-powered platforms, and SaaS products. Currently working as a Full-Stack Engineer at Sabai Innovations / CodersHive, owning the complete engineering lifecycle — from requirements gathering and system design through deployment and production maintenance. Independently building three products: a live AI farming assistant (Node.js + OpenAI GPT-4o), a Shopify smart search app, and an LLM brand analytics platform (launching May 2026). Strong command of TypeScript, React, Next.js, Node.js, and PostgreSQL with a track record of shipping clean, maintainable code.
          </p>
        </div>

        {/* ── EXPERIENCE ── */}
        <div className="r-section">
          <div className="r-section-title">Work Experience</div>

          <div className="r-entry">
            <div className="r-entry-header">
              <div>
                <div className="r-entry-title">Full-Stack Software Engineer</div>
                <div className="r-entry-org">Sabai Innovations / CodersHive</div>
              </div>
              <div className="r-entry-date">January 2026 - Present</div>
            </div>
            <ul className="r-list">
              <li>Engineered and shipped 3 production Shopify applications: AnnounceFlow (dynamic announcement bars with A/B testing and analytics), Countdown Bar (urgency-driving evergreen timers with multi-language support), and Social Proof (real-time purchase notifications via WebSockets)</li>
              <li>Implemented OAuth 2.0 authentication flow and designed scalable PostgreSQL database schema supporting multi-merchant SaaS architecture</li>
              <li>Developed RESTful API integrations with Shopify Admin API and Shopify Polaris component library for consistent merchant-facing UI</li>
              <li>Own the full engineering lifecycle — from requirements gathering and architecture decisions to deployment, monitoring, and production maintenance of live merchant-facing systems</li>
              <li>Stack: Next.js, TypeScript, React, Shopify API, Shopify Polaris, PostgreSQL, Node.js, Vercel</li>
            </ul>
          </div>
        </div>

        {/* ── PROJECTS ── */}
        <div className="r-section">
          <div className="r-section-title">Projects</div>

          <div className="r-entry">
            <div className="r-entry-header">
              <div>
                <span className="r-entry-title">AgroMind</span>
                <span className="r-live">[LIVE]</span>
              </div>
              <div className="r-entry-date">
                2025 &nbsp;
                <a className="r-link" href="http://agromind-app.onrender.com" target="_blank" rel="noreferrer">agromind-app.onrender.com</a>
                &nbsp;|&nbsp;
                <a className="r-link" href="https://github.com/ankursingh4u/agromind-app" target="_blank" rel="noreferrer">GitHub</a>
              </div>
            </div>
            <ul className="r-list">
              <li>Ranked <strong>#9</strong> in a competitive hackathon out of all participating teams</li>
              <li>Architected and deployed a full-stack AI-powered agricultural advisory platform serving Indian farmers with real-time, personalized crop guidance</li>
              <li>Integrated OpenAI GPT-4o vision API to detect crop diseases from uploaded photos with multi-modal input support (text, voice, image)</li>
              <li>Built multilingual support for Hindi, English, Bengali, and Tamil using franc-min language detection library</li>
              <li>Connected 4 external APIs: OpenWeatherMap (5-day forecasts), SoilGrids (pH + organic carbon), Data.gov.in (market prices), and Leaflet.js (interactive field mapping)</li>
              <li>Stack: Node.js, Express.js, MongoDB, OpenAI GPT-4o API, HTML5, CSS3, JavaScript</li>
            </ul>
          </div>

          <div className="r-entry">
            <div className="r-entry-header">
              <div>
                <span className="r-entry-title">LLM Brand Analytics Platform</span>
                <span className="r-soon">[LAUNCHING MAY 2026]</span>
              </div>
              <div className="r-entry-date">2026 - MVP Complete</div>
            </div>
            <ul className="r-list">
              <li>Designed and built an analytics SaaS platform that tracks brand visibility across AI language model responses (ChatGPT, Google Gemini, Claude, Perplexity)</li>
              <li>Implemented competitive share-of-voice analysis to benchmark brand AI-presence against competitors across targeted query categories</li>
              <li>Built automated weekly report generation and trend dashboards using Recharts with actionable AI-readiness scoring</li>
              <li>Stack: Next.js, TypeScript, OpenAI API, Google Gemini API, PostgreSQL, Recharts, Vercel</li>
            </ul>
          </div>

          <div className="r-entry">
            <div className="r-entry-header">
              <div>
                <span className="r-entry-title">Smart Search Suggest</span>
              </div>
              <div className="r-entry-date">2026 - Shopify App</div>
            </div>
            <ul className="r-list">
              <li>Developed a Shopify application that intercepts zero-result and failed product searches in real time, surfacing missed revenue opportunities to merchants</li>
              <li>Built fuzzy-matching engine enabling "tee shirt" to resolve to "cotton t-shirt" and similar synonym matching, reducing search abandonment</li>
              <li>Implemented automated product tagging with alternate search terms and merchant alert dashboard with conversion lift tracking</li>
              <li>Stack: Next.js, TypeScript, Shopify Admin API, Shopify Polaris, PostgreSQL, Node.js</li>
            </ul>
          </div>

          <div className="r-entry">
            <div className="r-entry-header">
              <div>
                <span className="r-entry-title">DocDrawer</span>
                <span className="r-live">[LIVE]</span>
              </div>
              <div className="r-entry-date">
                2025 &nbsp;
                <a className="r-link" href="https://docdrawer.onrender.com" target="_blank" rel="noreferrer">docdrawer.onrender.com</a>
              </div>
            </div>
            <ul className="r-list">
              <li>Built a secure full-stack file management platform with user authentication, encrypted cloud file storage, upload/download functionality, and role-based access control</li>
              <li>Integrated Supabase Storage for scalable object storage with server-side file handling via Express.js middleware</li>
              <li>Stack: Node.js, Express.js, MongoDB, Supabase Storage, EJS, Tailwind CSS</li>
            </ul>
          </div>
        </div>

        {/* ── SKILLS ── */}
        <div className="r-section">
          <div className="r-section-title">Technical Skills</div>
          <table className="r-skills-table">
            <tbody>
              <tr>
                <td>Languages</td>
                <td>TypeScript, JavaScript (ES6+), Python, HTML5, CSS3</td>
              </tr>
              <tr>
                <td>Frontend</td>
                <td>React.js, Next.js (App Router), Tailwind CSS, Shopify Polaris</td>
              </tr>
              <tr>
                <td>Backend</td>
                <td>Node.js, Express.js, REST API design, OAuth 2.0, WebSockets</td>
              </tr>
              <tr>
                <td>Databases</td>
                <td>PostgreSQL, MongoDB, Supabase, database schema design</td>
              </tr>
              <tr>
                <td>APIs &amp; Tools</td>
                <td>OpenAI API (GPT-4o), Google Gemini API, Shopify Admin API, OpenWeatherMap API</td>
              </tr>
              <tr>
                <td>DevOps &amp; Tools</td>
                <td>Git, GitHub, Vercel, AWS, Docker (basics), VS Code</td>
              </tr>
              <tr>
                <td>Learning</td>
                <td>React Native, System Design, Data Structures and Algorithms, DevOps</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── BACKGROUND ── */}
        <div className="r-section">
          <div className="r-section-title">Additional Background</div>
          <p className="r-entry-desc">
            Conducted deep research across 200+ decentralized Web3 projects (2018-2023), developing strong systems thinking, product analysis discipline, and understanding of distributed architectures. Transitioned focus to building practical, high-impact software products with emphasis on clean architecture, code maintainability, and real user value.
          </p>
        </div>

      </div>

      {/* Custom print footer — repeats on every page, hidden on screen */}
      <div className="r-print-footer">
        <span>Ankur Singh &mdash; Full-Stack Software Engineer</span>
        <span>ankursing4work@gmail.com</span>
      </div>
    </>
  )
}

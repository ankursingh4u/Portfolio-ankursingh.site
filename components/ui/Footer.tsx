'use client'

import { siteConfig } from '@/lib/site-config'

const internalLinks = [
  { label: 'about', href: '#about' },
  { label: 'work', href: '#work' },
  { label: 'showcase', href: '#showcase' },
  { label: 'open_source', href: '#github' },
  { label: 'pricing', href: '#pricing' },
  { label: 'contact', href: '#contact' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-terminal-border bg-terminal-surface/50">
      <div className="container-wide mx-auto px-6 py-8">
        {/* Internal navigation — improves crawl depth & in-page navigation */}
        <nav
          aria-label="Footer"
          className="mb-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-b border-terminal-border/50 pb-6"
        >
          {internalLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-xs text-terminal-dim transition-colors hover:text-terminal-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side - Copyright */}
          <div className="text-sm text-terminal-dim font-mono">
            <span className="text-terminal-muted">/*</span>
            <span className="mx-2">© {currentYear} {siteConfig.name}</span>
            <span className="text-terminal-muted">*/</span>
          </div>

          {/* Center - Built with */}
          <div className="text-xs text-terminal-dim font-mono">
            built with{' '}
            <span className="text-terminal-text">Next.js</span>
            {' + '}
            <span className="text-terminal-text">TypeScript</span>
            {' + '}
            <span className="text-terminal-text">Tailwind</span>
          </div>

          {/* Right side - Social links */}
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-terminal-dim hover:text-terminal-accent transition-colors font-mono"
            >
              github
            </a>
            <span className="text-terminal-border">|</span>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-terminal-dim hover:text-terminal-accent transition-colors font-mono"
            >
              linkedin
            </a>
            <span className="text-terminal-border">|</span>
            <a
              href={siteConfig.social.X}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-terminal-dim hover:text-terminal-accent transition-colors font-mono"
            >
              twitter
            </a>
            <span className="text-terminal-border">|</span>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-terminal-dim hover:text-terminal-accent transition-colors font-mono"
            >
              instagram
            </a>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-6 pt-4 border-t border-terminal-border/50">
          <div className="text-center text-xs text-terminal-dim font-mono">
            <span className="text-terminal-muted">{'>'}</span>
            <span className="mx-2">system.exit(0)</span>
            <span className="text-terminal-accent animate-cursor-blink">_</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

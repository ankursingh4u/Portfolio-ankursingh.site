'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '@/lib/site-config'

const navItems = [
  { label: 'home', href: '#home' },
  { label: 'about', href: '#about' },
  { label: 'work', href: '#work' },
  { label: 'stack', href: '#stack' },
  { label: 'github', href: '#github' },
  { label: 'pricing', href: '#pricing' },
  { label: 'contact', href: '#contact' },
]

export function Navigation() {
  const [activeSection, setActiveSection] = useState('home')
  const [isScrolled, setIsScrolled] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)

      // Update active section based on scroll position
      const sections = navItems.map((item) => item.label)
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-slate-200 bg-white/85 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <nav aria-label="Primary" className="container-wide mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#home"
            className={`flex h-8 w-8 items-center justify-center rounded border text-xs font-mono font-bold transition-all ${
              isScrolled
                ? 'border-indigo-300 bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                : 'border-white/30 bg-white/10 text-white hover:bg-white/20'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Ankur Singh"
          >
            AS
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => {
              const active = activeSection === item.label
              const cls = isScrolled
                ? active
                  ? 'text-indigo-600'
                  : 'text-slate-500 hover:text-slate-900'
                : active
                ? 'text-white'
                : 'text-white/60 hover:text-white'
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  aria-label={`${item.label} section`}
                  className={`relative rounded px-2.5 py-1.5 text-xs font-mono transition-colors ${cls}`}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  .{item.label}()
                  {active && (
                    <motion.div
                      layoutId="activeSection"
                      className={`absolute inset-0 -z-10 rounded ${isScrolled ? 'bg-indigo-100' : 'bg-white/10'}`}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.a>
              )
            })}
          </div>

          {/* Right side: hire me CTA */}
          <div className="hidden md:flex items-center gap-2">
            <motion.a
              href="#contact"
              aria-label="Hire me — contact me about opportunities"
              className={`inline-flex items-center gap-1.5 rounded border px-3 py-1.5 text-xs font-mono transition-all ${
                isScrolled
                  ? 'border-indigo-300 text-indigo-600 hover:bg-indigo-50'
                  : 'border-white/30 text-white hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isScrolled ? 'bg-indigo-500' : 'bg-emerald-400'} animate-pulse`} />
              hire me
            </motion.a>
          </div>

          {/* Mobile menu button */}
          <MobileMenuButton navItems={navItems} activeSection={activeSection} dark={!isScrolled} />
        </div>
      </nav>
    </motion.header>
  )
}

interface MobileMenuButtonProps {
  navItems: { label: string; href: string }[]
  activeSection: string
  dark?: boolean
}

function MobileMenuButton({ navItems, activeSection, dark }: MobileMenuButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${dark && !isOpen ? 'text-white/80 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        whileTap={{ scale: 0.95 }}
      >
        <span className="font-mono text-sm">{isOpen ? '[x]' : '[=]'}</span>
      </motion.button>

      {isOpen && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 border-b border-slate-200 bg-white/95 backdrop-blur-md"
        >
          <div className="px-6 py-4 flex flex-col gap-2">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                aria-label={`${item.label} section`}
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`px-3 py-2 text-sm font-mono rounded transition-colors ${
                  activeSection === item.label
                    ? 'text-terminal-accent bg-terminal-bg'
                    : 'text-terminal-dim hover:text-terminal-text'
                }`}
              >
                .{item.label}()
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

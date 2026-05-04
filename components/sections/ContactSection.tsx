'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '@/lib/site-config'
import { generateGmailLink, generateMailtoLink } from '@/lib/utils'
import { TerminalWindow, CommandLine } from '../terminal'
import { GlitchOnScroll, NeonPulse, AnimatedBorder } from '../effects'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const services = [
  { icon: '⬡', label: 'Full-stack web apps', detail: 'Next.js · React · Node' },
  { icon: '⬡', label: 'Shopify development', detail: 'Custom apps & themes' },
  { icon: '⬡', label: 'AI product integration', detail: 'Claude · OpenAI · RAG' },
  { icon: '⬡', label: 'Portfolio & landing pages', detail: 'Animated · fast · accessible' },
]

export function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', project: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const subject = `[Project Inquiry] ${formData.project || 'New Project'} — from ${formData.name}`
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\nProject type: ${formData.project}\n\nMessage:\n${formData.message}`
    const gmailLink = generateGmailLink(siteConfig.email, subject, body)
    window.open(gmailLink, '_blank')
    setFormData({ name: '', email: '', project: '', message: '' })
  }

  const handleDirectEmail = () => {
    const mailtoLink = generateMailtoLink(siteConfig.email, 'Project Inquiry', 'Hi Ankur,\n\n')
    window.location.href = mailtoLink
  }

  return (
    <section id="contact" className="section relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-terminal-accent/[0.02] to-transparent pointer-events-none" />

      <div className="container-narrow mx-auto relative z-10">
        {/* Section header */}
        <GlitchOnScroll>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="section-header"
          >
            <h2 className="section-title">
              <NeonPulse color="#22c55e">hire me</NeonPulse>
            </h2>
            <span className="text-xs text-terminal-dim font-mono">// let's build something</span>
          </motion.div>
        </GlitchOnScroll>

        {/* Hero pitch */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 p-5 rounded-lg border border-terminal-border/40 bg-terminal-surface/40"
        >
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2.5 h-2.5 rounded-full bg-terminal-accent shrink-0 mt-1.5"
            />
            <div>
              <p className="text-sm font-mono text-terminal-text leading-relaxed">
                I'm a full-stack engineer who ships production-ready apps fast — with clean code, good UX, and zero fluff.
                Whether it's a Shopify plugin, an AI-powered tool, or a landing page that converts, I've got it covered.
              </p>
              <div className="flex flex-wrap gap-4 mt-3">
                <span className="text-xs font-mono text-terminal-dim">
                  <span className="text-terminal-accent">✓</span> Available now
                </span>
                <span className="text-xs font-mono text-terminal-dim">
                  <span className="text-terminal-accent">✓</span> Replies within 24h
                </span>
                <span className="text-xs font-mono text-terminal-dim">
                  <span className="text-terminal-accent">✓</span> India (IST) · works globally
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 lg:grid-cols-2"
        >
          {/* Left side */}
          <div className="space-y-6">
            {/* Services */}
            <motion.div variants={itemVariants}>
              <TerminalWindow title="services.sh">
                <div className="space-y-1">
                  <div className="text-xs text-terminal-dim mb-3">
                    <span className="text-terminal-muted">$</span> cat what-i-build.txt
                  </div>
                  {services.map((s, i) => (
                    <motion.div
                      key={s.label}
                      className="flex items-center gap-3 py-2 border-b border-terminal-border/30 last:border-0"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 }}
                      whileHover={{ x: 4 }}
                    >
                      <span className="text-terminal-accent text-xs">{s.icon}</span>
                      <div>
                        <div className="text-xs font-mono text-terminal-text">{s.label}</div>
                        <div className="text-[11px] font-mono text-terminal-dim">{s.detail}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TerminalWindow>
            </motion.div>

            {/* Contact info */}
            <motion.div variants={itemVariants}>
              <TerminalWindow title="contact_info.sh">
                <div className="space-y-3">
                  <CommandLine prefix="$" command="echo $EMAIL" />
                  <motion.div className="pl-4 text-terminal-accent text-sm" whileHover={{ x: 5 }}>
                    {siteConfig.email}
                  </motion.div>
                  <CommandLine prefix="$" command="echo $LOCATION" />
                  <div className="pl-4 text-terminal-text text-sm">{siteConfig.location}</div>
                  <CommandLine prefix="$" command="echo $RESPONSE_TIME" />
                  <div className="pl-4 text-terminal-accent text-sm">within 24 hours</div>
                </div>
              </TerminalWindow>
            </motion.div>

            {/* Quick actions */}
            <motion.div variants={itemVariants} className="space-y-3">
              <motion.button
                onClick={handleDirectEmail}
                className="terminal-btn w-full justify-center"
                whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(34, 197, 94, 0.2)' }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-terminal-muted">[</span>
                <span>open_mail_client</span>
                <span className="text-terminal-muted">]</span>
              </motion.button>
              <div className="flex gap-3">
                {[
                  { name: 'github', url: siteConfig.social.github },
                  { name: 'linkedin', url: siteConfig.social.linkedin },
                  { name: 'twitter', url: siteConfig.social.X },
                ].map((s) => (
                  <motion.a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="terminal-btn flex-1 justify-center"
                    whileHover={{ scale: 1.05, borderColor: '#22c55e' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {s.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right side - Form */}
          <motion.div variants={itemVariants}>
            <AnimatedBorder borderColor="green">
              <TerminalWindow title="start_project.sh">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="block text-xs text-terminal-dim font-mono">
                        <span className="text-terminal-muted">$</span> NAME
                      </label>
                      <motion.input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="terminal-input focus-glow"
                        whileFocus={{ boxShadow: '0 0 15px rgba(34, 197, 94, 0.2)' }}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="block text-xs text-terminal-dim font-mono">
                        <span className="text-terminal-muted">$</span> EMAIL
                      </label>
                      <motion.input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        className="terminal-input focus-glow"
                        whileFocus={{ boxShadow: '0 0 15px rgba(34, 197, 94, 0.2)' }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="project" className="block text-xs text-terminal-dim font-mono">
                      <span className="text-terminal-muted">$</span> PROJECT_TYPE
                    </label>
                    <motion.select
                      id="project"
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      className="terminal-select focus-glow w-full"
                      whileFocus={{ boxShadow: '0 0 15px rgba(34, 197, 94, 0.2)' }}
                    >
                      <option value="">Select a project type...</option>
                      <option value="Landing page">Landing page / portfolio</option>
                      <option value="Full website">Full website (multi-page)</option>
                      <option value="Shopify app">Shopify app / theme</option>
                      <option value="Web app">Web application / SaaS</option>
                      <option value="AI integration">AI integration / automation</option>
                      <option value="Other">Other / not sure yet</option>
                    </motion.select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="block text-xs text-terminal-dim font-mono">
                      <span className="text-terminal-muted">$</span> MESSAGE
                    </label>
                    <motion.textarea
                      id="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your project — goals, timeline, budget range..."
                      className="terminal-textarea focus-glow"
                      whileFocus={{ boxShadow: '0 0 15px rgba(34, 197, 94, 0.2)' }}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="terminal-btn terminal-btn-primary w-full justify-center"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                        sending...
                      </motion.span>
                    ) : (
                      <>
                        <span className="text-terminal-bg/80">[</span>
                        <span>send_inquiry</span>
                        <span className="text-terminal-bg/80">]</span>
                      </>
                    )}
                  </motion.button>

                  <p className="text-xs text-terminal-dim text-center font-mono">
                    // opens Gmail · I'll reply within 24h
                  </p>
                </form>
              </TerminalWindow>
            </AnimatedBorder>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

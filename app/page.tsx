import { Navigation, Footer, ChatWidget } from '@/components/ui'
import { CyberEffectsProvider } from '@/components/effects'
import { SectionReveal } from '@/components/animations/SectionReveal'
import {
  HeroSection,
  AboutSection,
  ProjectsSection,
  StackSection,
  GitHubSection,
  PricingSection,
  ContactSection,
} from '@/components/sections'

export default function Home() {
  return (
    <CyberEffectsProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-indigo-600 focus:shadow-lg focus:ring-2 focus:ring-indigo-400"
      >
        Skip to main content
      </a>
      <Navigation />
      <main id="main" tabIndex={-1}>
        <HeroSection />
        <SectionReveal>
          <AboutSection />
        </SectionReveal>
        <SectionReveal>
          <ProjectsSection />
        </SectionReveal>
        <SectionReveal>
          <StackSection />
        </SectionReveal>
        <SectionReveal>
          <GitHubSection />
        </SectionReveal>
        <SectionReveal>
          <PricingSection />
        </SectionReveal>
        <SectionReveal>
          <ContactSection />
        </SectionReveal>
      </main>
      <Footer />
      <ChatWidget />
    </CyberEffectsProvider>
  )
}

import { Navigation, Footer, ChatWidget } from '@/components/ui'
import { CyberEffectsProvider } from '@/components/effects'
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
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <StackSection />
        <GitHubSection />
        <PricingSection />
        <ContactSection />
      </main>
      <Footer />
      <ChatWidget />
    </CyberEffectsProvider>
  )
}

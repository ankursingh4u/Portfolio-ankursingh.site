import { Navigation, Footer } from '@/components/ui'
import { CyberEffectsProvider } from '@/components/effects'
import {
  HeroSection,
  AboutSection,
  WorkSection,
  ClientSystemsSection,
  CoolestProjectsSection,
  StackSection,
  GitHubSection,
  ContactSection,
} from '@/components/sections'

export default function Home() {
  return (
    <CyberEffectsProvider>
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ClientSystemsSection />
        <CoolestProjectsSection />
        <StackSection />
        <WorkSection />
        <GitHubSection />
        <ContactSection />
      </main>
      <Footer />
    </CyberEffectsProvider>
  )
}

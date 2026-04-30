import { Navigation, Footer } from '@/components/ui'
import { CyberEffectsProvider } from '@/components/effects'
import {
  HeroSection,
  AboutSection,
  CoolestProjectsSection,
  GitHubSection,
  WorkSection,
  StackSection,
  ContactSection,
} from '@/components/sections'

export default function Home() {
  return (
    <CyberEffectsProvider>
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <CoolestProjectsSection />
        <GitHubSection />
        <WorkSection />
        <StackSection />
        <ContactSection />
      </main>
      <Footer />
    </CyberEffectsProvider>
  )
}

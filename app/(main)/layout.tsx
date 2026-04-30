import { Navigation, Footer } from '@/components/ui'
import { CyberEffectsProvider } from '@/components/effects'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CyberEffectsProvider>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </CyberEffectsProvider>
  )
}

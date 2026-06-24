import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'
import { ThemeProvider } from '@/context/ThemeContext'
import './globals.css'

const metaTitle = `${siteConfig.name} — Full-Stack Engineer | AI Products, Shopify & Next.js`

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.meta.url),
  title: metaTitle,
  description: siteConfig.description,
  keywords: siteConfig.meta.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.meta.url,
    title: metaTitle,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.meta.image,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: metaTitle,
    description: siteConfig.description,
    images: [siteConfig.meta.image],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.name,
  url: siteConfig.meta.url,
  jobTitle: 'Full-Stack Software Engineer',
  description: siteConfig.description,
  email: `mailto:${siteConfig.email}`,
  worksFor: { '@type': 'Organization', name: 'CodersHive' },
  knowsAbout: [
    'Next.js',
    'React',
    'Node.js',
    'TypeScript',
    'Shopify App Development',
    'AI Product Integration',
    'Full-Stack Web Development',
  ],
  sameAs: [
    siteConfig.social.github,
    siteConfig.social.linkedin,
    siteConfig.social.X,
    siteConfig.social.instagram,
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-terminal-bg text-terminal-text antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}

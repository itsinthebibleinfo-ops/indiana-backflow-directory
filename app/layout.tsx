import type { Metadata } from 'next'
import './globals.css'
import SiteHeader from '@/components/layout/SiteHeader'
import SiteFooter from '@/components/layout/SiteFooter'
import MobileCTA from '@/components/ui/MobileCTA'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://indianabackflowtesting.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Indiana's Searchable Backflow Testing Directory | Certified Testers",
    template: '%s | Indiana Backflow Testing Directory',
  },
  description:
    'Avoid missed compliance deadlines. Find certified Indiana backflow prevention testers for irrigation, domestic, commercial, and fire protection systems.',
  keywords: [
    'backflow testing Indiana',
    'certified backflow tester Indiana',
    'backflow prevention Indiana',
    'Indiana backflow compliance',
    'backflow test near me Indiana',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Indiana Backflow Testing Directory',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: siteUrl,
  },
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Indiana Backflow Testing Directory',
  url: siteUrl,
  description: "Indiana's searchable directory of certified backflow prevention testers.",
  areaServed: {
    '@type': 'State',
    name: 'Indiana',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(orgJsonLd).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <MobileCTA />
      </body>
    </html>
  )
}

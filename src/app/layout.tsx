import type { Metadata } from 'next'
import './globals.css'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://calculator.ordoflow.com'

export const metadata: Metadata = {
  title: 'Kalkulator Oszczędności z Automatyzacji | Ordoflow',
  description:
    'Odkryj, ile możesz zaoszczędzić dzięki automatyzacji procesów biznesowych. Kalkulator Ordoflow pomoże Ci oszacować realne korzyści finansowe.',
  keywords: [
    'automatyzacja',
    'oszczędności',
    'n8n',
    'procesy biznesowe',
    'kalkulator',
    'automatyzacja procesów',
    'Ordoflow',
  ],
  authors: [{ name: 'Ordoflow', url: 'https://ordoflow.com' }],
  creator: 'Ordoflow',
  publisher: 'Ordoflow',
  metadataBase: new URL(APP_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Kalkulator Oszczędności z Automatyzacji | Ordoflow',
    description:
      'Odkryj, ile możesz zaoszczędzić dzięki automatyzacji procesów biznesowych.',
    type: 'website',
    locale: 'pl_PL',
    url: APP_URL,
    siteName: 'Ordoflow Calculator',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Kalkulator Oszczędności z Automatyzacji - Ordoflow',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kalkulator Oszczędności z Automatyzacji | Ordoflow',
    description:
      'Odkryj, ile możesz zaoszczędzić dzięki automatyzacji procesów biznesowych.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body className="min-h-screen grid-bg">{children}</body>
    </html>
  )
}

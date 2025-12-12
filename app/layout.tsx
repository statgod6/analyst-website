import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Analytics from '@/components/Analytics'
import AuthProvider from '@/components/AuthProvider'
import LayoutWrapper from '@/components/layout/LayoutWrapper'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://yourdomain.com'),
  title: {
    default: 'AIE for Everyone | AI Prompts, Guides & Money-Making Strategies',
    template: '%s | AIE for Everyone'
  },
  description: 'Master AI with practical prompts, agent guides, and proven strategies. Learn how to use AI tools to boost productivity and make money online. AI made simple for everyone.',
  keywords: ['AI prompts', 'AI guides', 'AI money making', 'AI agents', 'artificial intelligence', 'AI tools', 'ChatGPT prompts', 'AI automation'],
  authors: [{ name: 'AIE for Everyone' }],
  creator: 'AIE for Everyone',
  publisher: 'AIE for Everyone',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    title: 'AIE for Everyone | Master AI & Boost Your Income',
    description: 'Learn AI with practical prompts, guides, and money-making strategies. AI tools made accessible for everyone.',
    siteName: 'AIE for Everyone',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIE for Everyone | AI Prompts & Guides',
    description: 'Master AI with practical prompts, agent guides, and proven strategies to boost productivity and income.',
    creator: '@yourhandle',
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
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <Analytics />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}

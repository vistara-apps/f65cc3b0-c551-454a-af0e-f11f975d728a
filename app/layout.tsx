import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'NodeHuntr - Find DePIN Nodes & Maximize Earnings',
  description: 'Find, track, and maximize your DePIN node earnings in real-time. Discover nearby Helium hotspots, XNET nodes, and other DePIN networks with AI-powered route optimization.',
  keywords: ['DePIN', 'Helium', 'XNET', 'cryptocurrency', 'earnings', 'nodes', 'blockchain'],
  authors: [{ name: 'NodeHuntr Team' }],
  openGraph: {
    title: 'NodeHuntr - DePIN Node Discovery',
    description: 'Real-time DePIN node discovery and earnings optimization',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NodeHuntr - DePIN Node Discovery',
    description: 'Find and maximize your DePIN node earnings',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}

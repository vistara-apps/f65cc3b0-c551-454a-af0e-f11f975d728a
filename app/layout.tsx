import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from './components/ThemeProvider'
import { AuthProvider } from '../components/AuthProvider'
import { BottomNavigation } from '../components/BottomNavigation'

export const metadata: Metadata = {
  title: 'NodeHuntr',
  description: 'Find, track, and maximize your DePIN node earnings in real-time',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider defaultTheme="default">
            {children}
            <BottomNavigation />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

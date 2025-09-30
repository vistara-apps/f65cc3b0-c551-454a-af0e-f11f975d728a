'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { base } from 'viem/chains'
import { ReactNode } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'demo-app-id'}
      config={{
        loginMethods: ['wallet', 'email', 'sms'],
        appearance: {
          theme: 'dark',
          accentColor: '#22c55e',
          logo: '/favicon.ico',
        },
        embeddedWallets: {
          createOnLogin: true,
          requireUserPasswordOnCreate: false,
        },
        defaultChain: base,
        supportedChains: [base],
      }}
    >
      {children}
    </PrivyProvider>
  )
}


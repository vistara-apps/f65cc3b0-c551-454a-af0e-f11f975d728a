'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Map, TrendingUp, Trophy } from 'lucide-react'
import { cn } from '../lib/utils'

const navigationItems = [
  {
    label: 'Map',
    icon: Map,
    href: '/map',
  },
  {
    label: 'Earnings',
    icon: TrendingUp,
    href: '/earnings',
  },
  {
    label: 'Leaderboard',
    icon: Trophy,
    href: '/leaderboard',
  },
]

export function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-30">
      <div className="flex items-center justify-around px-4 py-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-0 flex-1",
                isActive
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}


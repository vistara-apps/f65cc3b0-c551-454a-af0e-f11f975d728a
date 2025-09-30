'use client'

import { Node } from '../lib/types'
import { Wifi, WifiOff, Star, Zap } from 'lucide-react'
import { cn } from '../lib/utils'

interface NodePinProps {
  node: Node
  onClick: (node: Node) => void
  isSelected?: boolean
}

export function NodePin({ node, onClick, isSelected }: NodePinProps) {
  const getPinColor = () => {
    if (node.status === 'online') {
      if (node.reward_rate_usd >= 12) return 'text-green-400' // High reward
      return 'text-green-500' // Normal online
    }
    if (node.status === 'offline') return 'text-red-500'
    return 'text-gray-500' // Unknown
  }

  const getPinIcon = () => {
    if (node.status === 'online') {
      if (node.reward_rate_usd >= 12) return <Star className="w-4 h-4" />
      return <Wifi className="w-4 h-4" />
    }
    if (node.status === 'offline') return <WifiOff className="w-4 h-4" />
    return <Zap className="w-4 h-4" />
  }

  const getNetworkColor = () => {
    switch (node.network_type) {
      case 'helium': return 'bg-blue-500'
      case 'xnet': return 'bg-purple-500'
      case 'geodnet': return 'bg-orange-500'
      case 'hivemapper': return 'bg-pink-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div
      className={cn(
        "relative cursor-pointer transform transition-all duration-200 hover:scale-110",
        isSelected && "scale-125"
      )}
      onClick={() => onClick(node)}
    >
      {/* Main pin */}
      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg",
        getPinColor(),
        isSelected && "ring-2 ring-accent ring-offset-2 ring-offset-dark"
      )}>
        {getPinIcon()}
      </div>

      {/* Network indicator */}
      <div className={cn(
        "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white",
        getNetworkColor()
      )} />

      {/* Reward rate badge for high-reward nodes */}
      {node.reward_rate_usd >= 12 && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black text-xs px-1 py-0.5 rounded font-bold whitespace-nowrap">
          ${node.reward_rate_usd.toFixed(0)}/hr
        </div>
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 rounded-full border-2 border-accent animate-pulse" />
      )}
    </div>
  )
}


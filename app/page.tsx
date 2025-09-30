'use client'

import React, { useState, useEffect } from 'react'
import { MapCanvas } from '@/components/MapCanvas'
import { BottomSheet } from '@/components/BottomSheet'
import { Node, MapFilter, UserLocation } from '@/lib/types'
import { MAP_FILTER } from '@/lib/constants'
import { usePrivyAuth } from '@/lib/privy'

// Mock data for demonstration
const mockNodes: Node[] = [
  {
    node_id: 'helium-1',
    network_type: 'helium',
    lat: 37.7749,
    lng: -122.4194,
    status: 'online',
    last_seen: new Date(),
    reward_rate_usd: 2.5,
    reliability_score: 0.95,
    total_verifications: 12,
    name: 'Downtown Hotspot',
    address: '123 Market St, San Francisco, CA',
    description: 'High-traffic urban hotspot with excellent coverage',
  },
  {
    node_id: 'xnet-1',
    network_type: 'xnet',
    lat: 37.7849,
    lng: -122.4094,
    status: 'online',
    last_seen: new Date(),
    reward_rate_usd: 1.8,
    reliability_score: 0.88,
    total_verifications: 8,
    name: 'XNET Gateway Alpha',
    address: '456 Mission St, San Francisco, CA',
  },
  {
    node_id: 'helium-2',
    network_type: 'helium',
    lat: 37.7649,
    lng: -122.4294,
    status: 'offline',
    last_seen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    reward_rate_usd: 3.2,
    reliability_score: 0.72,
    total_verifications: 5,
    name: 'Marina District Node',
    address: '789 Lombard St, San Francisco, CA',
  },
  {
    node_id: 'geodnet-1',
    network_type: 'geodnet',
    lat: 37.7549,
    lng: -122.4394,
    status: 'maintenance',
    last_seen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    reward_rate_usd: 4.1,
    reliability_score: 0.91,
    total_verifications: 15,
    name: 'Geodnet Satellite Link',
    address: '321 Geary St, San Francisco, CA',
  },
]

export default function HomePage() {
  const { authenticated, user } = usePrivyAuth()
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [userLocation, setUserLocation] = useState<UserLocation | undefined>()
  const [filters, setFilters] = useState<MapFilter>(MAP_FILTER)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(),
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          // Fallback to San Francisco for demo
          setUserLocation({
            lat: 37.7749,
            lng: -122.4194,
            timestamp: new Date(),
          })
        }
      )
    }
  }, [])

  const handleNodeSelect = (node: Node) => {
    setSelectedNode(node)
    setIsBottomSheetOpen(true)
  }

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false)
    setSelectedNode(null)
  }

  const handlePlanRoute = () => {
    // TODO: Implement route planning
    console.log('Planning route for node:', selectedNode?.node_id)
  }

  const handleReportIssue = () => {
    // TODO: Implement issue reporting
    console.log('Reporting issue for node:', selectedNode?.node_id)
  }

  const handleVerifyStatus = () => {
    // TODO: Implement status verification
    console.log('Verifying status for node:', selectedNode?.node_id)
  }

  const calculateDistance = (node: Node): number => {
    if (!userLocation) return 0

    const R = 6371e3 // Earth's radius in meters
    const φ1 = (userLocation.lat * Math.PI) / 180
    const φ2 = (node.lat * Math.PI) / 180
    const Δφ = ((node.lat - userLocation.lat) * Math.PI) / 180
    const Δλ = ((node.lng - userLocation.lng) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c // Distance in meters
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to NodeHuntr</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find, track, and maximize your DePIN node earnings in real-time
          </p>
          <div className="space-y-4">
            <button className="btn-primary">
              Connect Wallet to Get Started
            </button>
            <p className="text-sm text-muted-foreground">
              No wallet? Create one instantly with our embedded solution.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-card border-b px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">NodeHuntr</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {user?.farcaster_fid ? `User ${user.farcaster_fid}` : 'Explorer'}!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-medium">${user?.total_earnings_tracked || 0} tracked</p>
            <p className="text-xs text-muted-foreground">Total earnings</p>
          </div>
        </div>
      </header>

      {/* Map */}
      <div className="flex-1 relative">
        <MapCanvas
          nodes={mockNodes}
          userLocation={userLocation}
          selectedNode={selectedNode}
          onNodeSelect={handleNodeSelect}
          filters={filters}
          onFiltersChange={setFilters}
          className="w-full h-full"
        />
      </div>

      {/* Bottom Sheet */}
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={handleCloseBottomSheet}
        node={selectedNode}
        onPlanRoute={handlePlanRoute}
        onReportIssue={handleReportIssue}
        onVerifyStatus={handleVerifyStatus}
        distance={selectedNode ? calculateDistance(selectedNode) : undefined}
        userLocation={userLocation}
      />
    </div>
  )
}


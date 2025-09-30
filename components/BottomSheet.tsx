'use client'

import React, { useEffect, useRef } from 'react'
import { Node, BottomSheetProps } from '@/lib/types'
import { NodeStatusBadge, NetworkBadge } from './NodePin'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card } from './ui/card'
import {
  MapPin,
  DollarSign,
  Users,
  Clock,
  Star,
  Navigation,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface NodeBottomSheetProps extends BottomSheetProps {
  node: Node | null
  onPlanRoute?: () => void
  onReportIssue?: () => void
  onVerifyStatus?: () => void
  distance?: number // in meters
  userLocation?: { lat: number; lng: number }
}

export function BottomSheet({
  isOpen,
  onClose,
  node,
  onPlanRoute,
  onReportIssue,
  onVerifyStatus,
  distance,
  userLocation,
  snapPoints = [0.3, 0.6, 0.9],
  initialSnap = 0.6,
}: NodeBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [currentSnap, setCurrentSnap] = React.useState(initialSnap)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !node) return null

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`
    }
    return `${(meters / 1000).toFixed(1)}km`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'maintenance':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <Clock className="w-5 h-5 text-blue-500" />
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-out"
        style={{
          height: `${currentSnap * 100}vh`,
          maxHeight: '90vh',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1.5 bg-muted rounded-full" />
        </div>

        {/* Content */}
        <div className="px-6 pb-6 overflow-y-auto flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <NetworkBadge networkType={node.network_type} />
                <NodeStatusBadge status={node.status} />
              </div>
              <h2 className="text-xl font-bold">{node.name || `${node.network_type} Node`}</h2>
              {node.address && (
                <p className="text-muted-foreground text-sm flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {node.address}
                </p>
              )}
            </div>
            {getStatusIcon(node.status)}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">${node.reward_rate_usd.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">per hour</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{node.total_verifications}</p>
                  <p className="text-xs text-muted-foreground">verifications</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Distance and Time */}
          {distance && (
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{formatDistance(distance)} away</span>
                <span>•</span>
                <Clock className="w-4 h-4" />
                <span>{Math.round(distance / 83)} min walk</span>
              </div>
            </div>
          )}

          {/* Reliability Score */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Reliability</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium">
                  {(node.reliability_score * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${node.reliability_score * 100}%` }}
              />
            </div>
          </div>

          {/* Description */}
          {node.description && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">{node.description}</p>
            </div>
          )}

          {/* Last Seen */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Last seen: {new Date(node.last_seen).toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onPlanRoute}
              className="w-full"
              size="lg"
            >
              <Navigation className="w-5 h-5 mr-2" />
              Plan Route ($0.10)
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={onVerifyStatus}
                size="lg"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify Status
              </Button>

              <Button
                variant="outline"
                onClick={onReportIssue}
                size="lg"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report Issue
              </Button>
            </div>
          </div>

          {/* QR Code Section */}
          {node.qr_code_url && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium mb-3">Node QR Code</h3>
              <div className="bg-muted p-4 rounded-lg text-center">
                <img
                  src={node.qr_code_url}
                  alt="Node QR Code"
                  className="w-32 h-32 mx-auto"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Scan to connect or verify
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}


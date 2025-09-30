'use client'

import { Node } from '../lib/types'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Wifi, WifiOff, Star, MapPin, Clock, Users, DollarSign } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface NodeDetailsProps {
  node: Node
  onReportStatus: (node: Node, status: 'online' | 'offline') => void
  onPlanRoute: (node: Node) => void
}

export function NodeDetails({ node, onReportStatus, onPlanRoute }: NodeDetailsProps) {
  const getStatusIcon = () => {
    switch (node.status) {
      case 'online': return <Wifi className="w-5 h-5 text-green-500" />
      case 'offline': return <WifiOff className="w-5 h-5 text-red-500" />
      default: return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusColor = () => {
    switch (node.status) {
      case 'online': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'offline': return 'bg-red-500/10 text-red-400 border-red-500/20'
      default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    }
  }

  const getNetworkName = () => {
    switch (node.network_type) {
      case 'helium': return 'Helium'
      case 'xnet': return 'XNET'
      case 'geodnet': return 'Geodnet'
      case 'hivemapper': return 'Hivemapper'
      default: return node.network_type.toUpperCase()
    }
  }

  const getReliabilityColor = () => {
    if (node.reliability_score >= 0.9) return 'text-green-400'
    if (node.reliability_score >= 0.7) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">
            {getNetworkName()} Node
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Node ID: {node.node_id}
          </p>
        </div>
        <Badge variant="outline" className={getStatusColor()}>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="capitalize">{node.status}</span>
          </div>
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-sm text-muted-foreground">Reward Rate</p>
                <p className="text-lg font-semibold text-green-400">
                  ${node.reward_rate_usd.toFixed(2)}/hr
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-sm text-muted-foreground">Verifications</p>
                <p className="text-lg font-semibold text-blue-400">
                  {node.total_verifications}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <div>
                <p className="text-sm text-muted-foreground">Reliability</p>
                <p className={`text-lg font-semibold ${getReliabilityColor()}`}>
                  {(node.reliability_score * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <div>
                <p className="text-sm text-muted-foreground">Last Seen</p>
                <p className="text-sm font-semibold text-purple-400">
                  {formatDistanceToNow(node.last_seen, { addSuffix: true })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="text-sm font-medium">
                {node.lat.toFixed(6)}, {node.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onReportStatus(node, node.status === 'online' ? 'offline' : 'online')}
        >
          Report Status
        </Button>
        <Button
          variant="micropay"
          className="flex-1"
          onClick={() => onPlanRoute(node)}
        >
          Plan Route ($0.10)
        </Button>
      </div>

      {/* QR Code Section */}
      {node.qr_code_url && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Node QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <img
                src={node.qr_code_url}
                alt={`QR Code for ${node.node_id}`}
                className="w-32 h-32 border border-border rounded"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Scan to verify node status
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


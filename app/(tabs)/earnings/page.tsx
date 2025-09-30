'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react'
import { mockEarningsRecords, mockUsers } from '../../../lib/mock-data'

export default function EarningsPage() {
  const userEarnings = mockEarningsRecords.filter(record => record.user_fid === 12345)
  const totalEarnings = userEarnings
    .filter(record => record.status === 'confirmed')
    .reduce((sum, record) => sum + record.amount_usd, 0)

  const pendingEarnings = userEarnings
    .filter(record => record.status === 'pending')
    .reduce((sum, record) => sum + record.amount_usd, 0)

  const disputedEarnings = userEarnings
    .filter(record => record.status === 'disputed' || record.status === 'missing')
    .reduce((sum, record) => sum + record.amount_usd, 0)

  const earningsByNetwork = userEarnings.reduce((acc, record) => {
    acc[record.network_type] = (acc[record.network_type] || 0) + record.amount_usd
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Earnings Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your DePIN earnings across all networks
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Confirmed Earnings</p>
                  <p className="text-3xl font-bold text-green-400">
                    ${totalEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-lg font-semibold text-yellow-400">
                      ${pendingEarnings.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-2 bg-yellow-500/10 rounded-full">
                    <TrendingUp className="w-4 h-4 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Disputed</p>
                    <p className="text-lg font-semibold text-red-400">
                      ${disputedEarnings.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-2 bg-red-500/10 rounded-full">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Network Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Earnings by Network</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(earningsByNetwork).map(([network, amount]) => (
              <div key={network} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="font-medium capitalize">{network}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${amount.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    {((amount / totalEarnings) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {userEarnings.slice(0, 5).map((record) => (
              <div key={`${record.node_id}-${record.reported_at.getTime()}`} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    record.status === 'confirmed' ? 'bg-green-400' :
                    record.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                  <div>
                    <p className="font-medium capitalize">{record.network_type} Node</p>
                    <p className="text-sm text-muted-foreground">
                      {record.reported_at.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${record.amount_usd.toFixed(2)}</p>
                  <Badge variant="outline" className={
                    record.status === 'confirmed' ? 'border-green-500/20 text-green-400' :
                    record.status === 'pending' ? 'border-yellow-500/20 text-yellow-400' :
                    'border-red-500/20 text-red-400'
                  }>
                    {record.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Dispute Actions */}
        {disputedEarnings > 0 && (
          <Card className="border-red-500/20 bg-red-500/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="font-semibold text-red-400">Missing Earnings Detected</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                We found ${disputedEarnings.toFixed(2)} in missing earnings. Verify with on-chain data to dispute.
              </p>
              <Button variant="outline" className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10">
                Verify Missing Earnings ($0.25)
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


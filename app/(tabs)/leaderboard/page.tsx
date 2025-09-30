'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import { Trophy, Medal, Award, Crown, TrendingUp } from 'lucide-react'
import { mockLeaderboard } from '../../../lib/mock-data'

export default function LeaderboardPage() {
  const [selectedRegion, setSelectedRegion] = useState('san_francisco')
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false)

  const regionData = mockLeaderboard.filter(entry => entry.region === selectedRegion)
  const displayData = showFullLeaderboard ? regionData : regionData.slice(0, 10)

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />
      case 2: return <Medal className="w-5 h-5 text-gray-400" />
      case 3: return <Award className="w-5 h-5 text-amber-600" />
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    if (rank === 2) return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    if (rank === 3) return 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    return 'bg-muted text-muted-foreground border-border'
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
          <p className="text-muted-foreground mt-1">
            Top DePIN earners in your area
          </p>
        </div>

        {/* Region Selector */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              {['san_francisco', 'oakland', 'berkeley'].map((region) => (
                <Button
                  key={region}
                  variant={selectedRegion === region ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedRegion(region)}
                  className="capitalize"
                >
                  {region.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4">
          {displayData.slice(0, 3).map((entry, index) => {
            const rank = entry.rank
            const isFirst = rank === 1
            const isSecond = rank === 2
            const isThird = rank === 3

            return (
              <Card key={entry.user_fid_anon} className={`text-center ${
                isFirst ? 'border-yellow-500/20 bg-yellow-500/5' :
                isSecond ? 'border-gray-500/20 bg-gray-500/5' :
                'border-amber-500/20 bg-amber-500/5'
              }`}>
                <CardContent className="p-4">
                  <div className="flex justify-center mb-2">
                    {getRankIcon(rank)}
                  </div>
                  <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center">
                    <span className="text-sm font-bold">
                      {entry.user_fid_anon.slice(-2).toUpperCase()}
                    </span>
                  </div>
                  <p className="font-semibold text-sm">{entry.user_fid_anon}</p>
                  <p className="text-lg font-bold text-green-400 mt-1">
                    ${entry.total_earnings_30d.toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.nodes_verified} verified
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Full Rankings</CardTitle>
              {!showFullLeaderboard && (
                <Button
                  variant="micropay"
                  size="sm"
                  onClick={() => setShowFullLeaderboard(true)}
                >
                  View All ($0.50/month)
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {displayData.map((entry) => (
              <div key={entry.user_fid_anon} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(entry.rank)}
                  </div>
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">
                      {entry.user_fid_anon.slice(-2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{entry.user_fid_anon}</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.nodes_verified} nodes verified
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400">
                    ${entry.total_earnings_30d.toFixed(0)}
                  </p>
                  <Badge variant="outline" className={getRankBadgeColor(entry.rank)}>
                    Rank #{entry.rank}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stats Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Your Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-400">$1,250</p>
                <p className="text-sm text-muted-foreground">30-Day Earnings</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-400">#2</p>
                <p className="text-sm text-muted-foreground">Your Rank</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-400">45</p>
                <p className="text-sm text-muted-foreground">Nodes Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Share Button */}
        <Button variant="outline" className="w-full" size="lg">
          <Trophy className="w-4 h-4 mr-2" />
          Share Your Rank
        </Button>
      </div>
    </div>
  )
}


'use client';

import { useState } from 'react';
import { LeaderboardEntry } from '@/lib/types';
import { Trophy, TrendingUp, Users, Crown, Lock } from 'lucide-react';
import { useMiniKit } from '@coinbase/onchainkit';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export function Leaderboard({ entries }: LeaderboardProps) {
  const [hasPremium, setHasPremium] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const { pay } = useMiniKit();

  const handleUnlockPremium = async () => {
    setUnlocking(true);
    try {
      const paymentResult = await pay({
        amount: '0.5',
        currency: 'USD',
        recipient: process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        metadata: {
          type: 'leaderboard_premium',
          duration: 'monthly',
          region: 'San Francisco'
        }
      });

      if (paymentResult.success) {
        setHasPremium(true);
        alert('🎉 Premium leaderboard unlocked! You now have access to full rankings and detailed stats.');
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Premium unlock error:', error);
      alert('Unlock failed. Please try again.');
    } finally {
      setUnlocking(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient mb-2">Leaderboard</h1>
        <p className="text-text-muted">Top earners in your region</p>
      </div>

      {/* Region Selector */}
      <div className="glass-card p-4">
        <label className="text-sm text-text-muted mb-2 block">Region</label>
        <select className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-fg">
          <option>San Francisco (5mi)</option>
          <option>Oakland</option>
          <option>San Jose</option>
          <option>Berkeley</option>
        </select>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4">
        {entries.slice(0, 3).map((entry, index) => (
          <div
            key={entry.rank}
            className={`glass-card p-4 text-center ${
              index === 0 ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-accent/30' : ''
            }`}
          >
            <div className="flex justify-center mb-2">
              {index === 0 && <Trophy className="w-8 h-8 text-accent" />}
              {index === 1 && <Trophy className="w-7 h-7 text-gray-400" />}
              {index === 2 && <Trophy className="w-6 h-6 text-orange-400" />}
            </div>
            <p className="text-2xl font-bold mb-1">#{entry.rank}</p>
            <p className="text-sm text-text-muted mb-2">{entry.user_fid_anon}</p>
            <p className="text-lg font-bold text-accent">
              ${entry.total_earnings_30d.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Full Leaderboard */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Rankings</h2>
            {hasPremium && <Crown className="w-5 h-5 text-accent" />}
          </div>
          {!hasPremium && (
            <button
              onClick={handleUnlockPremium}
              disabled={unlocking}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              {unlocking ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Unlocking...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Unlock Full List ($0.50/mo)
                </>
              )}
            </button>
          )}
        </div>

        <div className="space-y-2">
          {entries.slice(0, hasPremium ? entries.length : 5).map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                entry.user_fid_anon === 'You'
                  ? 'bg-accent/10 border border-accent/30'
                  : 'bg-surface-hover hover:bg-surface'
              } ${!hasPremium && entry.rank > 5 ? 'opacity-50 blur-sm' : ''}`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-text-muted w-8">
                  {entry.rank}
                </span>
                <div>
                  <p className="font-medium">
                    {entry.user_fid_anon}
                    {entry.user_fid_anon === 'You' && (
                      <span className="ml-2 text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                        You
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-text-muted mt-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {entry.nodes_verified} verified
                    </span>
                    {hasPremium && (
                      <span className="text-accent">
                        ${entry.total_earnings_30d.toFixed(2)}/30d
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-accent">
                  ${entry.total_earnings_30d.toFixed(2)}
                </p>
                <p className="text-xs text-text-muted">30d earnings</p>
                {!hasPremium && entry.rank > 5 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-text-muted" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {!hasPremium && entries.length > 5 && (
            <div className="text-center py-4">
              <p className="text-sm text-text-muted mb-2">
                +{entries.length - 5} more rankings available
              </p>
              <button
                onClick={handleUnlockPremium}
                className="btn-primary text-sm px-4 py-2"
              >
                Unlock Premium ($0.50/mo)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Share CTA */}
      <div className="glass-card p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold mb-1">Share Your Rank</h3>
            <p className="text-sm text-text-muted">
              Show off your position to friends on Farcaster
            </p>
          </div>
          <button className="btn-primary text-sm px-4 py-2 whitespace-nowrap">
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

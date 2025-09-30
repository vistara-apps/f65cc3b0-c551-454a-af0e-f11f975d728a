'use client';

import { EarningsRecord } from '@/lib/types';
import { DollarSign, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface EarningsDashboardProps {
  earnings: EarningsRecord[];
}

export function EarningsDashboard({ earnings }: EarningsDashboardProps) {
  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount_usd, 0);
  const confirmedEarnings = earnings
    .filter((e) => e.status === 'confirmed')
    .reduce((sum, e) => sum + e.amount_usd, 0);
  const pendingEarnings = earnings
    .filter((e) => e.status === 'pending')
    .reduce((sum, e) => sum + e.amount_usd, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient mb-2">Earnings</h1>
        <p className="text-text-muted">Track your DePIN rewards across all networks</p>
      </div>

      {/* Total Earnings Card */}
      <div className="glass-card p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-accent/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-accent/20 rounded-lg">
            <DollarSign className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-sm text-text-muted">Total Earnings (30d)</p>
            <p className="text-4xl font-bold text-accent">
              ${totalEarnings.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-success">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+23.5% from last month</span>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="metric-card">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span className="text-xs text-text-muted">Confirmed</span>
          </div>
          <p className="text-2xl font-bold text-success">
            ${confirmedEarnings.toFixed(2)}
          </p>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-warning" />
            <span className="text-xs text-text-muted">Pending</span>
          </div>
          <p className="text-2xl font-bold text-warning">
            ${pendingEarnings.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Recent Earnings */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {earnings.map((earning, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-surface-hover rounded-lg"
            >
              <div>
                <p className="font-medium capitalize">{earning.network_type}</p>
                <p className="text-xs text-text-muted">
                  {new Date(earning.reported_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-accent">
                  ${earning.amount_usd.toFixed(2)}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    earning.status === 'confirmed'
                      ? 'bg-success/20 text-success'
                      : 'bg-warning/20 text-warning'
                  }`}
                >
                  {earning.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verification CTA */}
      <div className="glass-card p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/20 rounded-lg">
            <AlertCircle className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold mb-2">Missing Earnings?</h3>
            <p className="text-sm text-text-muted mb-4">
              Verify your earnings across all networks to ensure you're getting paid correctly.
            </p>
            <button className="btn-primary text-sm px-4 py-2">
              Verify Earnings ($0.25)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

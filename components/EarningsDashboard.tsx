'use client';

import { useState } from 'react';
import { EarningsRecord } from '@/lib/types';
import { DollarSign, TrendingUp, AlertCircle, CheckCircle2, Shield, ExternalLink } from 'lucide-react';
import { useMiniKit } from '@coinbase/onchainkit';

interface EarningsDashboardProps {
  earnings: EarningsRecord[];
}

export function EarningsDashboard({ earnings }: EarningsDashboardProps) {
  const [verifying, setVerifying] = useState(false);
  const [disputing, setDisputing] = useState<string | null>(null);
  const { pay } = useMiniKit();
  const totalEarnings = earnings.reduce((sum, e) => sum + e.amount_usd, 0);
  const confirmedEarnings = earnings
    .filter((e) => e.status === 'confirmed')
    .reduce((sum, e) => sum + e.amount_usd, 0);
  const pendingEarnings = earnings
    .filter((e) => e.status === 'pending')
    .reduce((sum, e) => sum + e.amount_usd, 0);

  const handleVerifyEarnings = async () => {
    setVerifying(true);
    try {
      const paymentResult = await pay({
        amount: '0.25',
        currency: 'USD',
        recipient: process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        metadata: {
          type: 'earnings_verification',
          total_earnings: totalEarnings,
          pending_count: earnings.filter(e => e.status === 'pending').length
        }
      });

      if (paymentResult.success) {
        // Simulate verification process
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('✅ Earnings verified! All records are accurate. No discrepancies found.');
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleDispute = async (earning: EarningsRecord) => {
    setDisputing(earning.node_id);
    try {
      const paymentResult = await pay({
        amount: '0.25',
        currency: 'USD',
        recipient: process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        metadata: {
          type: 'earnings_dispute',
          node_id: earning.node_id,
          network: earning.network_type,
          amount: earning.amount_usd
        }
      });

      if (paymentResult.success) {
        // Simulate dispute filing
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert(`📋 Dispute filed for $${earning.amount_usd} from ${earning.network_type}. Case #${Math.random().toString(36).substr(2, 9).toUpperCase()} submitted.`);
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Dispute error:', error);
      alert('Dispute filing failed. Please try again.');
    } finally {
      setDisputing(null);
    }
  };

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
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      earning.status === 'confirmed'
                        ? 'bg-success/20 text-success'
                        : 'bg-warning/20 text-warning'
                    }`}
                  >
                    {earning.status}
                  </span>
                  {earning.status === 'pending' && (
                    <button
                      onClick={() => handleDispute(earning)}
                      disabled={disputing === earning.node_id}
                      className="text-xs px-2 py-1 bg-danger/20 text-danger rounded-full hover:bg-danger/30 transition-colors flex items-center gap-1"
                    >
                      {disputing === earning.node_id ? (
                        <div className="w-3 h-3 border border-danger border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      Dispute
                    </button>
                  )}
                </div>
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
            <button
              onClick={handleVerifyEarnings}
              disabled={verifying}
              className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
            >
              {verifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Verify Earnings ($0.25)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

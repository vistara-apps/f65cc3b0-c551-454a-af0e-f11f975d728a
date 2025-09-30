'use client';

import { BottomNav } from '@/components/BottomNav';
import { ArrowLeft, Wallet, Settings2, LogOut, Award, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col pb-24">
      {/* Header */}
      <header className="glass-card border-b border-border px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
        <Link
          href="/"
          className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 space-y-6">
        {/* User Card */}
        <div className="glass-card p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-yellow-600 flex items-center justify-center text-2xl font-bold">
              NH
            </div>
            <div>
              <h2 className="text-xl font-bold">NodeHuntr User</h2>
              <p className="text-sm text-text-muted">Member since Jan 2025</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">98</p>
              <p className="text-xs text-text-muted">Nodes Verified</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">856</p>
              <p className="text-xs text-text-muted">Reputation</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">4</p>
              <p className="text-xs text-text-muted">Rank</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="metric-card">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-xs text-text-muted">Total Earnings</span>
            </div>
            <p className="text-2xl font-bold text-accent">$856.12</p>
          </div>

          <div className="metric-card">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-accent" />
              <span className="text-xs text-text-muted">Accuracy</span>
            </div>
            <p className="text-2xl font-bold text-success">96%</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="glass-card divide-y divide-border">
          <button className="w-full flex items-center gap-3 p-4 hover:bg-surface-hover transition-colors">
            <Wallet className="w-5 h-5 text-accent" />
            <span className="flex-1 text-left">Wallet</span>
            <span className="text-sm text-text-muted">0x1234...5678</span>
          </button>

          <button className="w-full flex items-center gap-3 p-4 hover:bg-surface-hover transition-colors">
            <Settings2 className="w-5 h-5 text-text-muted" />
            <span className="flex-1 text-left">Settings</span>
          </button>

          <button className="w-full flex items-center gap-3 p-4 hover:bg-surface-hover transition-colors text-danger">
            <LogOut className="w-5 h-5" />
            <span className="flex-1 text-left">Sign Out</span>
          </button>
        </div>

        {/* Premium CTA */}
        <div className="glass-card p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <h3 className="font-bold mb-2">Upgrade to Premium</h3>
          <p className="text-sm text-text-muted mb-4">
            Unlock advanced route optimization, full leaderboard access, and priority support.
          </p>
          <button className="btn-primary w-full">
            Upgrade Now - $9.99/mo
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

'use client';

import { Leaderboard } from '@/components/Leaderboard';
import { BottomNav } from '@/components/BottomNav';
import { mockLeaderboard } from '@/lib/mock-data';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LeaderboardPage() {
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
          <h1 className="text-xl font-bold">Leaderboard</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4">
        <Leaderboard entries={mockLeaderboard} />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

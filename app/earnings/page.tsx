'use client';

import { EarningsDashboard } from '@/components/EarningsDashboard';
import { BottomNav } from '@/components/BottomNav';
import { mockEarnings } from '@/lib/mock-data';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EarningsPage() {
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
          <h1 className="text-xl font-bold">Earnings</h1>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4">
        <EarningsDashboard earnings={mockEarnings} />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

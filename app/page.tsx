'use client';

import { useState } from 'react';
import { MapView } from '@/components/MapView';
import { NodeDetailsSheet } from '@/components/NodeDetailsSheet';
import { BottomNav } from '@/components/BottomNav';
import { mockNodes } from '@/lib/mock-data';
import { Node } from '@/lib/types';
import { Menu, Bell } from 'lucide-react';

export default function HomePage() {
  const [selectedNode, setSelectedNode] = useState<Node | undefined>();

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="glass-card border-b border-border px-4 py-3 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-surface-hover rounded-lg transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gradient">NodeHuntr</h1>
            <p className="text-xs text-text-muted">Find DePIN nodes near you</p>
          </div>
        </div>
        <button className="p-2 hover:bg-surface-hover rounded-lg transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
        </button>
      </header>

      {/* Map */}
      <main className="flex-1 relative">
        <MapView
          nodes={mockNodes}
          onNodeSelect={setSelectedNode}
          selectedNode={selectedNode}
        />

        {/* Quick Stats Overlay */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-card px-4 py-2 flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-text-muted">Nearby Nodes</p>
            <p className="text-lg font-bold text-accent">{mockNodes.length}</p>
          </div>
          <div className="w-px h-8 bg-border"></div>
          <div className="text-center">
            <p className="text-xs text-text-muted">Avg Reward</p>
            <p className="text-lg font-bold text-accent">
              ${(mockNodes.reduce((sum, n) => sum + n.reward_rate_usd, 0) / mockNodes.length).toFixed(1)}/hr
            </p>
          </div>
        </div>
      </main>

      {/* Node Details Sheet */}
      {selectedNode && (
        <NodeDetailsSheet
          node={selectedNode}
          onClose={() => setSelectedNode(undefined)}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

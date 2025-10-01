'use client';

import { useState } from 'react';
import { NodeScanner } from '@/components/NodeScanner';
import { NodeDetailsSheet } from '@/components/NodeDetailsSheet';
import { BottomNav } from '@/components/BottomNav';
import { Node } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ScanPage() {
  const [selectedNode, setSelectedNode] = useState<Node | undefined>();
  const [showScanner, setShowScanner] = useState(true);

  const handleNodeFound = (node: Node) => {
    setSelectedNode(node);
    setShowScanner(false);
  };

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
          <h1 className="text-xl font-bold">Scan Node</h1>
          <p className="text-xs text-text-muted">Verify nodes instantly</p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4">
        {showScanner && (
          <NodeScanner
            onNodeFound={handleNodeFound}
            onClose={() => setShowScanner(false)}
          />
        )}

        {!showScanner && !selectedNode && (
          <div className="text-center py-12">
            <p className="text-text-muted mb-4">Ready to scan nodes?</p>
            <button
              onClick={() => setShowScanner(true)}
              className="btn-primary"
            >
              Start Scanning
            </button>
          </div>
        )}
      </main>

      {/* Node Details Sheet */}
      {selectedNode && (
        <NodeDetailsSheet
          node={selectedNode}
          onClose={() => {
            setSelectedNode(undefined);
            setShowScanner(true);
          }}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}


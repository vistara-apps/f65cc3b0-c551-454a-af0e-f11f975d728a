'use client';

import { useState, useEffect } from 'react';
import { MapView } from '@/components/MapView';
import { NodeDetailsSheet } from '@/components/NodeDetailsSheet';
import { RoutePlanner } from '@/components/RoutePlanner';
import { BottomNav } from '@/components/BottomNav';
import { mockNodes } from '@/lib/mock-data';
import { Node, Route } from '@/lib/types';
import { Menu, Bell, Route as RouteIcon } from 'lucide-react';

export default function HomePage() {
  const [selectedNode, setSelectedNode] = useState<Node | undefined>();
  const [showRoutePlanner, setShowRoutePlanner] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | undefined>();
  const [currentRoute, setCurrentRoute] = useState<Route | undefined>();

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Fallback to San Francisco for demo
          setUserLocation([-122.4194, 37.7749]);
        }
      );
    }
  }, []);

  const handleRouteSelect = (route: Route) => {
    setCurrentRoute(route);
    setShowRoutePlanner(false);
    // Could show route on map here
    alert(`Route unlocked! Visit ${route.nodes.length} nodes to earn ~$${route.estimated_earnings_usd.toFixed(1)}`);
  };

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
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRoutePlanner(true)}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
            title="Plan Route"
          >
            <RouteIcon className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-surface-hover rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Map */}
      <main className="flex-1 relative">
        <MapView
          nodes={mockNodes}
          onNodeSelect={setSelectedNode}
          selectedNode={selectedNode}
          route={currentRoute}
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

        {/* Current Route Info */}
        {currentRoute && (
          <div className="absolute bottom-24 left-4 right-4 glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Active Route</h3>
              <button
                onClick={() => setCurrentRoute(undefined)}
                className="text-text-muted hover:text-fg"
              >
                Clear
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-text-muted">Nodes</p>
                <p className="font-bold">{currentRoute.nodes.length}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Distance</p>
                <p className="font-bold">{currentRoute.total_distance_km.toFixed(1)}km</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Earnings</p>
                <p className="font-bold text-accent">${currentRoute.estimated_earnings_usd.toFixed(1)}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Node Details Sheet */}
      {selectedNode && (
        <NodeDetailsSheet
          node={selectedNode}
          onClose={() => setSelectedNode(undefined)}
          onRouteSelected={handleRouteSelect}
          allNodes={mockNodes}
        />
      )}

      {/* Route Planner */}
      {showRoutePlanner && (
        <RoutePlanner
          nodes={mockNodes}
          userLocation={userLocation}
          onRouteSelect={handleRouteSelect}
          onClose={() => setShowRoutePlanner(false)}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

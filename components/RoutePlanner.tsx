'use client';

import { useState, useEffect } from 'react';
import { Node, Route } from '@/lib/types';
import { mockNodes } from '@/lib/mock-data';
import { MapPin, Clock, DollarSign, Navigation, Zap } from 'lucide-react';
import { useMiniKit } from '@coinbase/onchainkit';

interface RoutePlannerProps {
  nodes: Node[];
  userLocation?: [number, number];
  onRouteSelected: (route: Route) => void;
  onClose: () => void;
}

interface RouteOption {
  id: string;
  name: string;
  nodes: Node[];
  distance: number; // km
  estimatedTime: number; // minutes
  estimatedEarnings: number; // USD
  optimization: 'quick' | 'balanced' | 'max_earnings';
}

export function RoutePlanner({ nodes, userLocation, onRouteSelected, onClose }: RoutePlannerProps) {
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<RouteOption | null>(null);
  const [calculating, setCalculating] = useState(true);
  const { pay } = useMiniKit();

  useEffect(() => {
    calculateRoutes();
  }, [nodes, userLocation]);

  const calculateRoutes = async () => {
    setCalculating(true);

    // Simulate route calculation
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Filter active nodes with rewards
    const activeNodes = nodes.filter(node =>
      node.status === 'active' && node.reward_rate_usd > 0
    );

    // Generate route options
    const options: RouteOption[] = [
      {
        id: 'quick',
        name: 'Quick Route',
        nodes: activeNodes.slice(0, 3),
        distance: 2.1,
        estimatedTime: 25,
        estimatedEarnings: 8.50,
        optimization: 'quick'
      },
      {
        id: 'balanced',
        name: 'Balanced Route',
        nodes: activeNodes.slice(0, 5),
        distance: 3.8,
        estimatedTime: 45,
        estimatedEarnings: 15.20,
        optimization: 'balanced'
      },
      {
        id: 'max_earnings',
        name: 'Max Earnings Route',
        nodes: activeNodes.slice(0, 8),
        distance: 6.2,
        estimatedTime: 75,
        estimatedEarnings: 28.90,
        optimization: 'max_earnings'
      }
    ];

    setRouteOptions(options);
    setCalculating(false);
  };

  const handleRouteSelect = async (option: RouteOption) => {
    setSelectedOption(option);

    try {
      const paymentResult = await pay({
        amount: '0.10',
        currency: 'USD',
        recipient: process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        metadata: {
          type: 'route_planning',
          route_id: option.id,
          node_count: option.nodes.length,
          estimated_earnings: option.estimatedEarnings,
          distance: option.distance
        }
      });

      if (paymentResult.success) {
        const route: Route = {
          id: option.id,
          user_fid: 'mock-user', // In production, get from auth
          nodes: option.nodes,
          total_distance_km: option.distance,
          estimated_earnings_usd: option.estimatedEarnings,
          estimated_time_minutes: option.estimatedTime,
          optimization_algorithm: option.optimization,
          payment_tx_hash: paymentResult.transactionHash || 'mock-tx-hash',
          created_at: new Date().toISOString()
        };

        onRouteSelected(route);
        onClose();
      } else {
        alert('Payment failed. Please try again.');
        setSelectedOption(null);
      }
    } catch (error) {
      console.error('Route payment error:', error);
      alert('Payment failed. Please try again.');
      setSelectedOption(null);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
      <div className="glass-card rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gradient">Plan Route</h2>
            <p className="text-sm text-text-muted">
              AI-optimized routes for maximum earnings
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* Loading State */}
        {calculating && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-semibold mb-2">Calculating Routes</p>
            <p className="text-sm text-text-muted">
              Finding optimal paths for maximum earnings...
            </p>
          </div>
        )}

        {/* Route Options */}
        {!calculating && routeOptions.length > 0 && (
          <div className="space-y-4">
            {routeOptions.map((option) => (
              <div
                key={option.id}
                className="glass-card p-4 hover:bg-surface-hover transition-colors cursor-pointer"
                onClick={() => handleRouteSelect(option)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{option.name}</h3>
                    <p className="text-sm text-text-muted">
                      {option.nodes.length} nodes • {option.optimization.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-accent">
                      ${option.estimatedEarnings.toFixed(2)}
                    </p>
                    <p className="text-xs text-text-muted">estimated earnings</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{option.distance.toFixed(1)}km</p>
                      <p className="text-xs text-text-muted">distance</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-warning" />
                    <div>
                      <p className="text-sm font-medium">{option.estimatedTime}min</p>
                      <p className="text-xs text-text-muted">time</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-success" />
                    <div>
                      <p className="text-sm font-medium">${(option.estimatedEarnings / option.estimatedTime * 60).toFixed(2)}/hr</p>
                      <p className="text-xs text-text-muted">rate</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-accent" />
                    <span className="text-sm text-accent font-medium">
                      ${(option.estimatedEarnings / option.distance).toFixed(2)} per km
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRouteSelect(option);
                    }}
                    disabled={selectedOption?.id === option.id}
                    className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
                  >
                    {selectedOption?.id === option.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Navigation className="w-4 h-4" />
                        Start Route ($0.10)
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Routes Found */}
        {!calculating && routeOptions.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-text-muted" />
            <p className="text-lg font-semibold mb-2">No Routes Available</p>
            <p className="text-sm text-text-muted mb-4">
              No active nodes found in your area. Try expanding your search radius.
            </p>
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Close
            </button>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 p-3 bg-surface-hover rounded-lg">
          <p className="text-xs text-text-muted text-center">
            💡 Routes are optimized for earnings per hour. Premium routes include turn-by-turn navigation.
          </p>
        </div>
      </div>
    </div>
  );
}


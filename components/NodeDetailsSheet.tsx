'use client';

import { Node, Route } from '@/lib/types';
import { X, MapPin, DollarSign, Activity, Users, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { RoutePlanner } from './RoutePlanner';

interface NodeDetailsSheetProps {
  node: Node;
  onClose: () => void;
  onRouteSelected?: (route: Route) => void;
  allNodes?: Node[];
}

export function NodeDetailsSheet({ node, onClose, onRouteSelected, allNodes = [] }: NodeDetailsSheetProps) {
  const [isReporting, setIsReporting] = useState(false);
  const [showRoutePlanner, setShowRoutePlanner] = useState(false);

  const handleReport = async () => {
    setIsReporting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsReporting(false);
    alert('Status reported! You earned 50 tokens 🎉');
  };

  const handlePlanRoute = () => {
    setShowRoutePlanner(true);
  };

  const handleRouteSelected = (route: Route) => {
    if (onRouteSelected) {
      onRouteSelected(route);
    }
    setShowRoutePlanner(false);
    onClose();
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
      <div className="glass-card rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gradient">
              {node.name || `Node ${node.id}`}
            </h2>
            <p className="text-sm text-text-muted capitalize">
              {node.network_type} Network
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 mb-6">
          <div
            className={`w-3 h-3 rounded-full ${
              node.status === 'active' ? 'bg-success' : 'bg-gray-500'
            } animate-pulse`}
          ></div>
          <span className="text-sm font-medium capitalize">{node.status}</span>
          <span className="text-xs text-text-muted">
            Last seen: {new Date(node.last_seen).toLocaleTimeString()}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="metric-card">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-accent" />
              <span className="text-xs text-text-muted">Reward Rate</span>
            </div>
            <p className="text-2xl font-bold text-accent">
              ${node.reward_rate_usd}
              <span className="text-sm text-text-muted">/hr</span>
            </p>
          </div>

          <div className="metric-card">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-success" />
              <span className="text-xs text-text-muted">Reliability</span>
            </div>
            <p className="text-2xl font-bold text-success">
              {node.reliability_score}%
            </p>
          </div>

          <div className="metric-card">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-xs text-text-muted">Verifications</span>
            </div>
            <p className="text-2xl font-bold">{node.total_verifications}</p>
          </div>

          <div className="metric-card">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-warning" />
              <span className="text-xs text-text-muted">Distance</span>
            </div>
            <p className="text-2xl font-bold">
              0.3<span className="text-sm text-text-muted">mi</span>
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="glass-card p-4 mb-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-accent mt-1" />
            <div>
              <p className="font-medium mb-1">Location</p>
              <p className="text-sm text-text-muted">
                {node.lat.toFixed(4)}, {node.lng.toFixed(4)}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${node.lat},${node.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline flex items-center gap-1 mt-2"
              >
                Open in Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleReport}
            disabled={isReporting}
            className="w-full btn-secondary"
          >
            {isReporting ? 'Reporting...' : 'Report Status (Free)'}
          </button>
          <button onClick={handlePlanRoute} className="w-full btn-primary">
            Plan Route ($0.10)
          </button>
        </div>

        {/* Community Notes */}
        <div className="mt-6 p-4 bg-surface-hover rounded-lg">
          <p className="text-xs text-text-muted">
            💡 <strong>Community Tip:</strong> This node has been consistently
            paying out for the last 30 days. Best time to visit: 9am-11am.
          </p>
        </div>
      </div>

      {/* Route Planner */}
      {showRoutePlanner && (
        <RoutePlanner
          nodes={allNodes}
          onRouteSelected={handleRouteSelected}
          onClose={() => setShowRoutePlanner(false)}
        />
      )}
    </div>
  );
}

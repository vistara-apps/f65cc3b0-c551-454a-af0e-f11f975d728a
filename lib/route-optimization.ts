import { Node, Route } from './types';
import distance from '@turf/distance';
import { point } from '@turf/helpers';

export interface RouteOptions {
  maxNodes?: number;
  maxDistance?: number; // in kilometers
  maxTime?: number; // in minutes
  userLocation?: [number, number]; // [lng, lat]
  optimization: 'earnings' | 'distance' | 'time';
}

export interface OptimizedRoute extends Route {
  waypoints: [number, number][];
  turnByTurn?: any[]; // Mapbox directions response
}

/**
 * Calculate optimal route using nearest neighbor heuristic with earnings optimization
 */
export function optimizeRoute(nodes: Node[], options: RouteOptions): OptimizedRoute {
  const {
    maxNodes = 5,
    maxDistance = 10, // 10km default
    maxTime = 120, // 2 hours default
    userLocation,
    optimization = 'earnings'
  } = options;

  if (nodes.length === 0) {
    throw new Error('No nodes available for route planning');
  }

  // Filter nodes within distance limit
  let availableNodes = nodes.filter(node => node.status === 'active');

  if (userLocation) {
    availableNodes = availableNodes.filter(node => {
      const nodePoint = point([node.lng, node.lat]);
      const userPoint = point(userLocation);
      const dist = distance(userPoint, nodePoint, { units: 'kilometers' });
      return dist <= maxDistance;
    });
  }

  if (availableNodes.length === 0) {
    throw new Error('No active nodes found within distance limit');
  }

  // Sort by optimization criteria
  const sortedNodes = availableNodes.sort((a, b) => {
    switch (optimization) {
      case 'earnings':
        return b.reward_rate_usd - a.reward_rate_usd;
      case 'distance':
        if (!userLocation) return 0;
        const distA = distance(point(userLocation), point([a.lng, a.lat]), { units: 'kilometers' });
        const distB = distance(point(userLocation), point([b.lng, b.lat]), { units: 'kilometers' });
        return distA - distB;
      case 'time':
        // Assume walking speed of 5 km/h
        if (!userLocation) return 0;
        const timeA = distance(point(userLocation), point([a.lng, a.lat]), { units: 'kilometers' }) / 5 * 60;
        const timeB = distance(point(userLocation), point([b.lng, b.lat]), { units: 'kilometers' }) / 5 * 60;
        return timeA - timeB;
      default:
        return 0;
    }
  });

  // Select top nodes
  const selectedNodes = sortedNodes.slice(0, Math.min(maxNodes, sortedNodes.length));

  // Calculate route metrics
  const totalEarnings = selectedNodes.reduce((sum, node) => sum + node.reward_rate_usd, 0);
  const totalDistance = calculateTotalDistance(selectedNodes, userLocation);
  const estimatedTime = estimateTravelTime(totalDistance);

  // Generate waypoints for Mapbox
  const waypoints: [number, number][] = userLocation
    ? [userLocation, ...selectedNodes.map(node => [node.lng, node.lat] as [number, number])]
    : selectedNodes.map(node => [node.lng, node.lat] as [number, number]);

  return {
    nodes: selectedNodes,
    total_distance_km: totalDistance,
    estimated_earnings_usd: totalEarnings,
    estimated_time_minutes: estimatedTime,
    waypoints
  };
}

/**
 * Calculate total distance for a route
 */
function calculateTotalDistance(nodes: Node[], startLocation?: [number, number]): number {
  if (nodes.length === 0) return 0;

  let totalDistance = 0;
  let currentLocation = startLocation;

  for (const node of nodes) {
    if (currentLocation) {
      const nodePoint = point([node.lng, node.lat]);
      const currentPoint = point(currentLocation);
      totalDistance += distance(currentPoint, nodePoint, { units: 'kilometers' });
    }
    currentLocation = [node.lng, node.lat];
  }

  return totalDistance;
}

/**
 * Estimate travel time assuming walking speed of 5 km/h
 */
function estimateTravelTime(distanceKm: number): number {
  const walkingSpeedKmh = 5; // 5 km/h average walking speed
  return Math.round((distanceKm / walkingSpeedKmh) * 60); // Convert to minutes
}

/**
 * Generate quick route options for different scenarios
 */
export function generateRouteOptions(nodes: Node[], userLocation?: [number, number]) {
  const options = [
    {
      name: 'Quick Route',
      description: '3 nodes, fast completion',
      options: { maxNodes: 3, maxDistance: 5, optimization: 'distance' as const, userLocation }
    },
    {
      name: 'Balanced Route',
      description: '5 nodes, good earnings/time ratio',
      options: { maxNodes: 5, maxDistance: 8, optimization: 'earnings' as const, userLocation }
    },
    {
      name: 'Max Earnings',
      description: '8 nodes, maximum rewards',
      options: { maxNodes: 8, maxDistance: 15, optimization: 'earnings' as const, userLocation }
    }
  ];

  return options.map(option => ({
    ...option,
    route: optimizeRoute(nodes, option.options)
  }));
}


'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl';
import { Node } from '@/lib/types';
import { MapPin, Wifi, Radio, Navigation2 } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapViewProps {
  nodes: Node[];
  onNodeSelect: (node: Node) => void;
  selectedNode?: Node;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const getNodeIcon = (networkType: string) => {
  switch (networkType) {
    case 'helium':
      return Radio;
    case 'xnet':
      return Wifi;
    case 'geodnet':
      return Navigation2;
    default:
      return MapPin;
  }
};

const getNodeColor = (node: Node) => {
  if (node.status === 'inactive') return 'bg-gray-500';
  if (node.reward_rate_usd > 20) return 'bg-accent';
  if (node.status === 'active') return 'bg-success';
  return 'bg-warning';
};

export function MapView({ nodes, onNodeSelect, selectedNode }: MapViewProps) {
  const [viewState, setViewState] = useState({
    longitude: -122.4194,
    latitude: 37.7749,
    zoom: 12,
  });

  const mapRef = useRef<any>(null);

  const handleNodeClick = useCallback((node: Node) => {
    onNodeSelect(node);
    // Animate to node location
    mapRef.current?.flyTo({
      center: [node.lng, node.lat],
      zoom: 14,
      duration: 1000,
    });
  }, [onNodeSelect]);

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl
          position="top-right"
          trackUserLocation
          showUserHeading
        />

        {nodes.map((node) => {
          const Icon = getNodeIcon(node.network_type);
          const isSelected = selectedNode?.id === node.id;

          return (
            <Marker
              key={node.id}
              longitude={node.lng}
              latitude={node.lat}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleNodeClick(node);
              }}
            >
              <div
                className={`node-pin ${getNodeColor(node)} ${
                  isSelected ? 'scale-125 shadow-glow' : ''
                } ${node.status === 'active' ? 'animate-pulse-slow' : ''}`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
            </Marker>
          );
        })}
      </Map>

      {/* Map Legend */}
      <div className="absolute top-4 left-4 glass-card p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <span className="text-xs text-text-muted">Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent"></div>
          <span className="text-xs text-text-muted">High Reward</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span className="text-xs text-text-muted">Offline</span>
        </div>
      </div>
    </div>
  );
}

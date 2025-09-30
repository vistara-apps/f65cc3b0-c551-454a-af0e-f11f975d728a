'use client'

import { useState, useCallback } from 'react'
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Node, MapViewport } from '../lib/types'
import { NodePin } from './NodePin'
import { mockNodes } from '../lib/mock-data'

interface MapCanvasProps {
  onNodeSelect: (node: Node) => void
  selectedNodeId?: string
  className?: string
}

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example'

export function MapCanvas({ onNodeSelect, selectedNodeId, className }: MapCanvasProps) {
  const [viewport, setViewport] = useState<MapViewport>({
    latitude: 37.7749, // San Francisco
    longitude: -122.4194,
    zoom: 12
  })

  const handleNodeClick = useCallback((node: Node) => {
    onNodeSelect(node)
  }, [onNodeSelect])

  return (
    <div className={className}>
      <Map
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        interactiveLayerIds={[]}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl
          position="top-left"
          trackUserLocation={true}
          showUserHeading={true}
        />

        {mockNodes.map((node) => (
          <Marker
            key={node.node_id}
            latitude={node.lat}
            longitude={node.lng}
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              handleNodeClick(node)
            }}
          >
            <NodePin
              node={node}
              onClick={() => handleNodeClick(node)}
              isSelected={selectedNodeId === node.node_id}
            />
          </Marker>
        ))}
      </Map>
    </div>
  )
}


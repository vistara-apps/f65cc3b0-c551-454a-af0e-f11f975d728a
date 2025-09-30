'use client'

import { useState } from 'react'
import { MapCanvas } from '../../../components/MapCanvas'
import { BottomSheet } from '../../../components/BottomSheet'
import { NodeDetails } from '../../../components/NodeDetails'
import { Node } from '../../../lib/types'

export default function MapPage() {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  const handleNodeSelect = (node: Node) => {
    setSelectedNode(node)
    setIsBottomSheetOpen(true)
  }

  const handleCloseBottomSheet = () => {
    setIsBottomSheetOpen(false)
    setSelectedNode(null)
  }

  const handleReportStatus = (node: Node, status: 'online' | 'offline') => {
    // TODO: Implement status reporting
    console.log('Reporting status for node:', node.node_id, 'as', status)
  }

  const handlePlanRoute = (node: Node) => {
    // TODO: Implement route planning
    console.log('Planning route for node:', node.node_id)
  }

  return (
    <div className="h-screen w-full relative">
      {/* Map */}
      <MapCanvas
        onNodeSelect={handleNodeSelect}
        selectedNodeId={selectedNode?.node_id}
        className="h-full w-full"
      />

      {/* Bottom Sheet */}
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={handleCloseBottomSheet}
        title="Node Details"
        variant="nodeDetails"
      >
        {selectedNode && (
          <NodeDetails
            node={selectedNode}
            onReportStatus={handleReportStatus}
            onPlanRoute={handlePlanRoute}
          />
        )}
      </BottomSheet>
    </div>
  )
}


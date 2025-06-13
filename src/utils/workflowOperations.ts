
import { Node, Edge } from '@xyflow/react';
import { PendingConnection } from '../types/workflow';
import { getReactFlowNodeType, getNodeLabel, getDefaultConfig } from './nodeConfig';

const NODE_WIDTH = 120; // Approximate node width
const NODE_HEIGHT = 60; // Approximate node height
const SPACING = 20; // Minimum spacing between nodes

const findAvailablePosition = (
  preferredPosition: { x: number; y: number },
  existingNodes: Node[]
): { x: number; y: number } => {
  const isPositionOccupied = (pos: { x: number; y: number }) => {
    return existingNodes.some(node => {
      const nodeX = node.position.x;
      const nodeY = node.position.y;
      
      // Check if positions overlap (with some padding)
      return (
        pos.x < nodeX + NODE_WIDTH + SPACING &&
        pos.x + NODE_WIDTH + SPACING > nodeX &&
        pos.y < nodeY + NODE_HEIGHT + SPACING &&
        pos.y + NODE_HEIGHT + SPACING > nodeY
      );
    });
  };

  let testPosition = { ...preferredPosition };
  
  // If preferred position is available, use it
  if (!isPositionOccupied(testPosition)) {
    return testPosition;
  }
  
  // Try positions in a spiral pattern around the preferred position
  const offsets = [
    { x: 0, y: NODE_HEIGHT + SPACING }, // Below
    { x: 0, y: -(NODE_HEIGHT + SPACING) }, // Above
    { x: NODE_WIDTH + SPACING, y: NODE_HEIGHT + SPACING }, // Below-right
    { x: NODE_WIDTH + SPACING, y: -(NODE_HEIGHT + SPACING) }, // Above-right
    { x: -(NODE_WIDTH + SPACING), y: 0 }, // Left
    { x: -(NODE_WIDTH + SPACING), y: NODE_HEIGHT + SPACING }, // Below-left
    { x: -(NODE_WIDTH + SPACING), y: -(NODE_HEIGHT + SPACING) }, // Above-left
    { x: 2 * (NODE_WIDTH + SPACING), y: 0 }, // Far right
    { x: 0, y: 2 * (NODE_HEIGHT + SPACING) }, // Far below
    { x: 0, y: -2 * (NODE_HEIGHT + SPACING) }, // Far above
  ];
  
  for (const offset of offsets) {
    testPosition = {
      x: preferredPosition.x + offset.x,
      y: preferredPosition.y + offset.y
    };
    
    if (!isPositionOccupied(testPosition)) {
      return testPosition;
    }
  }
  
  // Fallback: if all positions are occupied, place it far to the right
  return {
    x: preferredPosition.x + 2 * (NODE_WIDTH + SPACING),
    y: preferredPosition.y
  };
};

export const createNode = (type: string, position: { x: number; y: number }): Node => {
  const nodeType = getReactFlowNodeType(type);
  return {
    id: `${type}-${Date.now()}`,
    type: nodeType,
    position,
    data: {
      label: getNodeLabel(type),
      config: getDefaultConfig(type)
    }
  };
};

export const createEdge = (sourceId: string, targetId: string, sourceHandle?: string): Edge => {
  return {
    id: `edge-${sourceId}-${targetId}`,
    source: sourceId,
    target: targetId,
    sourceHandle,
    type: 'smoothstep',
    style: { stroke: '#9CA3AF' }
  };
};

export const addNodeWithConnection = (
  type: string,
  pendingConnection: PendingConnection,
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
) => {
  console.log('addNodeWithConnection called with type:', type, 'pendingConnection:', pendingConnection);
  
  // Get current nodes to check for overlaps
  let currentNodes: Node[] = [];
  setNodes(prev => {
    currentNodes = prev;
    return prev;
  });
  
  // Find an available position that doesn't overlap
  const availablePosition = findAvailablePosition(pendingConnection.sourcePosition, currentNodes);
  
  const newNode = createNode(type, availablePosition);
  console.log('Creating new node at position:', availablePosition, newNode);
  
  // Add the new node
  setNodes(prev => {
    const updated = [...prev, newNode];
    console.log('Updated nodes:', updated);
    return updated;
  });
  
  // Create the edge connection
  const newEdge = createEdge(pendingConnection.sourceNodeId, newNode.id, pendingConnection.sourceHandle);
  console.log('Creating new edge:', newEdge);
  
  setEdges(prev => {
    const updated = [...prev, newEdge];
    console.log('Updated edges:', updated);
    return updated;
  });
};

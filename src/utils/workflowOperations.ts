import { Node, Edge } from '@xyflow/react';
import { PendingConnection } from '../types/workflow';
import { getReactFlowNodeType, getNodeLabel, getDefaultConfig } from './nodeConfig';

const NODE_WIDTH = 120; // Approximate node width
const NODE_HEIGHT = 60; // Approximate node height
const SPACING = 30; // Minimum spacing between nodes

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
  
  // Try positions in a more systematic grid pattern
  const maxAttempts = 50;
  let attempt = 0;
  
  while (attempt < maxAttempts) {
    const row = Math.floor(attempt / 5);
    const col = attempt % 5;
    
    testPosition = {
      x: preferredPosition.x + col * (NODE_WIDTH + SPACING),
      y: preferredPosition.y + row * (NODE_HEIGHT + SPACING)
    };
    
    if (!isPositionOccupied(testPosition)) {
      return testPosition;
    }
    
    // Also try negative positions
    if (col > 0) {
      testPosition = {
        x: preferredPosition.x - col * (NODE_WIDTH + SPACING),
        y: preferredPosition.y + row * (NODE_HEIGHT + SPACING)
      };
      
      if (!isPositionOccupied(testPosition)) {
        return testPosition;
      }
    }
    
    attempt++;
  }
  
  // Fallback: if all positions are occupied, place it far to the right
  return {
    x: preferredPosition.x + 3 * (NODE_WIDTH + SPACING),
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
  
  setNodes(prev => {
    const availablePosition = findAvailablePosition(pendingConnection.sourcePosition, prev);
    const newNode = createNode(type, availablePosition);
    console.log('Creating new node at position:', availablePosition, newNode);
    
    const updatedNodes = [...prev, newNode];
    
    // Create the edge connection
    const newEdge = createEdge(pendingConnection.sourceNodeId, newNode.id, pendingConnection.sourceHandle);
    console.log('Creating new edge:', newEdge);
    
    setEdges(prevEdges => {
      const updatedEdges = [...prevEdges, newEdge];
      console.log('Updated edges:', updatedEdges);
      return updatedEdges;
    });
    
    return updatedNodes;
  });
};

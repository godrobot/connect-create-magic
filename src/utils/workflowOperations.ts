import { Node, Edge } from '@xyflow/react';
import { PendingConnection } from '../types/workflow';
import { getReactFlowNodeType, getNodeLabel, getDefaultConfig } from './nodeConfig';

const NODE_WIDTH = 140; // Increased from 120 to be more accurate
const NODE_HEIGHT = 80; // Increased from 60 to be more accurate
const SPACING = 50; // Increased spacing between nodes

const findAvailablePosition = (
  preferredPosition: { x: number; y: number },
  existingNodes: Node[]
): { x: number; y: number } => {
  const isPositionOccupied = (pos: { x: number; y: number }) => {
    return existingNodes.some(node => {
      const nodeX = node.position.x;
      const nodeY = node.position.y;
      
      // Check if positions overlap with proper spacing
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
  
  // Try positions in a more systematic grid pattern with better spacing
  const maxAttempts = 100; // Increased attempts
  let attempt = 0;
  
  while (attempt < maxAttempts) {
    const spiralRadius = Math.floor(attempt / 8) + 1;
    const angleStep = (Math.PI * 2) / 8;
    const angle = (attempt % 8) * angleStep;
    
    const offsetX = Math.cos(angle) * spiralRadius * (NODE_WIDTH + SPACING);
    const offsetY = Math.sin(angle) * spiralRadius * (NODE_HEIGHT + SPACING);
    
    testPosition = {
      x: preferredPosition.x + offsetX,
      y: preferredPosition.y + offsetY
    };
    
    if (!isPositionOccupied(testPosition)) {
      return testPosition;
    }
    
    attempt++;
  }
  
  // Fallback: place it far to the right with more spacing
  return {
    x: preferredPosition.x + 5 * (NODE_WIDTH + SPACING),
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

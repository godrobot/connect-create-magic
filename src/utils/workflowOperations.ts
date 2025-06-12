
import { Node, Edge } from '@xyflow/react';
import { PendingConnection } from '../types/workflow';
import { getReactFlowNodeType, getNodeLabel, getDefaultConfig } from './nodeConfig';

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
  
  const newNode = createNode(type, pendingConnection.sourcePosition);
  console.log('Creating new node:', newNode);
  
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

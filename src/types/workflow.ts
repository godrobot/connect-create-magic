
import { Node, Edge } from '@xyflow/react';

export interface PendingConnection {
  sourceNodeId: string;
  sourceHandle?: string;
  sourcePosition: { x: number; y: number };
}

export interface WorkflowContextType {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  pendingConnection: PendingConnection | null;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  setSelectedNode: (node: Node | null) => void;
  setPendingConnection: (connection: PendingConnection | null) => void;
  addNode: (type: string, position: { x: number; y: number }) => void;
  addNodeWithConnection: (type: string) => void;
}

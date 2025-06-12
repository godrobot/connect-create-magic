
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Node, Edge } from '@xyflow/react';

interface WorkflowContextType {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  setSelectedNode: (node: Node | null) => void;
  addNode: (type: string, position: { x: number; y: number }) => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};

interface WorkflowProviderProps {
  children: ReactNode;
}

export const WorkflowProvider: React.FC<WorkflowProviderProps> = ({ children }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const addNode = (type: string, position: { x: number; y: number }) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: {
        label: getNodeLabel(type),
        config: getDefaultConfig(type)
      }
    };
    setNodes(prev => [...prev, newNode]);
  };

  const getNodeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      trigger: 'Trigger',
      action: 'Action',
      condition: 'Condition',
      webhook: 'Webhook',
      email: 'Send Email',
      database: 'Database',
      api: 'HTTP Request'
    };
    return labels[type] || 'Node';
  };

  const getDefaultConfig = (type: string) => {
    const configs: { [key: string]: any } = {
      trigger: { event: 'manual', interval: '5m' },
      action: { operation: 'create' },
      condition: { operator: 'equals', value: '' },
      webhook: { url: '', method: 'POST' },
      email: { to: '', subject: '', body: '' },
      database: { operation: 'select', table: '' },
      api: { url: '', method: 'GET', headers: {} }
    };
    return configs[type] || {};
  };

  return (
    <WorkflowContext.Provider value={{
      nodes,
      edges,
      selectedNode,
      setNodes,
      setEdges,
      setSelectedNode,
      addNode
    }}>
      {children}
    </WorkflowContext.Provider>
  );
};

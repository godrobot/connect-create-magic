
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Node, Edge } from '@xyflow/react';
import { WorkflowContextType, PendingConnection } from '../types/workflow';
import { createNode, addNodeWithConnection as addNodeWithConnectionUtil } from '../utils/workflowOperations';

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
  const [pendingConnection, setPendingConnection] = useState<PendingConnection | null>(null);

  const addNode = (type: string, position: { x: number; y: number }) => {
    const newNode = createNode(type, position);
    setNodes(prev => [...prev, newNode]);
    console.log('Added node:', newNode);
  };

  const addNodeWithConnection = (type: string) => {
    if (!pendingConnection) {
      console.log('No pending connection found');
      return;
    }
    
    addNodeWithConnectionUtil(type, pendingConnection, setNodes, setEdges);
    
    // Clear pending connection
    console.log('Clearing pending connection');
    setPendingConnection(null);
  };

  return (
    <WorkflowContext.Provider value={{
      nodes,
      edges,
      selectedNode,
      pendingConnection,
      setNodes,
      setEdges,
      setSelectedNode,
      setPendingConnection,
      addNode,
      addNodeWithConnection
    }}>
      {children}
    </WorkflowContext.Provider>
  );
};

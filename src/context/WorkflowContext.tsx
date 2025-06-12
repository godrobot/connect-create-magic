
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
      // Actions
      'none': 'None',
      'show-dialog': 'Show Dialog',
      'show-snackbar': 'Show Snackbar',
      'compose-email': 'Compose Email',
      'phone-call': 'Make Phone Call',
      'sms': 'Start SMS',
      'whatsapp': 'Start WhatsApp',
      'copy-clipboard': 'Copy to Clipboard',
      'download': 'Download',
      'play-sound': 'Play Sound',
      'share': 'Share',
      'go-back': 'Go Back',
      'previous-item': 'Previous Item',
      'next-item': 'Next Item',
      'open-overlay': 'Open Overlay',
      'close-overlay': 'Close Overlay',
      'go-to-screen': 'Go To Screen',
      'open-file': 'Open File',
      'open-link': 'Open Link',
      'open-map': 'Open Map',
      'add-row': 'Add New Row',
      'modify-column': 'Modify Column Values',
      'delete-row': 'Delete Current Row',
      'increment-value': 'Increment Value',
      'toggle-value': 'Toggle Value',
      'duplicate-row': 'Duplicate Row',
      'open-update-form': 'Open Update Item Form',
      'http-request': 'HTTP Request',
      'send-email': 'Send Email',
      
      // Triggers
      'component-action': 'Component Action',
      'manual-trigger': 'Manual Trigger',
      'schedule': 'Schedule',
      'webhook': 'Webhook',
      
      // Logic
      'condition': 'Condition',
      'code': 'Code',
      
      // Legacy support
      'trigger': 'Trigger',
      'action': 'Action',
      'email': 'Send Email',
      'database': 'Database',
      'api': 'HTTP Request'
    };
    return labels[type] || 'Node';
  };

  const getDefaultConfig = (type: string) => {
    const configs: { [key: string]: any } = {
      // Actions
      'none': {},
      'show-dialog': { message: '' },
      'show-snackbar': { message: '' },
      'compose-email': { to: '', subject: '', body: '' },
      'phone-call': { phoneNumber: '' },
      'sms': { phoneNumber: '', text: '' },
      'whatsapp': { phoneNumber: '', text: '' },
      'copy-clipboard': { text: '' },
      'download': { url: '', fileName: '' },
      'play-sound': { soundUrl: '' },
      'share': { text: '', url: '' },
      'go-back': {},
      'previous-item': {},
      'next-item': {},
      'open-overlay': {},
      'close-overlay': {},
      'go-to-screen': { screen: '' },
      'open-file': { fileName: '', fileType: '' },
      'open-link': { url: '' },
      'open-map': { mapAddress: '' },
      'add-row': { table: '' },
      'modify-column': { table: '', column: '', value: '' },
      'delete-row': { table: '' },
      'increment-value': { value: '1' },
      'toggle-value': { value: '' },
      'duplicate-row': { table: '' },
      'open-update-form': { table: '' },
      'http-request': { url: '', method: 'GET', headers: {} },
      'send-email': { to: '', subject: '', body: '' },
      
      // Triggers
      'component-action': { event: 'click' },
      'manual-trigger': { event: 'manual' },
      'schedule': { event: 'schedule', interval: '5m' },
      'webhook': { url: '', method: 'POST' },
      
      // Logic
      'condition': { operator: 'equals', value: '' },
      'code': { text: '' },
      
      // Legacy support
      'trigger': { event: 'manual', interval: '5m' },
      'action': { operation: 'create' },
      'email': { to: '', subject: '', body: '' },
      'database': { operation: 'select', table: '' },
      'api': { url: '', method: 'GET', headers: {} }
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

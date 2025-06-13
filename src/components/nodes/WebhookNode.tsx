
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Webhook, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import NodeHoverActions from '../NodeHoverActions';
import { useWorkflow } from '../../context/WorkflowContext';

const WebhookNode = ({ data, selected, id, xPos, yPos, ...nodeProps }: any) => {
  const { setNodes, setSelectedNode, setPendingConnection, edges } = useWorkflow();

  // Check if this node has any outgoing connections
  const hasOutgoingConnection = edges.some(edge => edge.source === id);

  const handleDelete = () => {
    setNodes(prev => prev.filter(node => node.id !== id));
  };

  const handleSettings = () => {
    setSelectedNode({ id, data, type: 'webhook', xPos, yPos, ...nodeProps });
  };

  const handleAddNode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Plus icon clicked for node:', id, 'at position:', { x: xPos, y: yPos });
    
    const connectionData = {
      sourceNodeId: id,
      sourcePosition: { x: xPos + 100, y: yPos }
    };
    
    console.log('Setting pending connection:', connectionData);
    setPendingConnection(connectionData);
    setSelectedNode(null);
  };

  const handleHandleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="relative">
      <NodeHoverActions 
        onSettings={handleSettings}
        onDelete={handleDelete}
        onPlay={() => console.log('Run webhook', id)}
        onStop={() => console.log('Stop webhook', id)}
      >
        <Card className={`p-3 min-w-[160px] border border-gray-300 bg-background shadow-sm rounded-lg`}>
          <Handle 
            type="source" 
            position={Position.Right} 
            className="w-3 h-3 !bg-gray-400 !border-0 hover:!bg-gray-600 transition-colors" 
            onClick={handleHandleClick}
            onMouseDown={handleHandleClick}
          />
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-md">
              <Webhook className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-sm leading-tight">{data.label}</div>
              <div className="text-xs text-muted-foreground leading-tight">
                {data.config?.method || 'POST'} {data.config?.url ? 'Configured' : 'Not configured'}
              </div>
            </div>
          </div>
        </Card>
      </NodeHoverActions>

      {/* Connection line with plus icon - only show if no outgoing connections */}
      {!hasOutgoingConnection && (
        <div 
          className="absolute top-1/2 left-full transform -translate-y-1/2 flex items-center z-50"
          style={{ pointerEvents: 'none' }}
        >
          <div className="w-4 h-0.5 bg-gray-400"></div>
          <button
            onMouseDown={handleAddNode}
            className="w-6 h-6 bg-gray-400 hover:bg-gray-500 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer border-0 outline-none focus:outline-none"
            title="Add node"
            style={{ pointerEvents: 'auto' }}
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default WebhookNode;

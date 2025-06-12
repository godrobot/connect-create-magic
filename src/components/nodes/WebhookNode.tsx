
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Webhook, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import NodeHoverActions from '../NodeHoverActions';
import { useWorkflow } from '../../context/WorkflowContext';

const WebhookNode = ({ data, selected, id, ...nodeProps }: any) => {
  const { setNodes, setSelectedNode, setPendingConnection } = useWorkflow();

  const handleDelete = () => {
    setNodes(prev => prev.filter(node => node.id !== id));
  };

  const handleSettings = () => {
    setSelectedNode({ id, data, type: 'webhook', ...nodeProps });
  };

  const handleAddNode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Plus icon clicked for node:', id, 'at position:', nodeProps.position);
    
    const connectionData = {
      sourceNodeId: id,
      sourcePosition: { x: nodeProps.position.x + 250, y: nodeProps.position.y }
    };
    
    console.log('Setting pending connection:', connectionData);
    setPendingConnection(connectionData);
    // Don't set selectedNode to null here - let the Index component handle it
  };

  return (
    <div className="relative">
      <NodeHoverActions 
        onSettings={handleSettings}
        onDelete={handleDelete}
        onPlay={() => console.log('Run webhook', id)}
        onStop={() => console.log('Stop webhook', id)}
      >
        <Card className={`p-3 min-w-48 border border-gray-300 bg-background shadow-md relative`}>
          <Handle 
            type="target" 
            position={Position.Left} 
            className="w-4 h-4 !bg-gray-400 !border-0 hover:!bg-gray-600 transition-colors" 
          />
          <Handle 
            type="source" 
            position={Position.Right} 
            className="w-4 h-4 !bg-gray-400 !border-0 hover:!bg-gray-600 transition-colors" 
          />
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Webhook className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-sm">{data.label}</div>
              <div className="text-xs text-muted-foreground">
                {data.config?.method || 'POST'} {data.config?.url ? 'Configured' : 'Not configured'}
              </div>
            </div>
          </div>
        </Card>
      </NodeHoverActions>

      {/* Connection line with plus icon - positioned outside NodeHoverActions to avoid hover interference */}
      <div className="absolute top-1/2 left-full transform -translate-y-1/2 flex items-center z-20 pointer-events-auto">
        <div className="w-8 h-0.5 bg-gray-400 pointer-events-none"></div>
        <div
          onMouseDown={handleAddNode}
          className="w-4 h-4 bg-gray-400 hover:bg-gray-500 text-white rounded-sm flex items-center justify-center transition-colors cursor-pointer border-0 outline-none focus:outline-none"
          title="Add node"
          style={{ pointerEvents: 'auto' }}
        >
          <Plus className="w-2.5 h-2.5" />
        </div>
      </div>
    </div>
  );
};

export default WebhookNode;

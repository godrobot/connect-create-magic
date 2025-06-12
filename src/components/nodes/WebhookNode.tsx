
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
    e.stopPropagation();
    setPendingConnection({
      sourceNodeId: id,
      sourcePosition: { x: nodeProps.position.x + 250, y: nodeProps.position.y }
    });
    setSelectedNode(null);
  };

  return (
    <NodeHoverActions 
      onSettings={handleSettings}
      onDelete={handleDelete}
      onPlay={() => console.log('Run webhook', id)}
      onStop={() => console.log('Stop webhook', id)}
    >
      <div className="relative group">
        <Card className={`p-3 min-w-48 border ${selected ? 'border-primary border-2' : 'border-gray-300'} bg-background shadow-md relative`}>
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

        {/* Connection line with plus icon extending from the right */}
        <div className="absolute top-1/2 left-full transform -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="w-8 h-0.5 bg-gray-300"></div>
          <button
            onClick={handleAddNode}
            className="w-5 h-5 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors pointer-events-auto"
            title="Add node"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </NodeHoverActions>
  );
};

export default WebhookNode;


import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Webhook } from 'lucide-react';
import { Card } from '@/components/ui/card';
import NodeHoverActions from '../NodeHoverActions';
import { useWorkflow } from '../../context/WorkflowContext';

const WebhookNode = ({ data, selected, id }: any) => {
  const { setNodes, setSelectedNode } = useWorkflow();

  const handleDelete = () => {
    setNodes(prev => prev.filter(node => node.id !== id));
  };

  const handleSettings = () => {
    setSelectedNode({ id, data, type: 'webhook' });
  };

  return (
    <NodeHoverActions 
      onSettings={handleSettings}
      onDelete={handleDelete}
      onPlay={() => console.log('Run webhook', id)}
      onStop={() => console.log('Stop webhook', id)}
    >
      <Card className={`p-3 min-w-48 border-2 ${selected ? 'border-primary' : 'border-border'} bg-background shadow-md relative`}>
        <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-gray-400 !border-gray-400" />
        <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-gray-400 !border-gray-400" />
        <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-gray-400 !border-gray-400" />
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-gray-400 !border-gray-400" />
        
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
  );
};

export default WebhookNode;

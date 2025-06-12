
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Play, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import NodeHoverActions from '../NodeHoverActions';
import { useWorkflow } from '../../context/WorkflowContext';

const TriggerNode = ({ data, selected, id }: any) => {
  const { setNodes, setSelectedNode } = useWorkflow();

  const handleDelete = () => {
    setNodes(prev => prev.filter(node => node.id !== id));
  };

  const handleSettings = () => {
    setSelectedNode({ id, data, type: 'trigger' });
  };

  return (
    <NodeHoverActions 
      onSettings={handleSettings}
      onDelete={handleDelete}
      onPlay={() => console.log('Run trigger', id)}
      onStop={() => console.log('Stop trigger', id)}
    >
      <Card className={`p-3 min-w-48 border-2 ${selected ? 'border-primary' : 'border-border'} bg-background shadow-md`}>
        <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-gray-400 !border-gray-400" />
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Play className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <div className="font-medium text-sm">{data.label}</div>
            <div className="text-xs text-muted-foreground">
              {data.config?.event === 'schedule' ? 'Scheduled' : 'Manual'}
            </div>
          </div>
        </div>
        
        {data.config?.interval && (
          <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Every {data.config.interval}
          </div>
        )}
      </Card>
    </NodeHoverActions>
  );
};

export default TriggerNode;

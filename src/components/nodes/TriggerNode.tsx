
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Zap, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import NodeHoverActions from '../NodeHoverActions';
import { useWorkflow } from '../../context/WorkflowContext';

const TriggerNode = ({ data, selected, id, ...nodeProps }: any) => {
  const { setNodes, setSelectedNode, setPendingConnection } = useWorkflow();

  const handleDelete = () => {
    setNodes(prev => prev.filter(node => node.id !== id));
  };

  const handleSettings = () => {
    setSelectedNode({ id, data, type: 'trigger', ...nodeProps });
  };

  const handleAddNode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Plus icon clicked for node:', id);
    
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
      onPlay={() => console.log('Run trigger', id)}
      onStop={() => console.log('Stop trigger', id)}
    >
      <div className="relative">
        <Card className={`p-3 min-w-48 border border-gray-300 bg-background shadow-md rounded-l-full`}>
          <Handle 
            type="source" 
            position={Position.Right} 
            className="w-4 h-4 !bg-gray-400 !border-0 hover:!bg-gray-600 transition-colors" 
          />
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Zap className="w-4 h-4 text-green-600" />
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
              <Zap className="w-3 h-3" />
              Every {data.config.interval}
            </div>
          )}
        </Card>

        {/* Connection line with plus icon extending from the right */}
        <div className="absolute top-1/2 left-full transform -translate-y-1/2 flex items-center">
          <div className="w-8 h-0.5 bg-gray-400"></div>
          <button
            onClick={handleAddNode}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-4 h-4 bg-gray-400 hover:bg-gray-500 text-white rounded-sm flex items-center justify-center transition-colors cursor-pointer z-10"
            title="Add node"
            type="button"
          >
            <Plus className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </NodeHoverActions>
  );
};

export default TriggerNode;

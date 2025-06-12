
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
    e.stopPropagation();
    // Set up pending connection and trigger sidebar
    setPendingConnection({
      sourceNodeId: id,
      sourcePosition: { x: nodeProps.position.x + 250, y: nodeProps.position.y }
    });
    setSelectedNode(null); // This will trigger the sidebar to open for node selection
  };

  return (
    <NodeHoverActions 
      onSettings={handleSettings}
      onDelete={handleDelete}
      onPlay={() => console.log('Run trigger', id)}
      onStop={() => console.log('Stop trigger', id)}
    >
      <div className="relative group">
        <Card className={`p-3 min-w-48 border ${selected ? 'border-primary border-2' : 'border-gray-300'} bg-background shadow-md rounded-l-full`}>
          {/* Right connector for triggers - larger size */}
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

        {/* Connection line with plus icon - positioned at the right edge */}
        <div className="absolute top-1/2 left-full transform -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-6 h-0.5 bg-gray-400"></div>
          <button
            onClick={handleAddNode}
            className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors"
            title="Add node"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </NodeHoverActions>
  );
};

export default TriggerNode;

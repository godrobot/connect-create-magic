
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { GitBranch, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import NodeHoverActions from '../NodeHoverActions';
import { useWorkflow } from '../../context/WorkflowContext';

const ConditionNode = ({ data, selected, id, ...nodeProps }: any) => {
  const { setNodes, setSelectedNode, setPendingConnection } = useWorkflow();

  const handleDelete = () => {
    setNodes(prev => prev.filter(node => node.id !== id));
  };

  const handleSettings = () => {
    setSelectedNode({ id, data, type: 'condition', ...nodeProps });
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
      onPlay={() => console.log('Run condition', id)}
      onStop={() => console.log('Stop condition', id)}
    >
      <div className="relative">
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
            id="true" 
            style={{ top: '25%' }} 
          />
          <Handle 
            type="source" 
            position={Position.Right} 
            className="w-4 h-4 !bg-gray-400 !border-0 hover:!bg-gray-600 transition-colors" 
            id="false" 
            style={{ top: '75%' }} 
          />
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <GitBranch className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <div className="font-medium text-sm">{data.label}</div>
              <div className="text-xs text-muted-foreground">
                {data.config?.operator} {data.config?.value}
              </div>
            </div>
          </div>
          
          <div className="mt-2 flex justify-between text-xs">
            <span className="text-green-600">True</span>
            <span className="text-red-600">False</span>
          </div>
        </Card>

        {/* Connection line with plus icon extending from the right */}
        <div className="absolute top-1/2 left-full transform -translate-y-1/2 flex items-center pointer-events-none">
          <div className="w-8 h-0.5 bg-gray-300"></div>
          <button
            onClick={handleAddNode}
            className="w-4 h-4 bg-gray-400 hover:bg-gray-500 text-white rounded-sm flex items-center justify-center transition-colors pointer-events-auto"
            title="Add node"
          >
            <Plus className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </NodeHoverActions>
  );
};

export default ConditionNode;

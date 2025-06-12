
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { GitBranch, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import NodeHoverActions from '../NodeHoverActions';
import { useWorkflow } from '../../context/WorkflowContext';

const ConditionNode = ({ data, selected, id, ...nodeProps }: any) => {
  const { setNodes, setSelectedNode } = useWorkflow();

  const handleDelete = () => {
    setNodes(prev => prev.filter(node => node.id !== id));
  };

  const handleSettings = () => {
    setSelectedNode({ id, data, type: 'condition', ...nodeProps });
  };

  const handleAddNode = () => {
    const newNodeId = `action-${Date.now()}`;
    const newNode = {
      id: newNodeId,
      type: 'action',
      position: { x: nodeProps.position.x + 250, y: nodeProps.position.y },
      data: {
        label: 'New Action',
        config: { operation: 'create' }
      }
    };

    setNodes(prev => [...prev, newNode]);
  };

  return (
    <NodeHoverActions 
      onSettings={handleSettings}
      onDelete={handleDelete}
      onPlay={() => console.log('Run condition', id)}
      onStop={() => console.log('Stop condition', id)}
    >
      <div className="relative">
        <Card className={`p-3 min-w-48 border border-gray-300 ${selected ? 'border-primary border-2' : ''} bg-background shadow-md relative`}>
          {/* Left and right connectors - larger size */}
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

        {/* Connection line with plus icon */}
        <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 flex items-center">
          <div className="w-6 h-0.5 bg-gray-300"></div>
          <button
            onClick={handleAddNode}
            className="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center ml-1 transition-colors"
            title="Add node"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </NodeHoverActions>
  );
};

export default ConditionNode;

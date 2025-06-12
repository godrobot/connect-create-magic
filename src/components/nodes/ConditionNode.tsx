
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { GitBranch } from 'lucide-react';
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

  return (
    <NodeHoverActions 
      onSettings={handleSettings}
      onDelete={handleDelete}
      onPlay={() => console.log('Run condition', id)}
      onStop={() => console.log('Stop condition', id)}
    >
      <Card className={`p-3 min-w-48 border-2 ${selected ? 'border-primary' : 'border-gray-300'} bg-background shadow-md relative`}>
        {/* Only left and right connectors for condition nodes */}
        <Handle 
          type="target" 
          position={Position.Left} 
          className="w-3 h-3 !bg-gray-300 !border-0 hover:!bg-gray-400 transition-colors" 
        />
        <Handle 
          type="source" 
          position={Position.Right} 
          className="w-3 h-3 !bg-gray-300 !border-0 hover:!bg-gray-400 transition-colors" 
          id="true" 
          style={{ top: '25%' }} 
        />
        <Handle 
          type="source" 
          position={Position.Right} 
          className="w-3 h-3 !bg-gray-300 !border-0 hover:!bg-gray-400 transition-colors" 
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
    </NodeHoverActions>
  );
};

export default ConditionNode;

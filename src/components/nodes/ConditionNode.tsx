
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { GitBranch, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import NodeHoverActions from '../NodeHoverActions';
import { useWorkflow } from '../../context/WorkflowContext';

const ConditionNode = ({ data, selected, id, xPos, yPos, ...nodeProps }: any) => {
  const { setNodes, setSelectedNode, setPendingConnection, edges } = useWorkflow();

  // Check if specific handles have outgoing connections
  const hasTrueConnection = edges.some(edge => edge.source === id && edge.sourceHandle === 'true');
  const hasFalseConnection = edges.some(edge => edge.source === id && edge.sourceHandle === 'false');

  const handleDelete = () => {
    setNodes(prev => prev.filter(node => node.id !== id));
  };

  const handleSettings = () => {
    setSelectedNode({ id, data, type: 'condition', xPos, yPos, ...nodeProps });
  };

  const handleAddNodeTrue = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Plus icon clicked for TRUE branch of node:', id);
    
    const connectionData = {
      sourceNodeId: id,
      sourceHandle: 'true',
      sourcePosition: { x: xPos + 100, y: yPos - 10 }
    };
    
    console.log('Setting pending connection for TRUE branch:', connectionData);
    setPendingConnection(connectionData);
    setSelectedNode(null);
  };

  const handleAddNodeFalse = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Plus icon clicked for FALSE branch of node:', id);
    
    const connectionData = {
      sourceNodeId: id,
      sourceHandle: 'false',
      sourcePosition: { x: xPos + 100, y: yPos + 10 }
    };
    
    console.log('Setting pending connection for FALSE branch:', connectionData);
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
        onPlay={() => console.log('Run condition', id)}
        onStop={() => console.log('Stop condition', id)}
      >
        <Card className={`p-1.5 min-w-[120px] border border-gray-300 bg-background shadow-sm relative rounded-lg`}>
          <Handle 
            type="target" 
            position={Position.Left} 
            className="w-1.5 h-1.5 !bg-gray-400 !border-0 hover:!bg-gray-600 transition-colors" 
            onClick={handleHandleClick}
            onMouseDown={handleHandleClick}
          />
          <Handle 
            type="source" 
            position={Position.Right} 
            className="w-1.5 h-1.5 !bg-gray-400 !border-0 hover:!bg-gray-600 transition-colors" 
            id="true" 
            style={{ top: '30%' }} 
            onClick={handleHandleClick}
            onMouseDown={handleHandleClick}
          />
          <Handle 
            type="source" 
            position={Position.Right} 
            className="w-1.5 h-1.5 !bg-gray-400 !border-0 hover:!bg-gray-600 transition-colors" 
            id="false" 
            style={{ top: '70%' }} 
            onClick={handleHandleClick}
            onMouseDown={handleHandleClick}
          />
          
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-orange-100 rounded">
              <GitBranch className="w-2.5 h-2.5 text-orange-600" />
            </div>
            <div>
              <div className="font-medium text-[10px] leading-tight">{data.label}</div>
              <div className="text-[8px] text-muted-foreground leading-tight mt-0.5">
                {data.config?.operator} {data.config?.value}
              </div>
            </div>
          </div>
          
          <div className="mt-1.5 flex justify-between text-[8px]">
            <span className="text-green-600">True</span>
            <span className="text-red-600">False</span>
          </div>
        </Card>
      </NodeHoverActions>

      {/* Connection line with plus icon for TRUE branch - only show if no true connection */}
      {!hasTrueConnection && (
        <div 
          className="absolute flex items-center z-50"
          style={{ 
            right: '-6px',
            top: '30%', 
            transform: 'translateY(-50%)',
            pointerEvents: 'none' 
          }}
        >
          <div className="w-1 h-0.5 bg-gray-400"></div>
          <button
            onMouseDown={handleAddNodeTrue}
            className="w-4 h-4 bg-gray-400 hover:bg-gray-500 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer border-0 outline-none focus:outline-none ml-0.5"
            title="Add node (True branch)"
            style={{ pointerEvents: 'auto' }}
          >
            <Plus className="w-2 h-2" />
          </button>
        </div>
      )}

      {/* Connection line with plus icon for FALSE branch - only show if no false connection */}
      {!hasFalseConnection && (
        <div 
          className="absolute flex items-center z-50"
          style={{ 
            right: '-6px',
            top: '70%', 
            transform: 'translateY(-50%)',
            pointerEvents: 'none' 
          }}
        >
          <div className="w-1 h-0.5 bg-gray-400"></div>
          <button
            onMouseDown={handleAddNodeFalse}
            className="w-4 h-4 bg-gray-400 hover:bg-gray-500 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer border-0 outline-none focus:outline-none ml-0.5"
            title="Add node (False branch)"
            style={{ pointerEvents: 'auto' }}
          >
            <Plus className="w-2 h-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ConditionNode;

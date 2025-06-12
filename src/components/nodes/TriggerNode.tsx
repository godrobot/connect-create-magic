
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Zap, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import NodeHoverActions from '../NodeHoverActions';
import { useWorkflow } from '../../context/WorkflowContext';

const TriggerNode = ({ data, selected, id, xPos, yPos, ...nodeProps }: any) => {
  const { setNodes, setSelectedNode, setPendingConnection, edges } = useWorkflow();

  // Check if this node has any outgoing connections
  const hasOutgoingConnection = edges.some(edge => edge.source === id);

  const handleDelete = () => {
    setNodes(prev => prev.filter(node => node.id !== id));
  };

  const handleSettings = () => {
    setSelectedNode({ id, data, type: 'trigger', xPos, yPos, ...nodeProps });
  };

  const handleAddNode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Plus icon clicked for node:', id, 'at position:', { x: xPos, y: yPos });
    
    const connectionData = {
      sourceNodeId: id,
      sourcePosition: { x: xPos + 140, y: yPos }
    };
    
    console.log('Setting pending connection:', connectionData);
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
        onPlay={() => console.log('Run trigger', id)}
        onStop={() => console.log('Stop trigger', id)}
      >
        <Card className={`p-1 min-w-20 border border-gray-300 bg-background shadow-sm rounded-l-full`}>
          <Handle 
            type="source" 
            position={Position.Right} 
            className="w-2 h-2 !bg-gray-400 !border-0 hover:!bg-gray-600 transition-colors" 
            onClick={handleHandleClick}
            onMouseDown={handleHandleClick}
          />
          
          <div className="flex items-center gap-1">
            <div className="p-0.5 bg-green-100 rounded-md">
              <Zap className="w-2 h-2 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-xs leading-tight">{data.label}</div>
              <div className="text-xs text-muted-foreground leading-tight">
                {data.config?.event === 'schedule' ? 'Scheduled' : 'Manual'}
              </div>
            </div>
          </div>
          
          {data.config?.interval && (
            <div className="mt-0.5 text-xs text-muted-foreground flex items-center gap-0.5">
              <Zap className="w-1.5 h-1.5" />
              Every {data.config.interval}
            </div>
          )}
        </Card>
      </NodeHoverActions>

      {/* Connection line with plus icon - only show if no outgoing connections */}
      {!hasOutgoingConnection && (
        <div 
          className="absolute top-1/2 left-full transform -translate-y-1/2 flex items-center z-50"
          style={{ pointerEvents: 'none' }}
        >
          <div className="w-4 h-0.5 bg-gray-400"></div>
          <button
            onMouseDown={handleAddNode}
            className="w-2 h-2 bg-gray-400 hover:bg-gray-500 text-white rounded-sm flex items-center justify-center transition-colors cursor-pointer border-0 outline-none focus:outline-none"
            title="Add node"
            style={{ pointerEvents: 'auto' }}
          >
            <Plus className="w-1.5 h-1.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TriggerNode;


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
      sourcePosition: { x: xPos + 100, y: yPos }
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
        <Card className={`p-1.5 min-w-[120px] border border-gray-300 bg-background shadow-sm rounded-lg`}>
          <Handle 
            type="source" 
            position={Position.Right} 
            className="w-1.5 h-1.5 !bg-gray-400 !border-0 hover:!bg-gray-600 transition-colors" 
            onClick={handleHandleClick}
            onMouseDown={handleHandleClick}
          />
          
          <div className="flex items-center gap-1.5">
            <div className="p-1 bg-green-100 rounded">
              <Zap className="w-2.5 h-2.5 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-[10px] leading-tight">{data.label}</div>
              <div className="text-[8px] text-muted-foreground leading-tight mt-0.5">
                {data.config?.event === 'schedule' ? 'Scheduled' : 'Manual'}
              </div>
            </div>
          </div>
          
          {data.config?.interval && (
            <div className="mt-1.5 text-[8px] text-muted-foreground flex items-center gap-1">
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
          <div className="w-2 h-0.5 bg-gray-400"></div>
          <button
            onMouseDown={handleAddNode}
            className="w-4 h-4 bg-gray-400 hover:bg-gray-500 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer border-0 outline-none focus:outline-none"
            title="Add node"
            style={{ pointerEvents: 'auto' }}
          >
            <Plus className="w-2 h-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TriggerNode;

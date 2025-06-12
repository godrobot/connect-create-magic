
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  Mail, 
  Database, 
  Globe, 
  FileText,
  Zap,
  Plus
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import NodeHoverActions from '../NodeHoverActions';
import { useWorkflow } from '../../context/WorkflowContext';

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'email':
      return { icon: Mail, color: 'text-red-600', bg: 'bg-red-100' };
    case 'database':
      return { icon: Database, color: 'text-yellow-600', bg: 'bg-yellow-100' };
    case 'api':
      return { icon: Globe, color: 'text-indigo-600', bg: 'bg-indigo-100' };
    case 'action':
      return { icon: FileText, color: 'text-gray-600', bg: 'bg-gray-100' };
    default:
      return { icon: Zap, color: 'text-blue-600', bg: 'bg-blue-100' };
  }
};

const ActionNode = ({ data, selected, type, id, xPos, yPos, ...nodeProps }: any) => {
  const { setNodes, setSelectedNode, setPendingConnection, edges } = useWorkflow();
  const { icon: Icon, color, bg } = getNodeIcon(type);
  
  // Check if this node has any outgoing connections
  const hasOutgoingConnection = edges.some(edge => edge.source === id);
  
  const handleDelete = () => {
    setNodes(prev => prev.filter(node => node.id !== id));
  };

  const handleSettings = () => {
    setSelectedNode({ id, data, type, xPos, yPos, ...nodeProps });
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
        onPlay={() => console.log('Run node', id)}
        onStop={() => console.log('Stop node', id)}
      >
        <Card className={`p-0.5 min-w-16 border border-gray-300 bg-background shadow-sm relative`}>
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
            onClick={handleHandleClick}
            onMouseDown={handleHandleClick}
          />
          
          <div className="flex items-center gap-0.5">
            <div className={`p-0.5 ${bg} rounded-md`}>
              <Icon className={`w-1.5 h-1.5 ${color}`} />
            </div>
            <div>
              <div className="font-medium text-xs leading-tight">{data.label}</div>
              <div className="text-xs text-muted-foreground leading-tight">
                {type === 'email' && data.config?.to && `To: ${data.config.to}`}
                {type === 'database' && data.config?.table && `Table: ${data.config.table}`}
                {type === 'api' && data.config?.method && `${data.config.method} Request`}
              </div>
            </div>
          </div>
        </Card>
      </NodeHoverActions>

      {/* Connection line with plus icon - only show if no outgoing connections */}
      {!hasOutgoingConnection && (
        <div 
          className="absolute top-1/2 left-full transform -translate-y-1/2 flex items-center z-50"
          style={{ pointerEvents: 'none' }}
        >
          <div className="w-3 h-0.5 bg-gray-400"></div>
          <button
            onMouseDown={handleAddNode}
            className="w-1.5 h-1.5 bg-gray-400 hover:bg-gray-500 text-white rounded-sm flex items-center justify-center transition-colors cursor-pointer border-0 outline-none focus:outline-none"
            title="Add node"
            style={{ pointerEvents: 'auto' }}
          >
            <Plus className="w-1 h-1" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionNode;

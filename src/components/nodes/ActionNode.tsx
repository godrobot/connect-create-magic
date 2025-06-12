
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

const ActionNode = ({ data, selected, type, id, ...nodeProps }: any) => {
  const { setNodes, setSelectedNode, setPendingConnection } = useWorkflow();
  const { icon: Icon, color, bg } = getNodeIcon(type);
  
  const handleDelete = () => {
    setNodes(prev => prev.filter(node => node.id !== id));
  };

  const handleSettings = () => {
    setSelectedNode({ id, data, type, ...nodeProps });
  };

  const handleAddNode = (e: React.MouseEvent) => {
    e.stopPropagation();
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
      onPlay={() => console.log('Run node', id)}
      onStop={() => console.log('Stop node', id)}
    >
      <div className="relative group">
        <Card className={`p-3 min-w-48 border ${selected ? 'border-primary border-2' : 'border-gray-300'} bg-background shadow-md relative`}>
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
          />
          
          <div className="flex items-center gap-3">
            <div className={`p-2 ${bg} rounded-lg`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div>
              <div className="font-medium text-sm">{data.label}</div>
              <div className="text-xs text-muted-foreground">
                {type === 'email' && data.config?.to && `To: ${data.config.to}`}
                {type === 'database' && data.config?.table && `Table: ${data.config.table}`}
                {type === 'api' && data.config?.method && `${data.config.method} Request`}
              </div>
            </div>
          </div>
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

export default ActionNode;

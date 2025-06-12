
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  Mail, 
  Database, 
  Globe, 
  FileText,
  Zap
} from 'lucide-react';
import { Card } from '@/components/ui/card';

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

const ActionNode = ({ data, selected, type }: any) => {
  const { icon: Icon, color, bg } = getNodeIcon(type);
  
  return (
    <Card className={`p-3 min-w-48 border-2 ${selected ? 'border-primary' : 'border-border'} bg-background shadow-md relative`}>
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      
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
  );
};

export default ActionNode;


import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Webhook } from 'lucide-react';
import { Card } from '@/components/ui/card';

const WebhookNode = ({ data, selected }: any) => {
  return (
    <Card className={`p-3 min-w-48 border-2 ${selected ? 'border-primary' : 'border-border'} bg-background shadow-md`}>
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
      
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Webhook className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <div className="font-medium text-sm">{data.label}</div>
          <div className="text-xs text-muted-foreground">
            {data.config?.method || 'POST'} {data.config?.url ? 'Configured' : 'Not configured'}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WebhookNode;


import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useWorkflow } from '../context/WorkflowContext';

interface NodeConfig {
  url?: string;
  method?: string;
  to?: string;
  subject?: string;
  body?: string;
  operator?: string;
  value?: string;
  event?: string;
  interval?: string;
  operation?: string;
  table?: string;
  headers?: Record<string, string>;
}

const PropertiesPanel = () => {
  const { selectedNode, setNodes } = useWorkflow();

  const updateNodeData = (updates: Partial<NodeConfig>) => {
    if (!selectedNode) return;
    
    setNodes(prev => prev.map(node => 
      node.id === selectedNode.id 
        ? { 
            ...node, 
            data: { 
              ...node.data, 
              config: { 
                ...(node.data.config as NodeConfig || {}), 
                ...updates 
              } 
            } 
          }
        : node
    ));
  };

  if (!selectedNode) {
    return (
      <div className="w-80 border-l bg-background p-4">
        <div className="text-center text-muted-foreground">
          Select a node to edit properties
        </div>
      </div>
    );
  }

  const config = (selectedNode.data.config as NodeConfig) || {};

  const renderWebhookProperties = () => (
    <div className="space-y-4">
      <div>
        <Label>URL</Label>
        <Input
          value={config.url || ''}
          onChange={(e) => updateNodeData({ url: e.target.value })}
          placeholder="https://api.example.com/webhook"
        />
      </div>
      <div>
        <Label>Method</Label>
        <Select value={config.method || 'POST'} onValueChange={(value) => updateNodeData({ method: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderEmailProperties = () => (
    <div className="space-y-4">
      <div>
        <Label>To</Label>
        <Input
          value={config.to || ''}
          onChange={(e) => updateNodeData({ to: e.target.value })}
          placeholder="recipient@example.com"
        />
      </div>
      <div>
        <Label>Subject</Label>
        <Input
          value={config.subject || ''}
          onChange={(e) => updateNodeData({ subject: e.target.value })}
          placeholder="Email subject"
        />
      </div>
      <div>
        <Label>Body</Label>
        <Textarea
          value={config.body || ''}
          onChange={(e) => updateNodeData({ body: e.target.value })}
          placeholder="Email content"
        />
      </div>
    </div>
  );

  const renderConditionProperties = () => (
    <div className="space-y-4">
      <div>
        <Label>Operator</Label>
        <Select value={config.operator || 'equals'} onValueChange={(value) => updateNodeData({ operator: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equals">Equals</SelectItem>
            <SelectItem value="not_equals">Not Equals</SelectItem>
            <SelectItem value="greater_than">Greater Than</SelectItem>
            <SelectItem value="less_than">Less Than</SelectItem>
            <SelectItem value="contains">Contains</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Value</Label>
        <Input
          value={config.value || ''}
          onChange={(e) => updateNodeData({ value: e.target.value })}
          placeholder="Comparison value"
        />
      </div>
    </div>
  );

  const renderTriggerProperties = () => (
    <div className="space-y-4">
      <div>
        <Label>Event Type</Label>
        <Select value={config.event || 'manual'} onValueChange={(value) => updateNodeData({ event: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="schedule">Schedule</SelectItem>
            <SelectItem value="webhook">Webhook</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {config.event === 'schedule' && (
        <div>
          <Label>Interval</Label>
          <Input
            value={config.interval || ''}
            onChange={(e) => updateNodeData({ interval: e.target.value })}
            placeholder="5m, 1h, 1d"
          />
        </div>
      )}
    </div>
  );

  const getPropertiesContent = () => {
    switch (selectedNode.type) {
      case 'webhook':
        return renderWebhookProperties();
      case 'email':
        return renderEmailProperties();
      case 'condition':
        return renderConditionProperties();
      case 'trigger':
        return renderTriggerProperties();
      default:
        return <div className="text-muted-foreground">No properties available</div>;
    }
  };

  return (
    <div className="w-80 border-l bg-background p-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">{selectedNode.data.label} Properties</h3>
        {getPropertiesContent()}
      </Card>
    </div>
  );
};

export default PropertiesPanel;

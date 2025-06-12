
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkflow } from '../context/WorkflowContext';

const PropertiesPanel = () => {
  const { selectedNode, setSelectedNode, setNodes } = useWorkflow();

  const updateNodeData = (key: string, value: any) => {
    if (!selectedNode) return;
    
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === selectedNode.id
          ? {
              ...node,
              data: {
                ...node.data,
                config: {
                  ...node.data.config,
                  [key]: value
                }
              }
            }
          : node
      )
    );
  };

  if (!selectedNode) {
    return (
      <Card className="w-80 h-full rounded-none border-l border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            Select a node to view its properties
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderConfigFields = () => {
    const config = selectedNode.data.config || {};
    
    switch (selectedNode.type) {
      case 'webhook':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                value={config.url || ''}
                onChange={(e) => updateNodeData('url', e.target.value)}
                placeholder="https://example.com/webhook"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook-method">Method</Label>
              <Select
                value={config.method || 'POST'}
                onValueChange={(value) => updateNodeData('method', value)}
              >
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
          </>
        );
      
      case 'email':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="email-to">To</Label>
              <Input
                id="email-to"
                value={config.to || ''}
                onChange={(e) => updateNodeData('to', e.target.value)}
                placeholder="recipient@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                value={config.subject || ''}
                onChange={(e) => updateNodeData('subject', e.target.value)}
                placeholder="Email subject"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-body">Body</Label>
              <Textarea
                id="email-body"
                value={config.body || ''}
                onChange={(e) => updateNodeData('body', e.target.value)}
                placeholder="Email content..."
                rows={4}
              />
            </div>
          </>
        );
      
      case 'condition':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="condition-operator">Operator</Label>
              <Select
                value={config.operator || 'equals'}
                onValueChange={(value) => updateNodeData('operator', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="not_equals">Not Equals</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="greater_than">Greater Than</SelectItem>
                  <SelectItem value="less_than">Less Than</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="condition-value">Value</Label>
              <Input
                id="condition-value"
                value={config.value || ''}
                onChange={(e) => updateNodeData('value', e.target.value)}
                placeholder="Comparison value"
              />
            </div>
          </>
        );
      
      default:
        return (
          <div className="space-y-2">
            <Label htmlFor="node-name">Node Name</Label>
            <Input
              id="node-name"
              value={selectedNode.data.label || ''}
              onChange={(e) => updateNodeData('label', e.target.value)}
              placeholder="Node name"
            />
          </div>
        );
    }
  };

  return (
    <Card className="w-80 h-full rounded-none border-l border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Properties
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedNode(null)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-full">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Node Type</Label>
              <div className="text-sm text-muted-foreground capitalize">
                {selectedNode.type}
              </div>
            </div>
            {renderConfigFields()}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PropertiesPanel;

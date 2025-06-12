
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkflow } from '../context/WorkflowContext';

interface PropertiesPanelProps {
  onSave: () => void;
}

interface NodeConfig {
  [key: string]: any;
  event?: string;
  interval?: string;
  to?: string;
  subject?: string;
  body?: string;
  url?: string;
  method?: string;
  field?: string;
  operator?: string;
  value?: string;
  operation?: string;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ onSave }) => {
  const { selectedNode, setNodes } = useWorkflow();
  const [config, setConfig] = React.useState<NodeConfig>(selectedNode?.data?.config || {});

  React.useEffect(() => {
    setConfig(selectedNode?.data?.config || {});
  }, [selectedNode]);

  const handleSave = () => {
    if (selectedNode) {
      setNodes(prev => prev.map(node => 
        node.id === selectedNode.id 
          ? { ...node, data: { ...node.data, config } }
          : node
      ));
    }
    onSave();
  };

  const getPropertiesContent = (): React.ReactNode => {
    if (!selectedNode) return null;

    switch (selectedNode.type) {
      case 'trigger':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="event">Event Type</Label>
              <Select value={config.event || 'manual'} onValueChange={(value) => setConfig({...config, event: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
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
                <Label htmlFor="interval">Interval</Label>
                <Input
                  id="interval"
                  value={config.interval || ''}
                  onChange={(e) => setConfig({...config, interval: e.target.value})}
                  placeholder="e.g., 5 minutes"
                />
              </div>
            )}
          </div>
        );

      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                value={config.to || ''}
                onChange={(e) => setConfig({...config, to: e.target.value})}
                placeholder="recipient@example.com"
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={config.subject || ''}
                onChange={(e) => setConfig({...config, subject: e.target.value})}
                placeholder="Email subject"
              />
            </div>
            <div>
              <Label htmlFor="body">Body</Label>
              <textarea
                id="body"
                className="w-full p-2 border rounded-md"
                value={config.body || ''}
                onChange={(e) => setConfig({...config, body: e.target.value})}
                placeholder="Email content"
                rows={4}
              />
            </div>
          </div>
        );

      case 'webhook':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={config.url || ''}
                onChange={(e) => setConfig({...config, url: e.target.value})}
                placeholder="https://api.example.com/webhook"
              />
            </div>
            <div>
              <Label htmlFor="method">Method</Label>
              <Select value={config.method || 'POST'} onValueChange={(value) => setConfig({...config, method: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="HTTP Method" />
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

      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="field">Field</Label>
              <Input
                id="field"
                value={config.field || ''}
                onChange={(e) => setConfig({...config, field: e.target.value})}
                placeholder="Field to check"
              />
            </div>
            <div>
              <Label htmlFor="operator">Operator</Label>
              <Select value={config.operator || 'equals'} onValueChange={(value) => setConfig({...config, operator: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
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
            <div>
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={config.value || ''}
                onChange={(e) => setConfig({...config, value: e.target.value})}
                placeholder="Value to compare"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="operation">Operation</Label>
              <Input
                id="operation"
                value={config.operation || ''}
                onChange={(e) => setConfig({...config, operation: e.target.value})}
                placeholder="Operation to perform"
              />
            </div>
          </div>
        );
    }
  };

  if (!selectedNode) {
    return null;
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {selectedNode.data.label} Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={selectedNode.data.label || ''}
                onChange={(e) => {
                  if (selectedNode) {
                    setNodes(prev => prev.map(node => 
                      node.id === selectedNode.id 
                        ? { ...node, data: { ...node.data, label: e.target.value } }
                        : node
                    ));
                  }
                }}
                placeholder="Node label"
              />
            </div>
            
            {getPropertiesContent()}
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1">
                Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertiesPanel;

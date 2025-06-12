
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
  message?: string;
  phoneNumber?: string;
  text?: string;
  fileName?: string;
  link?: string;
  screen?: string;
  column?: string;
  soundUrl?: string;
  mapAddress?: string;
  fileType?: string;
}

const PropertiesPanel: React.FC = () => {
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
    return null;
  }

  const config = (selectedNode.data.config as NodeConfig) || {};

  const renderDialogProperties = (): React.ReactNode => (
    <div className="space-y-4">
      <div>
        <Label>Dialog Message</Label>
        <Textarea
          value={config.message || ''}
          onChange={(e) => updateNodeData({ message: e.target.value })}
          placeholder="Enter dialog message"
        />
      </div>
    </div>
  );

  const renderSnackbarProperties = (): React.ReactNode => (
    <div className="space-y-4">
      <div>
        <Label>Message</Label>
        <Input
          value={config.message || ''}
          onChange={(e) => updateNodeData({ message: e.target.value })}
          placeholder="Snackbar message"
        />
      </div>
    </div>
  );

  const renderEmailProperties = (): React.ReactNode => (
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

  const renderPhoneProperties = (): React.ReactNode => (
    <div className="space-y-4">
      <div>
        <Label>Phone Number</Label>
        <Input
          value={config.phoneNumber || ''}
          onChange={(e) => updateNodeData({ phoneNumber: e.target.value })}
          placeholder="+1234567890"
        />
      </div>
    </div>
  );

  const renderSMSProperties = (): React.ReactNode => (
    <div className="space-y-4">
      <div>
        <Label>Phone Number</Label>
        <Input
          value={config.phoneNumber || ''}
          onChange={(e) => updateNodeData({ phoneNumber: e.target.value })}
          placeholder="+1234567890"
        />
      </div>
      <div>
        <Label>Message</Label>
        <Textarea
          value={config.text || ''}
          onChange={(e) => updateNodeData({ text: e.target.value })}
          placeholder="SMS message"
        />
      </div>
    </div>
  );

  const renderWhatsAppProperties = (): React.ReactNode => (
    <div className="space-y-4">
      <div>
        <Label>Phone Number</Label>
        <Input
          value={config.phoneNumber || ''}
          onChange={(e) => updateNodeData({ phoneNumber: e.target.value })}
          placeholder="+1234567890"
        />
      </div>
      <div>
        <Label>Message</Label>
        <Textarea
          value={config.text || ''}
          onChange={(e) => updateNodeData({ text: e.target.value })}
          placeholder="WhatsApp message"
        />
      </div>
    </div>
  );

  const renderClipboardProperties = (): React.ReactNode => (
    <div className="space-y-4">
      <div>
        <Label>Text to Copy</Label>
        <Textarea
          value={config.text || ''}
          onChange={(e) => updateNodeData({ text: e.target.value })}
          placeholder="Text to copy to clipboard"
        />
      </div>
    </div>
  );

  const renderDownloadProperties = (): React.ReactNode => (
    <div className="space-y-4">
      <div>
        <Label>File URL</Label>
        <Input
          value={config.url || ''}
          onChange={(e) => updateNodeData({ url: e.target.value })}
          placeholder="https://example.com/file.pdf"
        />
      </div>
      <div>
        <Label>File Name</Label>
        <Input
          value={config.fileName || ''}
          onChange={(e) => updateNodeData({ fileName: e.target.value })}
          placeholder="document.pdf"
        />
      </div>
    </div>
  );

  const renderWebhookProperties = (): React.ReactNode => (
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

  const renderConditionProperties = (): React.ReactNode => (
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

  const renderTriggerProperties = (): React.ReactNode => (
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
            <SelectItem value="component">Component Action</SelectItem>
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

  const renderCodeProperties = (): React.ReactNode => (
    <div className="space-y-4">
      <div>
        <Label>Code</Label>
        <Textarea
          value={config.text || ''}
          onChange={(e) => updateNodeData({ text: e.target.value })}
          placeholder="Enter your code here"
          className="min-h-32 font-mono"
        />
      </div>
    </div>
  );

  const getPropertiesContent = (): React.ReactNode => {
    if (!selectedNode?.type) {
      return <div className="text-muted-foreground">No properties available</div>;
    }

    switch (selectedNode.type) {
      case 'show-dialog':
        return renderDialogProperties();
      case 'show-snackbar':
        return renderSnackbarProperties();
      case 'compose-email':
      case 'send-email':
        return renderEmailProperties();
      case 'phone-call':
        return renderPhoneProperties();
      case 'sms':
        return renderSMSProperties();
      case 'whatsapp':
        return renderWhatsAppProperties();
      case 'copy-clipboard':
        return renderClipboardProperties();
      case 'download':
        return renderDownloadProperties();
      case 'webhook':
      case 'http-request':
        return renderWebhookProperties();
      case 'condition':
        return renderConditionProperties();
      case 'trigger':
        return renderTriggerProperties();
      case 'code':
        return renderCodeProperties();
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


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Save, 
  Trash2,
  Clock,
  Mail,
  Database,
  Globe,
  Zap,
  GitBranch,
  Webhook
} from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';

interface PropertiesPanelProps {
  onSave: () => void;
}

interface NodeConfig {
  [key: string]: any;
}

interface NodeData {
  label?: string;
  description?: string;
  enabled?: boolean;
  config?: NodeConfig;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ onSave }) => {
  const { selectedNode, setSelectedNode, setNodes } = useWorkflow();
  const [nodeData, setNodeData] = useState<NodeData>(selectedNode?.data || {});

  if (!selectedNode) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center text-muted-foreground">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a node to edit its properties</p>
        </div>
      </div>
    );
  }

  const updateNodeData = (key: string, value: any) => {
    const updatedData = { ...nodeData, [key]: value };
    setNodeData(updatedData);
    
    setNodes(prev => prev.map(node => 
      node.id === selectedNode.id 
        ? { ...node, data: { ...node.data, ...updatedData } }
        : node
    ));
  };

  const updateNodeConfig = (key: string, value: any) => {
    const currentConfig = nodeData.config || {};
    const updatedConfig = { ...currentConfig, [key]: value };
    updateNodeData('config', updatedConfig);
  };

  const getConfigValue = (key: string, defaultValue: any = '') => {
    return nodeData.config?.[key] ?? defaultValue;
  };

  const handleSave = () => {
    setSelectedNode(null);
    onSave();
  };

  const handleDelete = () => {
    setNodes(prev => prev.filter(node => node.id !== selectedNode.id));
    setSelectedNode(null);
    onSave();
  };

  const getNodeIcon = (type: string): React.ReactNode => {
    switch (type) {
      case 'trigger':
        return <Zap className="w-5 h-5 text-green-600" />;
      case 'action':
        return <Zap className="w-5 h-5 text-blue-600" />;
      case 'condition':
        return <GitBranch className="w-5 h-5 text-orange-600" />;
      case 'webhook':
        return <Webhook className="w-5 h-5 text-purple-600" />;
      case 'email':
        return <Mail className="w-5 h-5 text-red-600" />;
      case 'database':
        return <Database className="w-5 h-5 text-yellow-600" />;
      case 'api':
        return <Globe className="w-5 h-5 text-indigo-600" />;
      default:
        return <Settings className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPropertiesContent = (): React.ReactNode => {
    const nodeType = selectedNode.type;
    
    switch (nodeType) {
      case 'trigger':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="trigger-type">Trigger Type</Label>
              <Select
                value={getConfigValue('event', 'manual')}
                onValueChange={(value) => updateNodeConfig('event', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="schedule">Schedule</SelectItem>
                  <SelectItem value="webhook">Webhook</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {getConfigValue('event') === 'schedule' && (
              <div>
                <Label htmlFor="interval">Interval</Label>
                <Input
                  id="interval"
                  value={getConfigValue('interval', '')}
                  onChange={(e) => updateNodeConfig('interval', e.target.value)}
                  placeholder="e.g., 5 minutes, 1 hour"
                />
              </div>
            )}
          </div>
        );

      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email-to">To</Label>
              <Input
                id="email-to"
                value={getConfigValue('to', '')}
                onChange={(e) => updateNodeConfig('to', e.target.value)}
                placeholder="recipient@example.com"
              />
            </div>
            <div>
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                value={getConfigValue('subject', '')}
                onChange={(e) => updateNodeConfig('subject', e.target.value)}
                placeholder="Email subject"
              />
            </div>
            <div>
              <Label htmlFor="email-body">Body</Label>
              <Textarea
                id="email-body"
                value={getConfigValue('body', '')}
                onChange={(e) => updateNodeConfig('body', e.target.value)}
                placeholder="Email content"
                rows={4}
              />
            </div>
          </div>
        );

      case 'database':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="db-operation">Operation</Label>
              <Select
                value={getConfigValue('operation', 'create')}
                onValueChange={(value) => updateNodeConfig('operation', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="db-table">Table</Label>
              <Input
                id="db-table"
                value={getConfigValue('table', '')}
                onChange={(e) => updateNodeConfig('table', e.target.value)}
                placeholder="Table name"
              />
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-method">Method</Label>
              <Select
                value={getConfigValue('method', 'GET')}
                onValueChange={(value) => updateNodeConfig('method', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="api-url">URL</Label>
              <Input
                id="api-url"
                value={getConfigValue('url', '')}
                onChange={(e) => updateNodeConfig('url', e.target.value)}
                placeholder="https://api.example.com/endpoint"
              />
            </div>
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="condition-field">Field</Label>
              <Input
                id="condition-field"
                value={getConfigValue('field', '')}
                onChange={(e) => updateNodeConfig('field', e.target.value)}
                placeholder="Field to check"
              />
            </div>
            <div>
              <Label htmlFor="condition-operator">Operator</Label>
              <Select
                value={getConfigValue('operator', 'equals')}
                onValueChange={(value) => updateNodeConfig('operator', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
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
              <Label htmlFor="condition-value">Value</Label>
              <Input
                id="condition-value"
                value={getConfigValue('value', '')}
                onChange={(e) => updateNodeConfig('value', e.target.value)}
                placeholder="Value to compare"
              />
            </div>
          </div>
        );

      case 'webhook':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                value={getConfigValue('url', '')}
                onChange={(e) => updateNodeConfig('url', e.target.value)}
                placeholder="https://example.com/webhook"
              />
            </div>
            <div>
              <Label htmlFor="webhook-method">Method</Label>
              <Select
                value={getConfigValue('method', 'POST')}
                onValueChange={(value) => updateNodeConfig('method', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
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

      default:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="action-type">Action Type</Label>
              <Input
                id="action-type"
                value={getConfigValue('action', '')}
                onChange={(e) => updateNodeConfig('action', e.target.value)}
                placeholder="Action to perform"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b">
        <div className="flex items-center gap-3 mb-2">
          {getNodeIcon(selectedNode.type)}
          <div>
            <h3 className="font-semibold text-lg">
              {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)} Node
            </h3>
            <Badge variant="secondary" className="text-xs">
              {selectedNode.id}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="properties" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>
          
          <TabsContent value="properties" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Configuration</CardTitle>
                <CardDescription>
                  Configure the specific settings for this {selectedNode.type} node
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getPropertiesContent()}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="general" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">General Settings</CardTitle>
                <CardDescription>
                  Basic node configuration and metadata
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="node-label">Label</Label>
                  <Input
                    id="node-label"
                    value={nodeData.label || ''}
                    onChange={(e) => updateNodeData('label', e.target.value)}
                    placeholder="Node label"
                  />
                </div>
                
                <div>
                  <Label htmlFor="node-description">Description</Label>
                  <Textarea
                    id="node-description"
                    value={nodeData.description || ''}
                    onChange={(e) => updateNodeData('description', e.target.value)}
                    placeholder="Node description"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="node-enabled"
                    checked={nodeData.enabled !== false}
                    onCheckedChange={(checked) => updateNodeData('enabled', checked)}
                  />
                  <Label htmlFor="node-enabled">Enabled</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Separator />
      
      <div className="p-4 space-y-2">
        <Button onClick={handleSave} className="w-full" size="sm">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
        
        <Button 
          onClick={handleDelete} 
          variant="destructive" 
          className="w-full" 
          size="sm"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Node
        </Button>
      </div>
    </div>
  );
};

export default PropertiesPanel;

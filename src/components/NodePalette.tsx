
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Zap, 
  Play, 
  GitBranch, 
  Webhook, 
  Mail, 
  Database, 
  Globe,
  Calendar,
  FileText,
  Settings
} from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';

const nodeCategories = [
  {
    title: 'Triggers',
    nodes: [
      { type: 'trigger', label: 'Manual Trigger', icon: Play, color: 'text-green-600' },
      { type: 'webhook', label: 'Webhook', icon: Webhook, color: 'text-blue-600' },
      { type: 'trigger', label: 'Schedule', icon: Calendar, color: 'text-purple-600' }
    ]
  },
  {
    title: 'Actions',
    nodes: [
      { type: 'email', label: 'Send Email', icon: Mail, color: 'text-red-600' },
      { type: 'database', label: 'Database', icon: Database, color: 'text-yellow-600' },
      { type: 'api', label: 'HTTP Request', icon: Globe, color: 'text-indigo-600' }
    ]
  },
  {
    title: 'Logic',
    nodes: [
      { type: 'condition', label: 'Condition', icon: GitBranch, color: 'text-orange-600' },
      { type: 'action', label: 'Code', icon: FileText, color: 'text-gray-600' }
    ]
  }
];

const NodePalette = () => {
  const { addNode } = useWorkflow();

  const handleNodeDrag = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleNodeClick = (nodeType: string) => {
    // Add node at center of canvas
    addNode(nodeType, { x: 250, y: 250 });
  };

  return (
    <Card className="w-80 h-full rounded-none border-r border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Node Palette
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6">
            {nodeCategories.map((category) => (
              <div key={category.title}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  {category.title}
                </h3>
                <div className="space-y-2">
                  {category.nodes.map((node) => (
                    <Button
                      key={`${node.type}-${node.label}`}
                      variant="ghost"
                      className="w-full justify-start h-auto p-3 hover:bg-accent"
                      draggable
                      onDragStart={(e) => handleNodeDrag(e, node.type)}
                      onClick={() => handleNodeClick(node.type)}
                    >
                      <node.icon className={`w-4 h-4 mr-3 ${node.color}`} />
                      <span className="text-sm">{node.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NodePalette;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Calendar, 
  GitBranch,
  Settings,
  MessageSquare,
  Mail,
  Phone,
  Share,
  Copy,
  Download,
  FileText,
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  MapPin,
  Plus,
  Edit,
  Trash2,
  RotateCw,
  ToggleLeft,
  Code,
  Zap,
  Webhook,
  Database,
  Globe,
  Clipboard,
  ArrowUp,
  ArrowDown,
  Layers,
  X,
  Navigation,
  SkipBack,
  SkipForward,
  RotateCcw
} from 'lucide-react';
import { useWorkflow } from '../context/WorkflowContext';

const nodeCategories = [
  {
    title: 'Triggers',
    nodes: [
      { type: 'component-action', label: 'Component Action', icon: Zap, color: 'text-green-600' },
      { type: 'manual-trigger', label: 'Manual Trigger', icon: Play, color: 'text-green-600' },
      { type: 'schedule', label: 'Schedule', icon: Calendar, color: 'text-green-600' },
      { type: 'webhook', label: 'Webhook', icon: Webhook, color: 'text-blue-600' }
    ]
  },
  {
    title: 'UI Actions',
    nodes: [
      { type: 'none', label: 'None', icon: X, color: 'text-blue-600' },
      { type: 'show-dialog', label: 'Show Dialog', icon: MessageSquare, color: 'text-blue-600' },
      { type: 'show-snackbar', label: 'Show Snackbar', icon: MessageSquare, color: 'text-blue-600' },
      { type: 'open-overlay', label: 'Open Overlay', icon: Layers, color: 'text-blue-600' },
      { type: 'close-overlay', label: 'Close Overlay', icon: X, color: 'text-blue-600' },
      { type: 'go-to-screen', label: 'Go To Screen', icon: Navigation, color: 'text-blue-600' }
    ]
  },
  {
    title: 'Communication',
    nodes: [
      { type: 'compose-email', label: 'Compose Email', icon: Edit, color: 'text-red-600' },
      { type: 'phone-call', label: 'Make Phone Call', icon: Phone, color: 'text-red-600' },
      { type: 'sms', label: 'Start SMS', icon: MessageSquare, color: 'text-red-600' },
      { type: 'whatsapp', label: 'Start WhatsApp', icon: MessageSquare, color: 'text-red-600' },
      { type: 'send-email', label: 'Send Email', icon: Mail, color: 'text-red-600' }
    ]
  },
  {
    title: 'Data & Files',
    nodes: [
      { type: 'copy-clipboard', label: 'Copy to Clipboard', icon: Clipboard, color: 'text-blue-600' },
      { type: 'download', label: 'Download', icon: Download, color: 'text-blue-600' },
      { type: 'share', label: 'Share', icon: Share, color: 'text-blue-600' },
      { type: 'open-file', label: 'Open File', icon: FileText, color: 'text-gray-600' },
      { type: 'open-link', label: 'Open Link', icon: Globe, color: 'text-indigo-600' },
      { type: 'open-map', label: 'Open Map', icon: MapPin, color: 'text-blue-600' }
    ]
  },
  {
    title: 'Navigation',
    nodes: [
      { type: 'go-back', label: 'Go Back', icon: ArrowLeft, color: 'text-blue-600' },
      { type: 'previous-item', label: 'Previous Item', icon: SkipBack, color: 'text-blue-600' },
      { type: 'next-item', label: 'Next Item', icon: SkipForward, color: 'text-blue-600' }
    ]
  },
  {
    title: 'Database',
    nodes: [
      { type: 'add-row', label: 'Add New Row', icon: Plus, color: 'text-yellow-600' },
      { type: 'modify-column', label: 'Modify Column', icon: Edit, color: 'text-yellow-600' },
      { type: 'delete-row', label: 'Delete Row', icon: Trash2, color: 'text-yellow-600' },
      { type: 'duplicate-row', label: 'Duplicate Row', icon: Copy, color: 'text-yellow-600' },
      { type: 'open-update-form', label: 'Update Form', icon: Settings, color: 'text-yellow-600' }
    ]
  },
  {
    title: 'Values',
    nodes: [
      { type: 'increment-value', label: 'Increment Value', icon: ArrowUp, color: 'text-blue-600' },
      { type: 'toggle-value', label: 'Toggle Value', icon: ToggleLeft, color: 'text-blue-600' }
    ]
  },
  {
    title: 'Network',
    nodes: [
      { type: 'http-request', label: 'HTTP Request', icon: Globe, color: 'text-indigo-600' }
    ]
  },
  {
    title: 'Logic',
    nodes: [
      { type: 'condition', label: 'Condition', icon: GitBranch, color: 'text-orange-600' },
      { type: 'code', label: 'Code', icon: Code, color: 'text-gray-600' }
    ]
  }
];

interface NodePaletteProps {
  onNodeAdded?: () => void;
}

const NodePalette: React.FC<NodePaletteProps> = ({ onNodeAdded }) => {
  const { addNode, addNodeWithConnection, pendingConnection } = useWorkflow();

  const handleNodeClick = (nodeType: string) => {
    if (pendingConnection) {
      // If there's a pending connection, use the special handler
      addNodeWithConnection(nodeType);
    } else {
      // Otherwise, add node normally
      addNode(nodeType, { x: 250, y: 250 });
    }
    onNodeAdded?.();
  };

  return (
    <div className="h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">
          {pendingConnection ? 'Select Node to Connect' : 'Add Node'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {pendingConnection 
            ? 'Choose a node to connect to the selected node' 
            : 'Choose a node to add to your workflow'
          }
        </p>
      </div>
      
      <ScrollArea className="h-full pb-16">
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
    </div>
  );
};

export default NodePalette;

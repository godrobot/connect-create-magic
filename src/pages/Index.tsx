
import React, { useState } from 'react';
import WorkflowCanvas from '../components/WorkflowCanvas';
import NodePalette from '../components/NodePalette';
import PropertiesPanel from '../components/PropertiesPanel';
import WorkflowToolbar from '../components/WorkflowToolbar';
import { WorkflowProvider, useWorkflow } from '../context/WorkflowContext';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

const WorkflowContent = () => {
  const { selectedNode, setSelectedNode, pendingConnection, setPendingConnection } = useWorkflow();
  const [showNodePalette, setShowNodePalette] = useState(false);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);

  // Show node palette when there's a pending connection (priority over properties panel)
  React.useEffect(() => {
    console.log('Pending connection changed:', pendingConnection);
    if (pendingConnection) {
      console.log('Setting showNodePalette to true and hiding properties');
      setShowNodePalette(true);
      setShowPropertiesPanel(false);
    } else {
      setShowNodePalette(false);
    }
  }, [pendingConnection]);

  // Show properties panel when a node is selected, but only if no pending connection
  React.useEffect(() => {
    console.log('Selected node changed:', selectedNode, 'pendingConnection:', pendingConnection);
    if (selectedNode && !pendingConnection) {
      console.log('Showing properties panel for selected node');
      setShowPropertiesPanel(true);
      setShowNodePalette(false);
    } else if (!pendingConnection) {
      setShowPropertiesPanel(false);
    }
  }, [selectedNode, pendingConnection]);

  const handleAddNodeClick = () => {
    setShowNodePalette(true);
    setShowPropertiesPanel(false);
    setSelectedNode(null);
    setPendingConnection(null);
  };

  const handleNodeAdded = () => {
    setShowNodePalette(false);
    setPendingConnection(null);
  };

  const handlePropertiesSave = () => {
    setShowPropertiesPanel(false);
    setSelectedNode(null);
  };

  const handleCloseSidebar = () => {
    setShowNodePalette(false);
    setShowPropertiesPanel(false);
    setSelectedNode(null);
    setPendingConnection(null);
  };

  console.log('Render state - showNodePalette:', showNodePalette, 'showPropertiesPanel:', showPropertiesPanel, 'pendingConnection:', !!pendingConnection);

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      <WorkflowToolbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 relative">
          <WorkflowCanvas />
          
          {/* Floating Add Button */}
          <div className="absolute top-4 right-4 z-10">
            <Button
              onClick={handleAddNodeClick}
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Collapsible Right Sidebar */}
        {(showNodePalette || showPropertiesPanel) && (
          <div className="w-80 border-l bg-background relative">
            <Button
              onClick={handleCloseSidebar}
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10"
            >
              <X className="h-4 w-4" />
            </Button>
            
            {showNodePalette && (
              <NodePalette onNodeAdded={handleNodeAdded} />
            )}
            
            {showPropertiesPanel && selectedNode && (
              <PropertiesPanel onSave={handlePropertiesSave} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <WorkflowProvider>
      <WorkflowContent />
    </WorkflowProvider>
  );
};

export default Index;

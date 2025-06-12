
import React from 'react';
import WorkflowCanvas from '../components/WorkflowCanvas';
import NodePalette from '../components/NodePalette';
import PropertiesPanel from '../components/PropertiesPanel';
import WorkflowToolbar from '../components/WorkflowToolbar';
import { WorkflowProvider } from '../context/WorkflowContext';

const Index = () => {
  return (
    <WorkflowProvider>
      <div className="h-screen w-full flex flex-col bg-background">
        <WorkflowToolbar />
        <div className="flex flex-1 overflow-hidden">
          <NodePalette />
          <div className="flex-1 relative">
            <WorkflowCanvas />
          </div>
          <PropertiesPanel />
        </div>
      </div>
    </WorkflowProvider>
  );
};

export default Index;

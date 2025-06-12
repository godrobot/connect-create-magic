
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Square, 
  Save, 
  FileText, 
  Download, 
  Upload,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WorkflowToolbar = () => {
  const { toast } = useToast();

  const handleExecute = () => {
    toast({
      title: "Workflow Executed",
      description: "Your workflow has been triggered successfully.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Workflow Saved",
      description: "Your workflow has been saved successfully.",
    });
  };

  return (
    <div className="h-14 border-b border-border bg-background px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 mr-4">
          <Zap className="w-6 h-6 text-primary" />
          <h1 className="text-lg font-semibold">Workflow Automation</h1>
        </div>
        
        <Button onClick={handleExecute} size="sm" className="gap-2">
          <Play className="w-4 h-4" />
          Execute
        </Button>
        
        <Button variant="outline" size="sm" className="gap-2">
          <Square className="w-4 h-4" />
          Stop
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="w-4 h-4" />
          Import
        </Button>
        
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
        
        <Button onClick={handleSave} variant="outline" size="sm" className="gap-2">
          <Save className="w-4 h-4" />
          Save
        </Button>
        
        <Button variant="outline" size="sm" className="gap-2">
          <FileText className="w-4 h-4" />
          New
        </Button>
      </div>
    </div>
  );
};

export default WorkflowToolbar;

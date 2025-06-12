
import React from 'react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { 
  Play,
  Square,
  Settings,
  Trash2
} from 'lucide-react';

interface NodeHoverActionsProps {
  children: React.ReactNode;
  onPlay?: () => void;
  onStop?: () => void;
  onSettings?: () => void;
  onDelete?: () => void;
}

const NodeHoverActions: React.FC<NodeHoverActionsProps> = ({
  children,
  onPlay,
  onStop,
  onSettings,
  onDelete
}) => {
  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent 
        side="top" 
        className="w-auto p-1 bg-background border border-border shadow-lg"
        sideOffset={8}
      >
        <div className="flex gap-1">
          {onPlay && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-accent"
              onClick={onPlay}
              title="Run"
            >
              <Play className="w-4 h-4" />
            </Button>
          )}
          {onStop && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-accent"
              onClick={onStop}
              title="Stop"
            >
              <Square className="w-4 h-4" />
            </Button>
          )}
          {onSettings && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-accent"
              onClick={onSettings}
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
              onClick={onDelete}
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default NodeHoverActions;

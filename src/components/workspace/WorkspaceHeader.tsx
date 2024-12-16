import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';

interface WorkspaceHeaderProps {
  onRefresh: () => void;
  loading: boolean;
  hasWorkspaces: boolean;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({ onRefresh, loading, hasWorkspaces }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-xs">
        {'>'} Workspace Command Center <span className="animate-blink">_</span>
      </h1>
      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        disabled={loading || !hasWorkspaces}
        className="text-xs h-6"
      >
        <RotateCw className="mr-1 h-3 w-3" />
        Refresh
      </Button>
    </div>
  );
};
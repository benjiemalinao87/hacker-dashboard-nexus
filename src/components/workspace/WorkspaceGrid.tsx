import React from 'react';
import { WorkspaceCard } from './WorkspaceCard';
import { WorkspaceData } from './types';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';

interface WorkspaceGridProps {
  workspaces: Record<string, WorkspaceData>;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const WorkspaceGrid = ({ workspaces, onRefresh, isRefreshing }: WorkspaceGridProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xs">
          {'>'} Workspace Command Center <span className="animate-blink">_</span>
        </h1>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-6 px-2 hover:bg-terminal-green/10"
        >
          <RotateCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5">
        {Object.entries(workspaces).map(([id, data]) => (
          <WorkspaceCard key={id} data={data} />
        ))}
      </div>
    </div>
  );
};
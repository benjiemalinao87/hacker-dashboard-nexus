import React from 'react';
import { WorkspaceCard } from './WorkspaceCard';
import { WorkspaceData } from '@/types/workspace';

interface WorkspaceGridProps {
  workspaces: Record<string, WorkspaceData>;
}

export const WorkspaceGrid: React.FC<WorkspaceGridProps> = ({ workspaces }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5">
      {Object.entries(workspaces).map(([id, data]) => (
        <WorkspaceCard key={id} data={data} />
      ))}
    </div>
  );
};
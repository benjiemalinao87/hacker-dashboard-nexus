import React from 'react';
import { WorkspaceCard } from './WorkspaceCard';
import { WorkspaceData } from '@/types/workspace';

interface WorkspaceGridProps {
  workspaces: Record<string, WorkspaceData>;
  onDelete: (id: string) => void;
}

export const WorkspaceGrid: React.FC<WorkspaceGridProps> = ({ workspaces, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Object.entries(workspaces).map(([id, data]) => (
        <WorkspaceCard 
          key={id} 
          id={id}
          data={data} 
          onDelete={() => onDelete(id)}
        />
      ))}
    </div>
  );
};
import React from 'react';
import { ActivityCard } from './ActivityCard';
import { Pin, PinOff } from 'lucide-react';
import { useSidePanel } from '@/contexts/SidePanelContext';
import { cn } from '@/lib/utils';
import { WorkspaceData } from '@/types/workspace';

interface RightSidebarProps {
  workspaces: Record<string, WorkspaceData>;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ workspaces }) => {
  const { isPinned, togglePin } = useSidePanel();

  const activities = Object.entries(workspaces).map(([id, workspace]) => ({
    status: workspace.bot_user_used >= workspace.bot_user_limit * 0.9 ? 'Critical' : 'Normal',
    timeAgo: 'Just now', // Placeholder for time ago
    percentage: (workspace.bot_user_used / workspace.bot_user_limit) * 100,
    type: 'Bot Usage',
    userName: workspace.name,
  }));

  return (
    <div 
      className={cn(
        "fixed right-0 top-0 h-screen w-[400px] bg-black/20 backdrop-blur-sm p-4",
        "transition-transform duration-300 ease-in-out border-l border-terminal-green/20 z-50",
        isPinned ? "translate-x-0" : "translate-x-[340px] hover:translate-x-0"
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-terminal-green text-sm font-mono">Workspace Limits</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={togglePin}
            className="text-terminal-green/60 hover:text-terminal-green transition-colors"
          >
            {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
          </button>
          <span className="text-terminal-green/60 text-xs flex items-center gap-1">
            Live Updates <span className="animate-pulse">●</span>
          </span>
        </div>
      </div>
      <div className="space-y-2 overflow-y-auto h-[calc(100vh-6rem)] pr-2 custom-scrollbar">
        {activities.length > 0 ? activities.map((activity, index) => (
          <ActivityCard key={index} {...activity} />
        )) : (
          <div className="text-terminal-green/60 text-sm">No workspaces added.</div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { ActivityCard } from './ActivityCard';
import { Pin, PinOff } from 'lucide-react';
import { useSidePanel } from '@/contexts/SidePanelContext';

const mockActivities = [
  {
    status: 'Warning' as const,
    timeAgo: '2h ago',
    percentage: 92,
    type: 'Bot Usage' as const,
    userName: 'Tesla Motors',
  },
  {
    status: 'Critical' as const,
    timeAgo: '30m ago',
    percentage: 98,
    type: 'Member Limit' as const,
    userName: 'SpaceX',
  },
  {
    status: 'Normal' as const,
    timeAgo: '1h ago',
    percentage: 45,
    type: 'Bot Usage' as const,
    userName: 'Boring Company',
  },
  {
    status: 'Warning' as const,
    timeAgo: '4h ago',
    percentage: 88,
    type: 'Storage Usage' as const,
    userName: 'Neuralink',
  },
  {
    status: 'Critical' as const,
    timeAgo: '3h ago',
    percentage: 95,
    type: 'API Calls' as const,
    userName: 'Starlink',
  }
].filter(activity => 
  (activity.type === 'Bot Usage' && activity.percentage >= 90) || 
  (activity.type === 'Member Limit' && activity.percentage >= 90)
);

export const RightSidebar = () => {
  const { isPinned, togglePin } = useSidePanel();

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
        {mockActivities.map((activity, index) => (
          <ActivityCard key={index} {...activity} />
        ))}
      </div>
    </div>
  );
};
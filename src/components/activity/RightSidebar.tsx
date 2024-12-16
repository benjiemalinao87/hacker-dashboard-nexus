import React from 'react';
import { ActivityCard } from './ActivityCard';

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
];

export const RightSidebar = () => {
  return (
    <div className="fixed right-0 top-0 h-screen w-[400px] bg-black/20 backdrop-blur-sm p-4 transform translate-x-[360px] hover:translate-x-0 transition-transform duration-300 ease-in-out border-l border-terminal-green/20 z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-terminal-green text-sm font-mono">Workspace Limits</h2>
        <span className="text-terminal-green/60 text-xs">Live Updates ●</span>
      </div>
      <div className="space-y-2 overflow-y-auto h-[calc(100vh-6rem)] pr-2 custom-scrollbar">
        {mockActivities.map((activity, index) => (
          <ActivityCard key={index} {...activity} />
        ))}
      </div>
    </div>
  );
};
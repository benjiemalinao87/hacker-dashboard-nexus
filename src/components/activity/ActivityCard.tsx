import React from 'react';
import { Users, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkspaceData } from '@/types/workspace';

interface ActivityCardProps {
  workspace: WorkspaceData;
  type: 'bot_usage' | 'member_limit';
}

const getStatusColor = (percentage: number) => {
  if (percentage >= 95) return 'bg-red-500 text-white';
  if (percentage >= 90) return 'bg-yellow-600 text-black';
  return 'bg-terminal-green text-black';
};

const getIcon = (type: string) => {
  switch (type) {
    case 'bot_usage':
      return <Users className="w-4 h-4" />;
    case 'member_limit':
      return <Database className="w-4 h-4" />;
    default:
      return <Users className="w-4 h-4" />;
  }
};

const getStatus = (percentage: number) => {
  if (percentage >= 95) return 'Critical';
  if (percentage >= 90) return 'Warning';
  return 'Normal';
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  workspace,
  type,
}) => {
  const percentage = type === 'bot_usage' 
    ? (workspace.bot_user_used / workspace.bot_user_limit) * 100
    : (workspace.member_used / workspace.member_limit) * 100;

  // Only show the card if the percentage is above 90%
  if (percentage < 90) {
    return null;
  }

  const status = getStatus(percentage);

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 mb-2 hover:bg-black/60 transition-all duration-300 border border-terminal-green/20 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className={cn("px-2 py-0.5 rounded text-xs font-medium", getStatusColor(percentage))}>
            {status}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-terminal-green text-sm">{percentage.toFixed(0)}%</span>
          <span className="text-terminal-green/60">↗</span>
        </div>
      </div>
      
      <div className="w-full bg-terminal-dim h-1.5 rounded-full mb-3 overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out progress-heartbeat",
            percentage > 90 ? "bg-red-500" : percentage > 75 ? "bg-yellow-600" : "bg-terminal-green",
            "relative after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0",
            "after:bg-gradient-to-r after:from-transparent after:via-terminal-green/30 after:to-transparent",
            "after:animate-[shimmer_2s_infinite]"
          )}
          style={{ 
            width: `${percentage}%`,
            transform: 'translateX(0)',
            animation: percentage >= 95 ? 'heartbeat 0.8s ease-in-out infinite' : 'heartbeat 1.2s ease-in-out infinite'
          }}
        />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-terminal-black/50 rounded">
            {getIcon(type)}
          </span>
          <span className="text-sm text-terminal-green/90">
            {type === 'bot_usage' ? 'Bot Usage' : 'Member Limit'}
          </span>
        </div>
        <span className="text-sm text-terminal-green/60">{workspace.name}</span>
      </div>
    </div>
  );
};
import React from 'react';
import { Users, Database, HardDrive, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  status: 'Warning' | 'Critical' | 'Normal';
  timeAgo: string;
  percentage: number;
  type: 'Bot Usage' | 'Member Limit' | 'Storage Usage' | 'API Calls';
  userName: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Normal':
      return 'bg-terminal-green text-black';
    case 'Warning':
      return 'bg-yellow-600 text-black';
    case 'Critical':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500';
  }
};

const getIcon = (type: string) => {
  switch (type) {
    case 'Bot Usage':
      return <Users className="w-4 h-4" />;
    case 'Member Limit':
      return <Database className="w-4 h-4" />;
    case 'Storage Usage':
      return <HardDrive className="w-4 h-4" />;
    case 'API Calls':
      return <Wifi className="w-4 h-4" />;
    default:
      return <Users className="w-4 h-4" />;
  }
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  status,
  timeAgo,
  percentage,
  type,
  userName,
}) => {
  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 mb-2 hover:bg-black/60 transition-all duration-300 border border-terminal-green/20 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className={cn("px-2 py-0.5 rounded text-xs font-medium", getStatusColor(status))}>
            {status}
          </span>
          <span className="text-terminal-green/60 text-xs">{timeAgo}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-terminal-green text-sm">{percentage}%</span>
          <span className="text-terminal-green/60">↗</span>
        </div>
      </div>
      
      <div className="w-full bg-terminal-dim h-1.5 rounded-full mb-3 overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            percentage > 90 ? "bg-red-500" : percentage > 75 ? "bg-yellow-600" : "bg-terminal-green",
            "relative after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0",
            "after:bg-gradient-to-r after:from-transparent after:via-terminal-green/30 after:to-transparent",
            "after:animate-[shimmer_2s_infinite]"
          )}
          style={{ 
            width: `${percentage}%`,
            transform: 'translateX(0)',
            animation: 'slideIn 1s ease-out'
          }}
        />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-terminal-black/50 rounded">
            {getIcon(type)}
          </span>
          <span className="text-sm text-terminal-green/90">{type}</span>
        </div>
        <span className="text-sm text-terminal-green/60">{userName}</span>
      </div>
    </div>
  );
};
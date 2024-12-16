import React from 'react';
import { DollarSign, Car, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  status: 'Interested' | 'Abandoned' | 'Uninterested';
  timeAgo: string;
  percentage: number;
  type: 'Price Discussion' | 'Vehicle Features' | 'Test Drive';
  userName: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Interested':
      return 'bg-terminal-green text-black';
    case 'Abandoned':
      return 'bg-yellow-600 text-black';
    case 'Uninterested':
      return 'bg-red-900 text-white';
    default:
      return 'bg-gray-500';
  }
};

const getIcon = (type: string) => {
  switch (type) {
    case 'Price Discussion':
      return <DollarSign className="w-4 h-4" />;
    case 'Vehicle Features':
      return <Car className="w-4 h-4" />;
    case 'Test Drive':
      return <Calendar className="w-4 h-4" />;
    default:
      return null;
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
    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 mb-2 hover:bg-black/60 transition-all duration-300 border border-terminal-green/20">
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
      
      <div className="w-full bg-terminal-dim h-1.5 rounded-full mb-3">
        <div 
          className="bg-terminal-green h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
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
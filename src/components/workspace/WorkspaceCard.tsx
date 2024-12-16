import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WorkspaceData } from '@/types/workspace';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkspaceCardProps {
  id: string;
  data: WorkspaceData;
  onDelete: () => void;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ id, data, onDelete }) => {
  const botUsagePercentage = (data.bot_user_used / data.bot_user_limit) * 100;
  const botPercentage = (data.bot_used / data.bot_limit) * 100;
  const memberPercentage = (data.member_used / data.member_limit) * 100;

  const UsageBar = ({ used, total, label }: { used: number; total: number; label: string }) => {
    const percentage = (used / total) * 100;
    const isWarning = percentage >= 75;
    const isCritical = percentage >= 90;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-terminal-dim/30 border border-terminal-green/20" />
            <span className="text-terminal-green">{label}</span>
          </div>
          <span className={cn(
            "font-mono",
            isCritical ? "text-terminal-magenta" : "text-terminal-green"
          )}>
            {used}/{total}
          </span>
        </div>
        <div className="h-2 bg-terminal-dim rounded-sm overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-sm transition-all duration-1000 ease-out progress-heartbeat",
              isCritical ? "bg-terminal-magenta" : "bg-terminal-green",
              "relative after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0",
              "after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent",
              "after:animate-[shimmer_2s_infinite]"
            )}
            style={{ 
              width: `${percentage}%`,
              animation: isCritical ? 'heartbeat 1s ease-in-out infinite' : 'heartbeat 2s ease-in-out infinite'
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-black/40 backdrop-blur-sm border-terminal-green/20 hover:bg-black/60 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-terminal-green text-sm font-mono truncate max-w-[200px]">{data.name}</h3>
            <p className="text-terminal-green/60 text-xs">{data.plan}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-terminal-green/60 hover:text-red-500 hover:bg-red-500/20"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <UsageBar 
            used={data.bot_user_used}
            total={data.bot_user_limit}
            label="Bot Users"
          />
          
          <UsageBar 
            used={data.bot_used}
            total={data.bot_limit}
            label="Bots"
          />
          
          <UsageBar 
            used={data.member_used}
            total={data.member_limit}
            label="Members"
          />
        </div>
      </CardContent>
    </Card>
  );
};
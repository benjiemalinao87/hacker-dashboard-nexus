import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WorkspaceData } from '@/types/workspace';
import { UsagePieChart } from './UsagePieChart';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';

interface WorkspaceCardProps {
  id: string;
  data: WorkspaceData;
  onDelete: () => void;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ id, data, onDelete }) => {
  const botUsagePercentage = (data.bot_user_used / data.bot_user_limit) * 100;
  const memberUsagePercentage = (data.member_used / data.member_limit) * 100;

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
          <UsagePieChart
            percentage={botUsagePercentage}
            label="Bot Usage"
            warning={botUsagePercentage > 75}
            critical={botUsagePercentage > 90}
          />
          
          <UsagePieChart
            percentage={memberUsagePercentage}
            label="Member Usage"
            warning={memberUsagePercentage > 75}
            critical={memberUsagePercentage > 90}
          />
        </div>
      </CardContent>
    </Card>
  );
};
import React, { useMemo } from 'react';
import { WorkspaceData } from '@/types/workspace';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface LimitWarningFooterProps {
  workspaces: Record<string, WorkspaceData>;
}

interface ChartData {
  name: string;
  percentage: number;
  type: string;
}

export const LimitWarningFooter: React.FC<LimitWarningFooterProps> = ({ workspaces }) => {
  const chartData = useMemo(() => {
    const data: ChartData[] = [];
    
    Object.entries(workspaces).forEach(([_, workspace]) => {
      const botUserPercentage = (workspace.bot_user_used / workspace.bot_user_limit) * 100;
      const memberPercentage = (workspace.member_used / workspace.member_limit) * 100;
      const botPercentage = (workspace.bot_used / workspace.bot_limit) * 100;
      
      if (botUserPercentage > 80) {
        data.push({
          name: workspace.name,
          percentage: botUserPercentage,
          type: 'Bot Users'
        });
      }
      
      if (memberPercentage > 80) {
        data.push({
          name: workspace.name,
          percentage: memberPercentage,
          type: 'Members'
        });
      }
      
      if (botPercentage > 80) {
        data.push({
          name: workspace.name,
          percentage: botPercentage,
          type: 'Bots'
        });
      }
    });
    
    return data;
  }, [workspaces]);

  if (chartData.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-terminal-green/20 p-4 z-40">
      <h3 className="text-xs mb-2 text-terminal-green/60">Resource Usage Warnings (>80%)</h3>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#00ff00', fontSize: 10 }}
              interval={0}
              angle={-45}
              textAnchor="end"
            />
            <YAxis 
              tick={{ fill: '#00ff00', fontSize: 10 }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid #00ff00',
                borderRadius: '4px',
                color: '#00ff00'
              }}
            />
            <Bar 
              dataKey="percentage" 
              fill="#00ff00" 
              name="Usage %" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
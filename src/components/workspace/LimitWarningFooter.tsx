import React, { useMemo } from 'react';
import { WorkspaceData } from '@/types/workspace';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface LimitWarningFooterProps {
  workspaces: Record<string, WorkspaceData>;
}

interface ChartData {
  name: string;
  percentage: number;
  resourceType: string;
}

export const LimitWarningFooter: React.FC<LimitWarningFooterProps> = ({ workspaces }) => {
  const chartData = useMemo(() => {
    console.log('LimitWarningFooter: Received workspaces data:', workspaces);
    const workspaceMaxUsage: Record<string, ChartData> = {};
    
    Object.entries(workspaces).forEach(([id, workspace]) => {
      const usageData = [
        {
          type: 'Bot Users',
          percentage: (workspace.bot_user_used / workspace.bot_user_limit) * 100
        },
        {
          type: 'Members',
          percentage: (workspace.member_used / workspace.member_limit) * 100
        }
      ];
      
      console.log(`Workspace ${workspace.name} (${id}) usage percentages:`, usageData);
      
      // Find the highest usage percentage for this workspace
      const maxUsage = usageData.reduce((max, current) => {
        return current.percentage > max.percentage ? current : max;
      }, usageData[0]);
      
      if (maxUsage.percentage > 80) {
        workspaceMaxUsage[workspace.name] = {
          name: workspace.name,
          percentage: Math.round(maxUsage.percentage),
          resourceType: maxUsage.type
        };
      }
    });
    
    const data = Object.values(workspaceMaxUsage);
    console.log('LimitWarningFooter: Final chart data:', data);
    return data;
  }, [workspaces]);

  if (chartData.length === 0) {
    console.log('LimitWarningFooter: No chart data available (no items > 80%), returning null');
    return null;
  }

  console.log('LimitWarningFooter: Rendering chart with data:', chartData);
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-terminal-green/20 p-4 z-40">
      <h3 className="text-xs mb-2 text-terminal-green/60">Resource Usage Warnings ({'>'}80%)</h3>
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#00ff00', fontSize: 10 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fill: '#00ff00', fontSize: 10 }}
              domain={[0, 100]}
              label={{ 
                value: 'Usage %', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: '#00ff00' }
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid #00ff00',
                borderRadius: '4px',
                color: '#00ff00'
              }}
              formatter={(value: number, name: string, props: { payload: ChartData }) => [
                `${value}% (${props.payload.resourceType})`,
                'Usage'
              ]}
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
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#9b87f5', '#7E69AB'];

interface UsagePieChartProps {
  percentage: number;
  label: string;
  warning: boolean;
  critical: boolean;
}

export const UsagePieChart: React.FC<UsagePieChartProps> = ({ percentage, label, warning, critical }) => {
  const used = percentage;
  const remaining = 100 - percentage;

  const data = [
    { name: 'Used', value: used },
    { name: 'Available', value: remaining }
  ];

  const pieColors = critical ? ['#ef4444', '#7E69AB'] : 
                   warning ? ['#f59e0b', '#7E69AB'] : 
                   COLORS;

  return (
    <div className="flex items-center space-x-3">
      <div className="h-8 w-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={8}
              outerRadius={16}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1">
        <p className="text-terminal-green text-xs">{label}</p>
        <p className={`text-xs ${critical ? 'text-red-500' : warning ? 'text-yellow-500' : 'text-terminal-green/60'}`}>
          {percentage.toFixed(1)}%
        </p>
      </div>
    </div>
  );
};
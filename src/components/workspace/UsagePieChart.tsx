import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#9b87f5', '#7E69AB'];

interface UsagePieChartProps {
  used: number;
  total: number;
}

export const UsagePieChart: React.FC<UsagePieChartProps> = ({ used, total }) => {
  const data = [
    { name: 'Used', value: used },
    { name: 'Available', value: total - used }
  ];

  return (
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
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
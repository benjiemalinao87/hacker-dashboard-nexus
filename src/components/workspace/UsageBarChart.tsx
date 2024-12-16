import React from 'react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

interface UsageBarChartProps {
  used: number;
  total: number;
}

export const UsageBarChart = ({ used, total }: UsageBarChartProps) => {
  const data = [
    { name: 'Usage', used, available: total - used }
  ];

  return (
    <div className="h-2 w-full mt-0.5">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          stackOffset="expand"
          barSize={4}
        >
          <Bar
            dataKey="used"
            fill="#9b87f5"
            stackId="stack"
            radius={[2, 0, 0, 2]}
          />
          <Bar
            dataKey="available"
            fill="#7E69AB"
            stackId="stack"
            radius={[0, 2, 2, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
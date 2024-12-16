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
    <div className="h-3 w-full mt-0.5">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          stackOffset="expand"
          barSize={8}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <Bar
            dataKey="used"
            fill="#00ff00"
            stackId="stack"
            radius={[2, 0, 0, 2]}
          />
          <Bar
            dataKey="available"
            fill="#004400"
            stackId="stack"
            radius={[0, 2, 2, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
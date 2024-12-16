import React from 'react';

interface ProgressBarProps {
  used: number;
  total: number;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ used, total }) => {
  const percentage = Math.min((used / total) * 100, 100);
  const isNearLimit = used >= total * 0.9;

  return (
    <div className="progress-bar h-1">
      <div
        className={`progress-bar-fill ${isNearLimit ? 'bg-[#ea384c]' : ''}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
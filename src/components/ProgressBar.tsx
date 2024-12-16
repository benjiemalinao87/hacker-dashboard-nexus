import React from 'react';

interface ProgressBarProps {
  used: number;
  total: number;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ used, total, label }) => {
  const percentage = Math.min((used / total) * 100, 100);
  const isOverLimit = used > total;
  const isNearLimit = used >= total * 0.9;

  return (
    <div className={label ? 'mb-2' : 'mb-1'}>
      {label && (
        <div className="flex justify-between mb-1">
          <span>{'>'} {label}:</span>
          <span className={isOverLimit ? 'text-terminal-magenta' : isNearLimit ? 'text-[#ea384c]' : ''}>
            {used}/{total}
          </span>
        </div>
      )}
      <div className="progress-bar h-2">
        <div
          className={`progress-bar-fill ${isNearLimit ? 'bg-[#ea384c]' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
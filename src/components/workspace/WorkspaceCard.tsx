import React from 'react';
import { UsagePieChart } from './UsagePieChart';
import { ProgressBar } from '../ProgressBar';
import { WorkspaceData } from '@/types/workspace';
import { format, parseISO } from 'date-fns';

const formatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MM/dd/yy');
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return 'Invalid date';
  }
};

interface WorkspaceCardProps {
  data: WorkspaceData;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ data }) => {
  return (
    <div className="border border-terminal-green p-1.5 text-[10px]">
      <div className="flex justify-between items-start">
        <h2 className="font-bold text-[11px]">{`> ${data.name}`}</h2>
        <span className="text-[9px] text-terminal-dim">{`${data.timezone} | ${data.plan}`}</span>
      </div>
      
      <div className="space-y-0.5 mt-0.5">
        <div className="flex items-center gap-1">
          <UsagePieChart used={data.bot_user_used} total={data.bot_user_limit} />
          <div className="flex-1">
            <div className="flex justify-between text-[9px]">
              <span>{`> Bot Users`}</span>
              <span className={data.bot_user_used >= data.bot_user_limit * 0.9 ? 'text-terminal-magenta' : ''}>
                {data.bot_user_used}/{data.bot_user_limit}
              </span>
            </div>
            <ProgressBar used={data.bot_user_used} total={data.bot_user_limit} />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <UsagePieChart used={data.bot_used} total={data.bot_limit} />
          <div className="flex-1">
            <div className="flex justify-between text-[9px]">
              <span>{`> Bots`}</span>
              <span className={data.bot_used >= data.bot_limit * 0.9 ? 'text-terminal-magenta' : ''}>
                {data.bot_used}/{data.bot_limit}
              </span>
            </div>
            <ProgressBar used={data.bot_used} total={data.bot_limit} />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <UsagePieChart used={data.member_used} total={data.member_limit} />
          <div className="flex-1">
            <div className="flex justify-between text-[9px]">
              <span>{`> Members`}</span>
              <span className={data.member_used >= data.member_limit * 0.9 ? 'text-terminal-magenta' : ''}>
                {data.member_used}/{data.member_limit}
              </span>
            </div>
            <ProgressBar used={data.member_used} total={data.member_limit} />
          </div>
        </div>
      </div>

      <div className="text-[8px] text-terminal-dim mt-0.5">
        <span>{`> ${formatDate(data.billing_start_at)} - ${formatDate(data.billing_end_at)}`}</span>
      </div>
    </div>
  );
};
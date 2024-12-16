import React from 'react';
import { format, parseISO } from 'date-fns';
import { ProgressBar } from '../ProgressBar';
import { UsagePieChart } from './UsagePieChart';
import { UsageBarChart } from './UsageBarChart';
import { WorkspaceData } from './types';

const formatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MM/dd/yy');
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return 'Invalid date';
  }
};

export const WorkspaceCard = ({ data }: { data: WorkspaceData }) => (
  <div className="border border-terminal-green p-1.5 text-[10px]">
    <div className="flex justify-between items-start">
      <h2 className="font-bold text-[11px]">{`> ${data.name}`}</h2>
      <span className="text-[9px] text-terminal-dim">{`${data.timezone} | ${data.plan}`}</span>
    </div>
    
    <div className="space-y-1.5 mt-1.5">
      <div className="flex items-center gap-1">
        <UsagePieChart used={data.bot_user_used} total={data.bot_user_limit} />
        <div className="flex-1">
          <div className="flex justify-between text-[9px] mb-1">
            <span>{`> Bot Users`}</span>
            <span className={data.bot_user_used >= data.bot_user_limit * 0.9 ? 'text-terminal-magenta' : ''}>
              {data.bot_user_used}/{data.bot_user_limit}
            </span>
          </div>
          <UsageBarChart used={data.bot_user_used} total={data.bot_user_limit} />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <UsagePieChart used={data.bot_used} total={data.bot_limit} />
        <div className="flex-1">
          <div className="flex justify-between text-[9px] mb-1">
            <span>{`> Bots`}</span>
            <span className={data.bot_used >= data.bot_limit * 0.9 ? 'text-terminal-magenta' : ''}>
              {data.bot_used}/{data.bot_limit}
            </span>
          </div>
          <UsageBarChart used={data.bot_used} total={data.bot_limit} />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <UsagePieChart used={data.member_used} total={data.member_limit} />
        <div className="flex-1">
          <div className="flex justify-between text-[9px] mb-1">
            <span>{`> Members`}</span>
            <span className={data.member_used >= data.member_limit * 0.9 ? 'text-terminal-magenta' : ''}>
              {data.member_used}/{data.member_limit}
            </span>
          </div>
          <UsageBarChart used={data.member_used} total={data.member_limit} />
        </div>
      </div>
    </div>

    <div className="text-[8px] text-terminal-dim mt-1.5">
      <span>{`> ${formatDate(data.billing_start_at)} - ${formatDate(data.billing_end_at)}`}</span>
    </div>
  </div>
);
import React, { useState } from 'react';
import { TerminalInput } from '../components/TerminalInput';
import { ProgressBar } from '../components/ProgressBar';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';

const AUTH_TOKEN = "XmVtXZLJbznJYVlpBQxgZ7X1SxYGqSyQfB2RJUJPeHOlejPOC5tG0MRK1FAK";

interface WorkspaceData {
  name: string;
  timezone: string;
  plan: string;
  bot_user_used: number;
  bot_user_limit: number;
  bot_used: number;
  bot_limit: number;
  member_used: number;
  member_limit: number;
  billing_start_at: string;
  billing_end_at: string;
}

const formatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MM/dd/yy');
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return 'Invalid date';
  }
};

const WorkspaceCard = ({ data }: { data: WorkspaceData }) => (
  <div className="border border-terminal-green p-2 text-xs">
    <div className="flex justify-between items-start mb-1">
      <h2 className="font-bold">{`> ${data.name}`}</h2>
      <span className="text-[10px] text-terminal-dim">{`${data.timezone} | ${data.plan}`}</span>
    </div>
    
    <div className="space-y-1">
      <div>
        <div className="flex justify-between text-[10px]">
          <span>{`> Bot Users`}</span>
          <span className={data.bot_user_used >= data.bot_user_limit * 0.9 ? 'text-terminal-magenta' : ''}>
            {data.bot_user_used}/{data.bot_user_limit}
          </span>
        </div>
        <ProgressBar used={data.bot_user_used} total={data.bot_user_limit} />
      </div>

      <div>
        <div className="flex justify-between text-[10px]">
          <span>{`> Bots`}</span>
          <span className={data.bot_used >= data.bot_limit * 0.9 ? 'text-terminal-magenta' : ''}>
            {data.bot_used}/{data.bot_limit}
          </span>
        </div>
        <ProgressBar used={data.bot_used} total={data.bot_limit} />
      </div>

      <div>
        <div className="flex justify-between text-[10px]">
          <span>{`> Members`}</span>
          <span className={data.member_used >= data.member_limit * 0.9 ? 'text-terminal-magenta' : ''}>
            {data.member_used}/{data.member_limit}
          </span>
        </div>
        <ProgressBar used={data.member_used} total={data.member_limit} />
      </div>
    </div>

    <div className="text-[10px] text-terminal-dim mt-1">
      <span>{`> ${formatDate(data.billing_start_at)} - ${formatDate(data.billing_end_at)}`}</span>
    </div>
  </div>
);

const Index = () => {
  const [workspaceId, setWorkspaceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [workspaces, setWorkspaces] = useState<Record<string, WorkspaceData>>({});

  const fetchData = async () => {
    if (!workspaceId) {
      toast.error('Please enter a workspace ID');
      return;
    }

    setLoading(true);
    try {
      console.log('Fetching workspace data...');
      const { data: response, error } = await supabase.functions.invoke('workspace-proxy', {
        body: { workspaceId, token: AUTH_TOKEN }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log('Received data:', response);
      
      if (response.data) {
        setWorkspaces(prev => ({
          ...prev,
          [workspaceId]: {
            name: response.data.name,
            timezone: response.data.timezone || 'UTC',
            plan: response.data.plan,
            bot_user_used: response.data.bot_user_used,
            bot_user_limit: response.data.bot_user_limit,
            bot_used: response.data.bot_used,
            bot_limit: response.data.bot_limit,
            member_used: response.data.member_used,
            member_limit: response.data.member_limit,
            billing_start_at: response.data.billing_start_at,
            billing_end_at: response.data.billing_end_at
          }
        }));
        setWorkspaceId('');
        toast.success('Workspace added successfully');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error.message || 'Failed to fetch workspace data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 relative terminal-effect">
      <div className="matrix-rain" />
      <div className="max-w-2xl mx-auto relative z-10">
        <h1 className="text-sm mb-4">
          {'>'} Workspace Command Center <span className="animate-blink">_</span>
        </h1>

        <div className="mb-4">
          <TerminalInput
            label="> Add Workspace ID"
            value={workspaceId}
            onChange={setWorkspaceId}
            onSubmit={fetchData}
          />
        </div>

        <div className="grid grid-cols-1 gap-2">
          {Object.entries(workspaces).map(([id, data]) => (
            <WorkspaceCard key={id} data={data} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;

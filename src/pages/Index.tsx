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
    return format(date, 'MMM do, yyyy');
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return 'Invalid date';
  }
};

const WorkspaceCard = ({ data }: { data: WorkspaceData }) => (
  <div className="border border-terminal-green p-3 mb-3 text-xs max-w-sm">
    <h2 className="text-sm font-bold mb-1">{`> ${data.name}`}</h2>
    <p className="mb-0.5">{`> ${data.timezone} | ${data.plan}`}</p>
    
    <div className="space-y-2 my-2">
      <div>
        <p className="mb-0.5">{`> Bot Users: `}
          <span className={data.bot_user_used >= data.bot_user_limit * 0.9 ? 'text-terminal-magenta' : ''}>
            {data.bot_user_used}/{data.bot_user_limit}
          </span>
        </p>
        <ProgressBar label="" used={data.bot_user_used} total={data.bot_user_limit} />
      </div>

      <div>
        <p className="mb-0.5">{`> Bots: `}
          <span className={data.bot_used >= data.bot_limit * 0.9 ? 'text-terminal-magenta' : ''}>
            {data.bot_used}/{data.bot_limit}
          </span>
        </p>
        <ProgressBar label="" used={data.bot_used} total={data.bot_limit} />
      </div>

      <div>
        <p className="mb-0.5">{`> Members: `}
          <span className={data.member_used >= data.member_limit * 0.9 ? 'text-terminal-magenta' : ''}>
            {data.member_used}/{data.member_limit}
          </span>
        </p>
        <ProgressBar label="" used={data.member_used} total={data.member_limit} />
      </div>
    </div>

    <div className="text-terminal-dim text-[10px]">
      <p>{`> ${formatDate(data.billing_start_at)} - ${formatDate(data.billing_end_at)}`}</p>
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
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-xl mb-4 font-bold">
          {'>'} Workspace Command Center <span className="animate-blink">_</span>
        </h1>

        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1">
            <TerminalInput
              label="Add Workspace ID"
              value={workspaceId}
              onChange={setWorkspaceId}
            />
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="h-8 px-3 border border-terminal-green hover:bg-terminal-green hover:text-terminal-black transition-colors disabled:opacity-50 self-end mb-2"
          >
            {loading ? '...' : '> Add'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(workspaces).map(([id, data]) => (
            <WorkspaceCard key={id} data={data} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;

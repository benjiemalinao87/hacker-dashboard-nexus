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
    return format(date, 'MMMM do, yyyy');
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return 'Invalid date';
  }
};

const WorkspaceCard = ({ data }: { data: WorkspaceData }) => (
  <div className="border border-terminal-green p-4 mb-4 text-sm max-w-md">
    <h2 className="text-lg font-bold mb-2">{`> (R) ${data.name}`}</h2>
    <p className="text-sm mb-1">{`> Timezone: ${data.timezone}`}</p>
    <p className="text-sm mb-3">{`> Plan: ${data.plan}`}</p>
    
    <div className="space-y-3">
      <div>
        <p className="text-sm mb-1">{`> Bot Users: `}
          <span className={data.bot_user_used >= data.bot_user_limit * 0.9 ? 'text-terminal-magenta' : ''}>
            {data.bot_user_used} / {data.bot_user_limit}
          </span>
        </p>
        <ProgressBar
          label=""
          used={data.bot_user_used}
          total={data.bot_user_limit}
        />
      </div>

      <div>
        <p className="text-sm mb-1">{`> Bots: `}
          <span className={data.bot_used >= data.bot_limit * 0.9 ? 'text-terminal-magenta' : ''}>
            {data.bot_used} / {data.bot_limit}
          </span>
        </p>
        <ProgressBar
          label=""
          used={data.bot_used}
          total={data.bot_limit}
        />
      </div>

      <div>
        <p className="text-sm mb-1">{`> Members: `}
          <span className={data.member_used >= data.member_limit * 0.9 ? 'text-terminal-magenta' : ''}>
            {data.member_used} / {data.member_limit}
          </span>
        </p>
        <ProgressBar
          label=""
          used={data.member_used}
          total={data.member_limit}
        />
      </div>
    </div>

    <div className="mt-3 text-sm text-terminal-dim">
      <p>{`> Billing Period:`}</p>
      <p className="ml-4">Start: {formatDate(data.billing_start_at)}</p>
      <p className="ml-4">End: {formatDate(data.billing_end_at)}</p>
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
    <div className="min-h-screen p-8 relative terminal-effect">
      <div className="matrix-rain" />
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8">
          <h1 className="text-2xl mb-4 font-bold">
            {'>'} Workspace Command Center <span className="animate-blink">_</span>
          </h1>

          <div className="flex gap-4 items-end mb-8">
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
              className="h-10 px-4 border border-terminal-green hover:bg-terminal-green hover:text-terminal-black transition-colors disabled:opacity-50"
            >
              {loading ? '...' : '> Add'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(workspaces).map(([id, data]) => (
              <WorkspaceCard key={id} data={data} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
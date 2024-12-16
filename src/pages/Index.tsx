import React, { useState } from 'react';
import { TerminalInput } from '../components/TerminalInput';
import { ProgressBar } from '../components/ProgressBar';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface WorkspaceData {
  name: string;
  plan: string;
  bot_user_used: number;
  bot_user_limit: number;
  bot_used: number;
  bot_limit: number;
  member_used: number;
  member_limit: number;
}

const Index = () => {
  const [workspaceId, setWorkspaceId] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<WorkspaceData | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('Fetching workspace data...');
      const { data: response, error } = await supabase.functions.invoke('workspace-proxy', {
        body: { workspaceId, token }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log('Received data:', response);
      
      if (response.data) {
        setData({
          name: response.data.name,
          plan: response.data.plan,
          bot_user_used: response.data.bot_user_used,
          bot_user_limit: response.data.bot_user_limit,
          bot_used: response.data.bot_used,
          bot_limit: response.data.bot_limit,
          member_used: response.data.member_used,
          member_limit: response.data.member_limit
        });
        toast.success('Data fetched successfully');
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl mb-8 font-bold">
          {'>'} Workspace Command Center <span className="animate-blink">_</span>
        </h1>

        <div className="mb-8">
          <TerminalInput
            label="Workspace ID"
            value={workspaceId}
            onChange={setWorkspaceId}
          />
          <TerminalInput
            label="Authorization Token"
            value={token}
            onChange={setToken}
            type="password"
          />
          <button
            onClick={fetchData}
            disabled={loading}
            className="w-full border border-terminal-green p-2 hover:bg-terminal-green hover:text-terminal-black transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : '> Execute Query'}
          </button>
        </div>

        {data && (
          <div className="border border-terminal-green p-4">
            <h2 className="text-xl mb-4">{'>'} Workspace: {data.name}</h2>
            <p className="mb-4">{'>'} Plan: {data.plan}</p>
            
            <ProgressBar
              label="Bot Users"
              used={data.bot_user_used}
              total={data.bot_user_limit}
            />
            <ProgressBar
              label="Bots"
              used={data.bot_used}
              total={data.bot_limit}
            />
            <ProgressBar
              label="Members"
              used={data.member_used}
              total={data.member_limit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
import React, { useState } from 'react';
import { TerminalInput } from '../components/TerminalInput';
import { ProgressBar } from '../components/ProgressBar';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface WorkspaceData {
  name: string;
  plan: string;
  botUsersUsed: number;
  botUserLimit: number;
  botsUsed: number;
  botLimit: number;
  membersUsed: number;
  memberLimit: number;
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
      const { data: proxyData, error } = await supabase.functions.invoke('workspace-proxy', {
        body: { workspaceId, token }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log('Received data:', proxyData);
      setData(proxyData);
      toast.success('Data fetched successfully');
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
              used={data.botUsersUsed}
              total={data.botUserLimit}
            />
            <ProgressBar
              label="Bots"
              used={data.botsUsed}
              total={data.botLimit}
            />
            <ProgressBar
              label="Members"
              used={data.membersUsed}
              total={data.memberLimit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
import React, { useState } from 'react';
import { TerminalInput } from '../components/TerminalInput';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { WorkspaceGrid } from '@/components/workspace/WorkspaceGrid';
import { WorkspaceData } from '@/components/workspace/types';

const AUTH_TOKEN = "XmVtXZLJbznJYVlpBQxgZ7X1SxYGqSyQfB2RJUJPeHOlejPOC5tG0MRK1FAK";

const Index = () => {
  const [workspaceId, setWorkspaceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [workspaces, setWorkspaces] = useState<Record<string, WorkspaceData>>({});

  const fetchWorkspaceData = async (id: string) => {
    console.log('Fetching workspace data...', id);
    const { data: response, error } = await supabase.functions.invoke('workspace-proxy', {
      body: { workspaceId: id, token: AUTH_TOKEN }
    });
    
    if (error) {
      throw new Error(error.message);
    }
    
    console.log('Received data:', response);
    
    if (response.data) {
      return {
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
      };
    }
    throw new Error('Invalid response format');
  };

  const fetchData = async () => {
    if (!workspaceId) {
      toast.error('Please enter a workspace ID');
      return;
    }

    setLoading(true);
    try {
      const data = await fetchWorkspaceData(workspaceId);
      setWorkspaces(prev => ({
        ...prev,
        [workspaceId]: data
      }));
      setWorkspaceId('');
      toast.success('Workspace added successfully');
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error.message || 'Failed to fetch workspace data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (Object.keys(workspaces).length === 0) return;
    
    setRefreshing(true);
    try {
      const refreshedData: Record<string, WorkspaceData> = {};
      for (const id of Object.keys(workspaces)) {
        try {
          refreshedData[id] = await fetchWorkspaceData(id);
        } catch (error) {
          console.error(`Error refreshing workspace ${id}:`, error);
          toast.error(`Failed to refresh workspace ${id}`);
        }
      }
      setWorkspaces(refreshedData);
      toast.success('Workspaces refreshed successfully');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen p-2 relative terminal-effect">
      <div className="matrix-rain">
        <div>11</div>
        <div>00</div>
      </div>
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-2">
          <TerminalInput
            label="> Add Workspace ID"
            value={workspaceId}
            onChange={setWorkspaceId}
            onSubmit={fetchData}
          />
        </div>

        <WorkspaceGrid 
          workspaces={workspaces} 
          onRefresh={handleRefresh}
          isRefreshing={refreshing}
        />
      </div>
    </div>
  );
};

export default Index;
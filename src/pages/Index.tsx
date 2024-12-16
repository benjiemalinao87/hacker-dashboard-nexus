import React, { useState } from 'react';
import { TerminalInput } from '../components/TerminalInput';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { WorkspaceGrid } from '@/components/workspace/WorkspaceGrid';
import { WorkspaceData } from '@/types/workspace';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';
import Globe from '@/components/Globe';

const AUTH_TOKEN = "XmVtXZLJbznJYVlpBQxgZ7X1SxYGqSyQfB2RJUJPeHOlejPOC5tG0MRK1FAK";

const Index = () => {
  const [workspaceId, setWorkspaceId] = useState('');
  const [loading, setLoading] = useState(false);
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

  const refreshAllWorkspaces = async () => {
    setLoading(true);
    try {
      const workspaceIds = Object.keys(workspaces);
      const updatedWorkspaces: Record<string, WorkspaceData> = {};
      
      await Promise.all(
        workspaceIds.map(async (id) => {
          try {
            const data = await fetchWorkspaceData(id);
            updatedWorkspaces[id] = data;
          } catch (error) {
            console.error(`Error refreshing workspace ${id}:`, error);
            toast.error(`Failed to refresh workspace ${id}`);
          }
        })
      );
      
      setWorkspaces(updatedWorkspaces);
      toast.success('Workspaces refreshed successfully');
    } catch (error) {
      console.error('Error refreshing workspaces:', error);
      toast.error('Failed to refresh workspaces');
    } finally {
      setLoading(false);
    }
  };

  const addWorkspace = async () => {
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

  return (
    <div className="min-h-screen p-2 relative terminal-effect">
      <Globe />
      <div className="max-w-6xl mx-auto relative z-10"> {/* Increased from max-w-5xl to max-w-6xl */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xs">
            {'>'} Workspace Command Center <span className="animate-blink">_</span>
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAllWorkspaces}
            disabled={loading || Object.keys(workspaces).length === 0}
            className="text-[10px] h-6"
          >
            <RotateCw className="mr-1 h-3 w-3" />
            Refresh
          </Button>
        </div>

        <div className="mb-2">
          <TerminalInput
            label="> Add Workspace ID"
            value={workspaceId}
            onChange={setWorkspaceId}
            onSubmit={addWorkspace}
          />
        </div>

        <WorkspaceGrid workspaces={workspaces} />
      </div>
    </div>
  );
};

export default Index;
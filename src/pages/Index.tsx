import React, { useState, useMemo } from 'react';
import { TerminalInput } from '../components/TerminalInput';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { WorkspaceGrid } from '@/components/workspace/WorkspaceGrid';
import { WorkspaceData } from '@/types/workspace';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';
import Globe from '@/components/Globe';
import { RightSidebar } from '@/components/activity/RightSidebar';
import { LimitWarningFooter } from '@/components/workspace/LimitWarningFooter';

const AUTH_TOKEN = "XmVtXZLJbznJYVlpBQxgZ7X1SxYGqSyQfB2RJUJPeHOC5tG0MRK1FAK";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const Index = () => {
  const [workspaceId, setWorkspaceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [workspaces, setWorkspaces] = useState<Record<string, WorkspaceData>>({});

  const fetchWithRetry = async (id: string, retryCount = 0): Promise<WorkspaceData> => {
    try {
      console.log(`Attempting to fetch workspace ${id} (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      
      const { data: response, error } = await supabase.functions.invoke('workspace-proxy', {
        body: { workspaceId: id.trim(), token: AUTH_TOKEN }
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Received data for workspace', id, ':', response);
      
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
    } catch (error) {
      console.error(`Error fetching workspace ${id} (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < MAX_RETRIES - 1) {
        console.log(`Retrying in ${RETRY_DELAY}ms...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchWithRetry(id, retryCount + 1);
      }
      
      throw error;
    }
  };

  const refreshAllWorkspaces = async () => {
    setLoading(true);
    try {
      const workspaceIds = Object.keys(workspaces);
      const updatedWorkspaces: Record<string, WorkspaceData> = {};
      
      await Promise.all(
        workspaceIds.map(async (id) => {
          try {
            const data = await fetchWithRetry(id);
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
    const ids = workspaceId.split(',').map(id => id.trim()).filter(id => id);
    console.log('Processing workspace IDs:', ids);
    
    try {
      const newWorkspaces: Record<string, WorkspaceData> = {};
      let successCount = 0;
      let errorCount = 0;
      
      await Promise.all(
        ids.map(async (id) => {
          try {
            const data = await fetchWithRetry(id);
            newWorkspaces[id] = data;
            successCount++;
          } catch (error) {
            console.error(`Error fetching data for workspace ${id}:`, error);
            toast.error(`Failed to fetch workspace ${id}`);
            errorCount++;
          }
        })
      );
      
      if (successCount > 0) {
        setWorkspaces(prev => ({
          ...prev,
          ...newWorkspaces
        }));
        setWorkspaceId('');
        toast.success(`Added ${successCount} workspace(s) successfully`);
      }
      
      if (errorCount > 0) {
        toast.error(`Failed to fetch ${errorCount} workspace(s)`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error.message || 'Failed to fetch workspace data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative terminal-effect">
      <Globe />
      <div className="flex-1 p-4 w-full relative z-10">
        <div className="flex justify-between items-center mb-4">
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

        <div className="mb-4">
          <TerminalInput
            label="> Add Workspace ID (separate multiple IDs with commas)"
            value={workspaceId}
            onChange={setWorkspaceId}
            onSubmit={addWorkspace}
          />
        </div>

        <WorkspaceGrid workspaces={workspaces} />
      </div>
      
      <LimitWarningFooter workspaces={workspaces} />
      <RightSidebar />
    </div>
  );
};

export default Index;
import React, { useState } from 'react';
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
import { SidePanelProvider } from '@/contexts/SidePanelContext';

// Make sure this token matches exactly what's expected by the API
const AUTH_TOKEN = "XmVtXZLJbznJYVlpBQxgZ7X1SxYGqSyQfB2RJUJPeHOlejPOC5tG0MRK1FAK";
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
        body: { 
          workspaceId: id.trim(),
          token: AUTH_TOKEN
        }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        if (error.message.includes('Authentication failed')) {
          toast.error('Authentication failed. Please check your token.');
          throw new Error('Authentication failed');
        }
        throw error;
      }
      
      if (!response || !response.data) {
        console.error('Invalid response format:', response);
        throw new Error('Invalid response format from API');
      }
      
      console.log('Received data for workspace', id, ':', response);
      
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
      console.log('Refreshing workspaces:', workspaceIds);
      
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
      
      console.log('Updated workspaces data:', updatedWorkspaces);
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
    const id = workspaceId.trim();
    console.log('Processing workspace ID:', id);
    
    try {
      const data = await fetchWithRetry(id);
      console.log('Successfully fetched workspace data:', data);
      setWorkspaces(prev => {
        const updated = {
          ...prev,
          [id]: data
        };
        console.log('Updated workspaces state:', updated);
        return updated;
      });
      setWorkspaceId('');
      toast.success('Workspace added successfully');
    } catch (error) {
      console.error(`Error fetching data for workspace ${id}:`, error);
      toast.error(`Failed to fetch workspace ${id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidePanelProvider>
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
              className="text-xs h-6"
            >
              <RotateCw className="mr-1 h-3 w-3" />
              Refresh
            </Button>
          </div>

          <div className="mb-4">
            <TerminalInput
              label="> Enter Workspace ID"
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
    </SidePanelProvider>
  );
};

export default Index;

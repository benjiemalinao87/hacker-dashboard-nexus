import { useState } from 'react';
import { WorkspaceData } from '@/types/workspace';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AUTH_TOKEN = "XmVtXZLJbznJYVlpBQxgZ7X1SxYGqSyQfB2RJUJPeHOlejPOC5tG0MRK1FAK";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const useWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState<Record<string, WorkspaceData>>({});
  const [loading, setLoading] = useState(false);

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

  const fetchWorkspaces = async () => {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*');

      if (error) throw error;

      const workspacesMap: Record<string, WorkspaceData> = {};
      data.forEach(workspace => {
        workspacesMap[workspace.id] = workspace;
      });

      setWorkspaces(workspacesMap);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
      toast.error('Failed to fetch workspaces');
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

  const deleteWorkspace = async (id: string) => {
    try {
      const { error } = await supabase
        .from('workspaces')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWorkspaces(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      toast.success('Workspace deleted successfully');
    } catch (error) {
      console.error('Error deleting workspace:', error);
      toast.error('Failed to delete workspace');
    }
  };

  const addWorkspace = async (id: string) => {
    if (!id) {
      toast.error('Please enter a workspace ID');
      return false;
    }

    setLoading(true);
    const workspaceId = id.trim();
    console.log('Processing workspace ID:', workspaceId);
    
    try {
      // First check if workspace already exists
      const { data: existingWorkspace } = await supabase
        .from('workspaces')
        .select('id')
        .eq('id', workspaceId)
        .single();

      if (existingWorkspace) {
        toast.error('Workspace already exists');
        return false;
      }

      const data = await fetchWithRetry(workspaceId);
      
      const { error } = await supabase
        .from('workspaces')
        .insert([{ id: workspaceId, ...data }]);

      if (error) {
        if (error.code === '23505') { // Duplicate key error
          toast.error('Workspace already exists');
          return false;
        }
        throw error;
      }

      console.log('Successfully fetched workspace data:', data);
      setWorkspaces(prev => ({
        ...prev,
        [workspaceId]: data
      }));
      
      toast.success('Workspace added successfully');
      return true;
    } catch (error) {
      console.error(`Error fetching data for workspace ${workspaceId}:`, error);
      toast.error(`Failed to fetch workspace ${workspaceId}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    workspaces,
    loading,
    fetchWorkspaces,
    refreshAllWorkspaces,
    deleteWorkspace,
    addWorkspace
  };
};
import { supabase } from '@/integrations/supabase/client';
import { WorkspaceData } from '@/types/workspace';
import { toast } from 'sonner';

const AUTH_TOKEN = "XmVtXZLJbznJYVlpBQxgZ7X1SxYGqSyQfB2RJUJPeHOlejPOC5tG0MRK1FAK";
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export const fetchWorkspaceData = async (id: string, retryCount = 0): Promise<WorkspaceData> => {
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
    if (retryCount < MAX_RETRIES - 1) {
      console.log(`Retrying in ${RETRY_DELAY}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWorkspaceData(id, retryCount + 1);
    }
    throw error;
  }
};

export const checkWorkspaceExists = async (workspaceId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', workspaceId);
    
    if (error) throw error;
    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking workspace existence:', error);
    return false;
  }
};

export const deleteWorkspaceById = async (id: string) => {
  const { error } = await supabase
    .from('workspaces')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const insertWorkspace = async (workspaceId: string, data: WorkspaceData) => {
  return await supabase
    .from('workspaces')
    .insert([{ id: workspaceId, ...data }]);
};

export const fetchAllWorkspaces = async () => {
  return await supabase
    .from('workspaces')
    .select('*');
};
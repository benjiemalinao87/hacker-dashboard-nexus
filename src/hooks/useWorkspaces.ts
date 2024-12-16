import { useState } from 'react';
import { WorkspaceData } from '@/types/workspace';
import { toast } from 'sonner';
import { 
  fetchWorkspaceData, 
  checkWorkspaceExists, 
  deleteWorkspaceById,
  insertWorkspace,
  fetchAllWorkspaces
} from '@/api/workspaceApi';

export const useWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState<Record<string, WorkspaceData>>({});
  const [loading, setLoading] = useState(false);

  const fetchWorkspaces = async () => {
    try {
      const { data, error } = await fetchAllWorkspaces();
      if (error) throw error;

      const workspacesMap: Record<string, WorkspaceData> = {};
      data?.forEach(workspace => {
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
            const data = await fetchWorkspaceData(id);
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
      await deleteWorkspaceById(id);
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
      const exists = await checkWorkspaceExists(workspaceId);
      if (exists) {
        toast.error('Workspace already exists');
        return false;
      }

      const data = await fetchWorkspaceData(workspaceId);
      const { error } = await insertWorkspace(workspaceId, data);

      if (error) {
        if (error.code === '23505') {
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
import React, { useState, useEffect } from 'react';
import { TerminalInput } from '../components/TerminalInput';
import { WorkspaceGrid } from '@/components/workspace/WorkspaceGrid';
import Globe from '@/components/Globe';
import { RightSidebar } from '@/components/activity/RightSidebar';
import { SidePanelProvider } from '@/contexts/SidePanelContext';
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader';
import { useWorkspaces } from '@/hooks/useWorkspaces';

const Index = () => {
  const [workspaceId, setWorkspaceId] = useState('');
  const { 
    workspaces, 
    loading, 
    fetchWorkspaces, 
    refreshAllWorkspaces, 
    deleteWorkspace, 
    addWorkspace 
  } = useWorkspaces();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleAddWorkspace = async () => {
    const success = await addWorkspace(workspaceId);
    if (success) {
      setWorkspaceId('');
    }
  };

  return (
    <SidePanelProvider>
      <div className="min-h-screen flex flex-col relative terminal-effect">
        <Globe />
        <div className="flex-1 px-6 py-4 w-full max-w-[calc(100%-400px)] relative z-10">
          <WorkspaceHeader 
            onRefresh={refreshAllWorkspaces}
            loading={loading}
            hasWorkspaces={Object.keys(workspaces).length > 0}
          />

          <div className="mb-6">
            <TerminalInput
              label="> Enter Workspace ID"
              value={workspaceId}
              onChange={setWorkspaceId}
              onSubmit={handleAddWorkspace}
            />
          </div>

          <WorkspaceGrid workspaces={workspaces} onDelete={deleteWorkspace} />
        </div>
        
        <RightSidebar workspaces={workspaces} />
      </div>
    </SidePanelProvider>
  );
};

export default Index;
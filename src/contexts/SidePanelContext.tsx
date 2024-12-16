import React, { createContext, useContext, useState } from 'react';

interface SidePanelContextType {
  isPinned: boolean;
  togglePin: () => void;
}

const SidePanelContext = createContext<SidePanelContextType | undefined>(undefined);

export function SidePanelProvider({ children }: { children: React.ReactNode }) {
  const [isPinned, setIsPinned] = useState(false);

  const togglePin = () => setIsPinned(prev => !prev);

  return (
    <SidePanelContext.Provider value={{ isPinned, togglePin }}>
      {children}
    </SidePanelContext.Provider>
  );
}

export function useSidePanel() {
  const context = useContext(SidePanelContext);
  if (!context) {
    throw new Error('useSidePanel must be used within a SidePanelProvider');
  }
  return context;
}
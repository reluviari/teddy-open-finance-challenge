import { createContext, useContext, useCallback, useMemo, useState, ReactNode } from 'react';
import { ClientResponse } from './types';

interface SelectedClientsContextValue {
  selectedClients: ClientResponse[];
  addClient: (client: ClientResponse) => void;
  removeClient: (clientId: string) => void;
  clearAll: () => void;
}

const SelectedClientsContext = createContext<SelectedClientsContextValue | null>(null);

const STORAGE_KEY = 'teddy_selected_clients';

function loadSelected(): ClientResponse[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSelected(clients: ClientResponse[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export function SelectedClientsProvider({ children }: { children: ReactNode }) {
  const [selectedClients, setSelectedClients] = useState<ClientResponse[]>(loadSelected);

  const addClient = useCallback((client: ClientResponse) => {
    setSelectedClients((prev) => {
      if (prev.some((c) => c.id === client.id)) return prev;
      const next = [...prev, client];
      saveSelected(next);
      return next;
    });
  }, []);

  const removeClient = useCallback((clientId: string) => {
    setSelectedClients((prev) => {
      const next = prev.filter((c) => c.id !== clientId);
      saveSelected(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSelectedClients([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({ selectedClients, addClient, removeClient, clearAll }),
    [selectedClients, addClient, removeClient, clearAll],
  );

  return (
    <SelectedClientsContext.Provider value={value}>{children}</SelectedClientsContext.Provider>
  );
}

export function useSelectedClients(): SelectedClientsContextValue {
  const context = useContext(SelectedClientsContext);
  if (!context) {
    throw new Error('useSelectedClients must be used within SelectedClientsProvider');
  }
  return context;
}

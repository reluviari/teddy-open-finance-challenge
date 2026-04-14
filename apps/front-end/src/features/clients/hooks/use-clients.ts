import { useState, useEffect, useCallback } from 'react';
import { api } from '@/shared/lib/api';
import { useAuth } from '@/features/auth';
import { ClientListResponse } from '../types';

interface UseClientsOptions {
  page?: number;
  limit?: number;
}

interface UseClientsResult {
  data: ClientListResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useClients(options: UseClientsOptions = {}): UseClientsResult {
  const { user } = useAuth();
  const { page = 1, limit = 16 } = options;
  const [data, setData] = useState<ClientListResponse | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchClients = useCallback(() => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    api
      .get<ClientListResponse>(`/clients?page=${page}&limit=${limit}`, user.token)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err : new Error('Failed to load clients')))
      .finally(() => setIsLoading(false));
  }, [user, page, limit]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return { data, isLoading, isError: !!error, error, refetch: fetchClients };
}

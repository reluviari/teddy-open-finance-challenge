import { useState, useEffect } from 'react';
import { api } from '@/shared/lib/api';
import { useAuth } from '@/features/auth';
import { ClientResponse } from '../types';

interface UseClientResult {
  data: ClientResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function useClient(id: string): UseClientResult {
  const { user } = useAuth();
  const [data, setData] = useState<ClientResponse | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user || !id) return;

    setIsLoading(true);
    setError(null);

    api
      .get<ClientResponse>(`/clients/${id}`, user.token)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err : new Error('Failed to load client')))
      .finally(() => setIsLoading(false));
  }, [user, id]);

  return { data, isLoading, isError: !!error, error };
}

import { useState, useEffect } from 'react';
import { api } from '@/shared/lib/api';
import { useAuth } from '@/features/auth';
import { DashboardResponse } from '../types';

interface UseDashboardResult {
  data: DashboardResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function useDashboard(): UseDashboardResult {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardResponse | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    api
      .get<DashboardResponse>('/clients/dashboard', user.token)
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err : new Error('Failed to load dashboard')))
      .finally(() => setIsLoading(false));
  }, [user]);

  return { data, isLoading, isError: !!error, error };
}

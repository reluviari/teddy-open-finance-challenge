import { useState } from 'react';
import { api } from '@/shared/lib/api';
import { useAuth } from '@/features/auth';
import { ClientResponse, CreateClientRequest, UpdateClientRequest } from '../types';

interface MutationResult<TArgs> {
  mutate: (args: TArgs, options?: { onSuccess?: () => void; onSettled?: () => void }) => void;
  isPending: boolean;
  error: Error | null;
}

function useMutation<TArgs>(
  fn: (args: TArgs, token?: string) => Promise<unknown>,
): MutationResult<TArgs> {
  const { user } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate: MutationResult<TArgs>['mutate'] = (args, options) => {
    setIsPending(true);
    setError(null);

    fn(args, user?.token)
      .then(() => options?.onSuccess?.())
      .catch((err) => setError(err instanceof Error ? err : new Error('Operation failed')))
      .finally(() => {
        setIsPending(false);
        options?.onSettled?.();
      });
  };

  return { mutate, isPending, error };
}

export function useCreateClient() {
  return useMutation<CreateClientRequest>((data, token) =>
    api.post<ClientResponse>('/clients', data, token),
  );
}

export function useUpdateClient() {
  return useMutation<{ id: string; data: UpdateClientRequest }>(({ id, data }, token) =>
    api.put<ClientResponse>(`/clients/${id}`, data, token),
  );
}

export function useDeleteClient() {
  return useMutation<string>((id, token) => api.delete<void>(`/clients/${id}`, token));
}

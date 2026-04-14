import { useState } from 'react';
import { api } from '@/shared/lib/api';
import { LoginRequest, LoginResponse } from '../types';

interface UseLoginResult {
  mutate: (data: LoginRequest, options?: { onSuccess?: (response: LoginResponse) => void }) => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
}

export function useLogin(): UseLoginResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate: UseLoginResult['mutate'] = (data, options) => {
    setIsPending(true);
    setError(null);

    api
      .post<LoginResponse>('/auth/login', data)
      .then((response) => {
        options?.onSuccess?.(response);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Login failed'));
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  return { mutate, isPending, isError: !!error, error };
}

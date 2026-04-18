import { useState } from 'react';
import { api } from '@/shared/lib/api';
import { LoginRequest, LoginResponse } from '../types';

interface MutateOptions {
  onSuccess?: (response: LoginResponse) => void;
  onError?: (error: Error) => void;
}

interface UseLoginResult {
  mutate: (data: LoginRequest, options?: MutateOptions) => void;
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
        const resolvedError = err instanceof Error ? err : new Error('Login failed');
        setError(resolvedError);
        options?.onError?.(resolvedError);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  return { mutate, isPending, isError: !!error, error };
}

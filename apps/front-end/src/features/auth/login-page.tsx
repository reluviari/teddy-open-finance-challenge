import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLogin } from './hooks/use-login';
import { useAuth } from './auth-context';
import { LoginRequest } from './types';

const HEALTH_CHECK_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/healthz`;
const POLL_INTERVAL_MS = 10_000;

function isNetworkError(error: Error | null): boolean {
  if (!error) return false;
  const msg = error.message.toLowerCase();
  return (
    msg.includes('failed to fetch') || msg.includes('network') || msg.includes('err_connection')
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const loginMutation = useLogin();
  const sessionExpired = searchParams.get('expired') === 'true';

  const [waitingForServer, setWaitingForServer] = useState(false);
  const pendingLoginRef = useRef<LoginRequest | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const handleLoginSuccess = useCallback(
    (data: LoginRequest, response: { name: string; accessToken: string }) => {
      login(response.name, data.email, response.accessToken);
      navigate('/dashboard', { replace: true });
    },
    [login, navigate],
  );

  const attemptLogin = useCallback(
    (data: LoginRequest) => {
      loginMutation.mutate(data, {
        onSuccess: (response) => handleLoginSuccess(data, response),
      });
    },
    [loginMutation, handleLoginSuccess],
  );

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(HEALTH_CHECK_URL);
      if (res.ok && pendingLoginRef.current) {
        setWaitingForServer(false);
        const credentials = pendingLoginRef.current;
        pendingLoginRef.current = null;
        attemptLogin(credentials);
      }
    } catch {
      // server still waking up
    }
  }, [attemptLogin]);

  useEffect(() => {
    if (waitingForServer) {
      checkHealth();
      pollingRef.current = setInterval(checkHealth, POLL_INTERVAL_MS);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [waitingForServer, checkHealth]);

  useEffect(() => {
    if (loginMutation.isError && isNetworkError(loginMutation.error) && pendingLoginRef.current) {
      setWaitingForServer(true);
    }
  }, [loginMutation.isError, loginMutation.error]);

  const handleLogin = (data: LoginRequest) => {
    pendingLoginRef.current = data;
    attemptLogin(data);
  };

  const showServerWaiting = waitingForServer && !loginMutation.isPending;
  const showError =
    loginMutation.isError && !isNetworkError(loginMutation.error) && !waitingForServer;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-[380px] space-y-6 rounded-[4px] bg-white p-8 shadow-md">
        <div className="flex justify-center">
          <img src="/teddy-logo.svg" alt="Teddy Open Finance" className="h-12" />
        </div>

        {sessionExpired && !showServerWaiting && (
          <div className="rounded-[4px] border border-teddy-orange/30 bg-[#FDE8D8] px-4 py-3 text-center text-[13px] text-gray-700">
            Sua sessão expirou. Faça login para continuar.
          </div>
        )}

        {showServerWaiting && (
          <div className="rounded-[4px] border border-blue-200 bg-blue-50 px-4 py-4 text-center">
            <div className="mb-2 flex justify-center">
              <svg
                className="h-5 w-5 animate-spin text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </div>
            <p className="text-[13px] font-medium text-blue-700">
              O servidor está iniciando, aguarde...
            </p>
            <p className="mt-1 text-[12px] text-blue-500">
              O backend utiliza free tier e entra em suspensão após inatividade. O login será
              realizado automaticamente assim que o servidor estiver pronto.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              aria-label="E-mail"
              placeholder="Digite seu e-mail:"
              disabled={showServerWaiting}
              className="w-full rounded-[4px] border border-gray-300 px-3 py-2.5 text-[14px] text-gray-700 placeholder:text-gray-400 focus:border-teddy-orange focus:outline-none focus:ring-1 focus:ring-teddy-orange disabled:bg-gray-100 disabled:text-gray-400"
              {...register('email', { required: 'E-mail é obrigatório' })}
            />
            {errors.email && (
              <p className="mt-1 text-[12px] text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-label="Senha"
              placeholder="Digite sua senha:"
              disabled={showServerWaiting}
              className="w-full rounded-[4px] border border-gray-300 px-3 py-2.5 text-[14px] text-gray-700 placeholder:text-gray-400 focus:border-teddy-orange focus:outline-none focus:ring-1 focus:ring-teddy-orange disabled:bg-gray-100 disabled:text-gray-400"
              {...register('password', {
                required: 'Senha é obrigatória',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-[12px] text-red-500">{errors.password.message}</p>
            )}
          </div>

          {showError && (
            <p className="text-[12px] text-red-500">
              {loginMutation.error?.message || 'Erro ao fazer login'}
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending || showServerWaiting}
            className="w-full rounded-[4px] bg-teddy-orange py-3 text-[14px] font-semibold text-white transition-colors hover:bg-teddy-orange-hover disabled:opacity-50"
          >
            {loginMutation.isPending
              ? 'Entrando...'
              : showServerWaiting
                ? 'Aguardando servidor...'
                : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

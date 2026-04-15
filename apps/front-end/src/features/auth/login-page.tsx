import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLogin } from './hooks/use-login';
import { useAuth } from './auth-context';
import { LoginRequest } from './types';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const loginMutation = useLogin();
  const sessionExpired = searchParams.get('expired') === 'true';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const handleLogin = (data: LoginRequest) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        login(data.email, response.accessToken);
        navigate('/dashboard', { replace: true });
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-[380px] space-y-6 rounded-[4px] bg-white p-8 shadow-md">
        <div className="flex justify-center">
          <img src="/teddy-logo.svg" alt="Teddy Open Finance" className="h-12" />
        </div>

        {sessionExpired && (
          <div className="rounded-[4px] border border-teddy-orange/30 bg-[#FDE8D8] px-4 py-3 text-center text-[13px] text-gray-700">
            Sua sessão expirou. Faça login para continuar.
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
              className="w-full rounded-[4px] border border-gray-300 px-3 py-2.5 text-[14px] text-gray-700 placeholder:text-gray-400 focus:border-teddy-orange focus:outline-none focus:ring-1 focus:ring-teddy-orange"
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
              className="w-full rounded-[4px] border border-gray-300 px-3 py-2.5 text-[14px] text-gray-700 placeholder:text-gray-400 focus:border-teddy-orange focus:outline-none focus:ring-1 focus:ring-teddy-orange"
              {...register('password', {
                required: 'Senha é obrigatória',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-[12px] text-red-500">{errors.password.message}</p>
            )}
          </div>

          {loginMutation.isError && (
            <p className="text-[12px] text-red-500">
              {loginMutation.error?.message || 'Erro ao fazer login'}
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-[4px] bg-teddy-orange py-3 text-[14px] font-semibold text-white transition-colors hover:bg-teddy-orange-hover disabled:opacity-50"
          >
            {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

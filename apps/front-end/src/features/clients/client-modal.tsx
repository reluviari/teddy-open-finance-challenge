import { useEffect, ChangeEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ClientResponse } from './types';

interface ClientFormData {
  name: string;
  salary: number;
  companyValue: number;
}

interface ClientModalProps {
  isOpen: boolean;
  client?: ClientResponse | null;
  onClose: () => void;
  onSubmit: (data: ClientFormData) => void;
  isPending?: boolean;
  error?: Error | null;
}

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function handleCurrencyChange(e: ChangeEvent<HTMLInputElement>, onChange: (value: number) => void) {
  const raw = e.target.value.replace(/\D/g, '');
  const numeric = Number(raw) / 100;
  onChange(numeric);
}

export function ClientModal({
  isOpen,
  client,
  onClose,
  onSubmit,
  isPending,
  error,
}: ClientModalProps) {
  const isEditing = !!client;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ClientFormData>();

  useEffect(() => {
    if (client) {
      reset({ name: client.name, salary: client.salary, companyValue: client.companyValue });
    } else {
      reset({ name: '', salary: 0, companyValue: 0 });
    }
  }, [client, reset]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] rounded-[4px] bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-gray-800">
            {isEditing ? 'Editar cliente:' : 'Criar cliente:'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Fechar"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <input
              type="text"
              placeholder="Digite o nome:"
              className="w-full rounded-[4px] border border-gray-300 px-3 py-2.5 text-[14px] text-gray-700 placeholder:text-gray-400 focus:border-teddy-orange focus:outline-none focus:ring-1 focus:ring-teddy-orange"
              {...register('name', { required: 'Nome é obrigatório' })}
            />
            {errors.name && <p className="mt-1 text-[12px] text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <Controller
              name="salary"
              control={control}
              rules={{
                required: 'Salário é obrigatório',
                min: { value: 0.01, message: 'Deve ser maior que zero' },
              }}
              render={({ field: { value, onChange, ...field } }) => (
                <div className="flex overflow-hidden rounded-[4px] border border-gray-300 focus-within:border-teddy-orange focus-within:ring-1 focus-within:ring-teddy-orange">
                  <span className="flex items-center bg-gray-100 px-3 text-[14px] text-gray-500">
                    R$
                  </span>
                  <input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    placeholder="Digite o salário:"
                    value={value ? formatBRL(value) : ''}
                    onChange={(e) => handleCurrencyChange(e, onChange)}
                    className="w-full px-3 py-2.5 text-[14px] text-gray-700 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
              )}
            />
            {errors.salary && (
              <p className="mt-1 text-[12px] text-red-500">{errors.salary.message}</p>
            )}
          </div>

          <div>
            <Controller
              name="companyValue"
              control={control}
              rules={{
                required: 'Valor é obrigatório',
                min: { value: 0.01, message: 'Deve ser maior que zero' },
              }}
              render={({ field: { value, onChange, ...field } }) => (
                <div className="flex overflow-hidden rounded-[4px] border border-gray-300 focus-within:border-teddy-orange focus-within:ring-1 focus-within:ring-teddy-orange">
                  <span className="flex items-center bg-gray-100 px-3 text-[14px] text-gray-500">
                    R$
                  </span>
                  <input
                    {...field}
                    type="text"
                    inputMode="numeric"
                    placeholder="Digite o valor da empresa:"
                    value={value ? formatBRL(value) : ''}
                    onChange={(e) => handleCurrencyChange(e, onChange)}
                    className="w-full px-3 py-2.5 text-[14px] text-gray-700 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
              )}
            />
            {errors.companyValue && (
              <p className="mt-1 text-[12px] text-red-500">{errors.companyValue.message}</p>
            )}
          </div>

          {error && <p className="text-[12px] text-red-500">{error.message}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-[4px] bg-teddy-orange py-3 text-[14px] font-semibold text-white transition-colors hover:bg-teddy-orange-hover disabled:opacity-50"
          >
            {isPending ? 'Salvando...' : isEditing ? 'Editar cliente' : 'Criar cliente'}
          </button>
        </form>
      </div>
    </div>
  );
}

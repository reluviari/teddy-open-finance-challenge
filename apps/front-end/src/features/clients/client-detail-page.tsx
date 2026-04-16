import { useParams, useNavigate } from 'react-router-dom';
import { useClient } from './hooks/use-client';
import { formatCurrency, formatDateTime } from '@/shared/lib/format';

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: client, isLoading, isError, error } = useClient(id!);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <p className="text-gray-500">Carregando detalhes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <p className="text-red-600">Não foi possível carregar os dados do cliente. Tente novamente.</p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Cliente não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <button
        onClick={() => navigate('/clients')}
        className="mb-4 text-sm text-teddy-orange hover:underline"
      >
        &larr; Voltar para lista de clientes
      </button>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
          <span className="rounded-full bg-[#FDE8D8] px-3 py-1 text-sm text-teddy-orange">
            {client.viewCount} {client.viewCount === 1 ? 'visualização' : 'visualizações'}
          </span>
        </div>

        <dl className="space-y-3">
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <dt className="text-sm font-medium text-gray-500">Salário</dt>
            <dd className="text-sm text-gray-900">{formatCurrency(client.salary)}</dd>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <dt className="text-sm font-medium text-gray-500">Valor da empresa</dt>
            <dd className="text-sm text-gray-900">{formatCurrency(client.companyValue)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-sm font-medium text-gray-500">Data de cadastro</dt>
            <dd className="text-sm text-gray-900">{formatDateTime(client.createdAt)}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => navigate(`/clients?edit=${id}`)}
            className="rounded-[4px] bg-teddy-orange px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-teddy-orange-hover"
          >
            Editar
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-[4px] border-[3px] border-teddy-orange px-4 py-2.5 font-bold text-teddy-orange transition-colors hover:bg-orange-50"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

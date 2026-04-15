import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from './hooks/use-dashboard';
import { formatCurrency, formatDateTime } from '@/shared/lib/format';

const MONTH_LABELS = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

function formatMonth(yyyyMm: string): string {
  const [year, month] = yyyyMm.split('-');
  return `${MONTH_LABELS[Number(month) - 1]}/${year.slice(2)}`;
}

export function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <p className="text-gray-500">Carregando dashboard...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <p className="text-red-600">Erro ao carregar dashboard: {error?.message}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Sem dados disponíveis.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-500">Total de clientes</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{data.totalClients}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-500">Soma de valor das empresas</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {formatCurrency(data.totalCompanyValue)}
          </p>
        </div>
      </div>

      {data.chartData.length > 0 && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Clientes por mês</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data.chartData.map((d) => ({
                'Total de Clientes': d.count,
                label: formatMonth(d.month),
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="Total de Clientes" fill="#EC6724" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Últimos 10 clientes</h2>
          {data.latestClients.length > 0 && (
            <Link
              to="/clients"
              className="rounded-[4px] bg-teddy-orange px-4 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-teddy-orange-hover"
            >
              Ver todos
            </Link>
          )}
        </div>

        {data.latestClients.length === 0 ? (
          <p className="text-gray-500">Nenhum cliente cadastrado.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="min-w-full table-fixed divide-y divide-gray-100">
              <thead className="bg-[#FDE8D8]">
                <tr>
                  <th className="w-1/4 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Nome
                  </th>
                  <th className="w-1/4 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Salário
                  </th>
                  <th className="w-1/4 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Valor da empresa
                  </th>
                  <th className="w-1/4 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Data de cadastro
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.latestClients.map((client, index) => (
                  <tr key={client.id} className={index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3 text-sm">
                      <Link
                        to={`/clients/${client.id}`}
                        className="text-teddy-orange hover:underline"
                      >
                        {client.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-left text-sm text-gray-600">
                      {formatCurrency(client.salary)}
                    </td>
                    <td className="px-4 py-3 text-left text-sm text-gray-600">
                      {formatCurrency(client.companyValue)}
                    </td>
                    <td className="px-4 py-3 text-left text-sm text-gray-600">
                      {formatDateTime(client.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboard } from './hooks/use-dashboard';

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

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-500">Total de clientes</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{data.totalClients}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-500">Soma de salários</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {data.totalSalary.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-500">Soma valor empresa</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {data.totalCompanyValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
      </div>

      {data.chartData.length > 0 && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Clientes por mês</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Últimos clientes</h2>
          <Link to="/clients" className="text-sm text-blue-600 hover:underline">
            Ver todos
          </Link>
        </div>

        {data.latestClients.length === 0 ? (
          <p className="text-gray-500">Nenhum cliente cadastrado.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nome</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">E-mail</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Salário</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.latestClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link to={`/clients/${client.id}`} className="text-blue-600 hover:underline">
                        {client.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{client.email}</td>
                    <td className="px-4 py-3 text-right text-sm">
                      {client.salary.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
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

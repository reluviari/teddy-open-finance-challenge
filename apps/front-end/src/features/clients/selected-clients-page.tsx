import { useSelectedClients } from './selected-clients-context';
import { ClientCard } from './client-card';

export function SelectedClientsPage() {
  const { selectedClients, removeClient, clearAll } = useSelectedClients();

  return (
    <>
      <h1 className="mb-6 text-lg font-bold text-gray-900">Clientes selecionados:</h1>

      {selectedClients.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">Nenhum cliente selecionado.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {selectedClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                variant="selected"
                onRemove={() => removeClient(client.id)}
              />
            ))}
          </div>

          <button
            onClick={clearAll}
            className="mt-6 w-full rounded-[4px] border-[3px] border-teddy-orange px-4 py-2.5 font-bold text-teddy-orange transition-colors hover:bg-orange-50"
          >
            Limpar clientes selecionados
          </button>
        </>
      )}
    </>
  );
}

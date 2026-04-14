import { useState } from 'react';
import { useClients } from './hooks/use-clients';
import { useCreateClient, useUpdateClient, useDeleteClient } from './hooks/use-client-mutations';
import { useSelectedClients } from './selected-clients-context';
import { ClientsToolbar } from './clients-toolbar';
import { ClientCard } from './client-card';
import { CreateClientButton } from './create-client-button';
import { ClientsPagination } from './clients-pagination';
import { ClientModal } from './client-modal';
import { DeleteModal } from './delete-modal';
import { ClientResponse } from './types';

export function ClientsListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(16);

  const { data, isLoading, isError, error, refetch } = useClients({ page: currentPage, limit: perPage });
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const deleteMutation = useDeleteClient();
  const { selectedClients, addClient } = useSelectedClients();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientResponse | null>(null);
  const [deletingClient, setDeletingClient] = useState<ClientResponse | null>(null);

  const clients = data?.data ?? [];
  const totalClients = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalClients / perPage));

  const handleCreate = (formData: { name: string; salary: number; companyValue: number }) => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        setShowCreateModal(false);
        refetch();
      },
    });
  };

  const handleEdit = (formData: { name: string; salary: number; companyValue: number }) => {
    if (!editingClient) return;
    updateMutation.mutate(
      { id: editingClient.id, data: formData },
      {
        onSuccess: () => {
          setEditingClient(null);
          refetch();
        },
      },
    );
  };

  const handleDelete = () => {
    if (!deletingClient) return;
    deleteMutation.mutate(deletingClient.id, {
      onSuccess: () => {
        setDeletingClient(null);
        refetch();
      },
    });
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <p className="text-gray-500">Carregando clientes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-12 text-center">
        <p className="text-red-600">Erro ao carregar clientes: {error?.message}</p>
        <button onClick={refetch} className="mt-4 text-[#EC6724] hover:underline">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <>
      <ClientsToolbar
        total={totalClients}
        perPage={perPage}
        onPerPageChange={handlePerPageChange}
      />

      {clients.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">Nenhum cliente cadastrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              isSelected={selectedClients.some((c) => c.id === client.id)}
              onSelect={addClient}
              onEdit={setEditingClient}
              onDelete={setDeletingClient}
            />
          ))}
        </div>
      )}

      <CreateClientButton onClick={() => setShowCreateModal(true)} />

      <ClientsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <ClientModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
        isPending={createMutation.isPending}
        error={createMutation.error}
      />

      <ClientModal
        isOpen={!!editingClient}
        client={editingClient}
        onClose={() => setEditingClient(null)}
        onSubmit={handleEdit}
        isPending={updateMutation.isPending}
        error={updateMutation.error}
      />

      <DeleteModal
        isOpen={!!deletingClient}
        clientName={deletingClient?.name ?? ''}
        onClose={() => setDeletingClient(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </>
  );
}

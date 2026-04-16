import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '@/features/auth';
import { SelectedClientsProvider } from './selected-clients-context';
import { ClientsListPage } from './clients-list-page';

vi.mock('./hooks/use-clients', () => ({
  useClients: vi.fn(),
}));

vi.mock('./hooks/use-client-mutations', () => ({
  useCreateClient: vi.fn(() => ({ mutate: vi.fn(), isPending: false, error: null })),
  useUpdateClient: vi.fn(() => ({ mutate: vi.fn(), isPending: false, error: null })),
  useDeleteClient: vi.fn(() => ({ mutate: vi.fn(), isPending: false, error: null })),
}));

import { useClients } from './hooks/use-clients';
const mockUseClients = vi.mocked(useClients);

function renderPage() {
  return render(
    <AuthProvider>
      <SelectedClientsProvider>
        <MemoryRouter>
          <ClientsListPage />
        </MemoryRouter>
      </SelectedClientsProvider>
    </AuthProvider>,
  );
}

describe('ClientsListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state', () => {
    mockUseClients.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByText(/carregando clientes/i)).toBeInTheDocument();
  });

  it('should show error state with retry button', () => {
    mockUseClients.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Network error'),
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByText(/não foi possível carregar os clientes/i)).toBeInTheDocument();
    expect(screen.getByText(/tentar novamente/i)).toBeInTheDocument();
  });

  it('should show empty state', () => {
    mockUseClients.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByText(/nenhum cliente cadastrado/i)).toBeInTheDocument();
    expect(screen.getByText(/criar cliente/i)).toBeInTheDocument();
  });

  it('should render client cards in grid', () => {
    mockUseClients.mockReturnValue({
      data: {
        data: [
          {
            id: '1',
            name: 'Eduardo',
            salary: 3500,
            companyValue: 120000,
            viewCount: 0,
            createdAt: '',
            updatedAt: '',
          },
        ],
        total: 1,
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByText('Eduardo')).toBeInTheDocument();
    expect(screen.getByText(/clientes encontrados/i)).toBeInTheDocument();
  });
});

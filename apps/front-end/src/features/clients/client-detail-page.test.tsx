import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '@/features/auth';
import { ClientDetailPage } from './client-detail-page';

vi.mock('./hooks/use-client', () => ({
  useClient: vi.fn(),
}));

import { useClient } from './hooks/use-client';
const mockUseClient = vi.mocked(useClient);

function renderPage() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/clients/uuid-1']}>
        <Routes>
          <Route path="/clients/:id" element={<ClientDetailPage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe('ClientDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state', () => {
    mockUseClient.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText(/carregando detalhes/i)).toBeInTheDocument();
  });

  it('should show error state', () => {
    mockUseClient.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Not found'),
    });

    renderPage();

    expect(screen.getByText(/não foi possível carregar os dados do cliente/i)).toBeInTheDocument();
  });

  it('should render client details with view count', () => {
    mockUseClient.mockReturnValue({
      data: {
        id: 'uuid-1',
        name: 'Eduardo',
        salary: 3500,
        companyValue: 120000,
        viewCount: 5,
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText('Eduardo')).toBeInTheDocument();
    expect(screen.getByText(/5 visualizações/i)).toBeInTheDocument();
  });
});

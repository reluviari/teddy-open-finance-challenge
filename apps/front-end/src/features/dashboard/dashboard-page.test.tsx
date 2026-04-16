import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '@/features/auth';
import { DashboardPage } from './dashboard-page';

vi.mock('./hooks/use-dashboard', () => ({
  useDashboard: vi.fn(),
}));

import { useDashboard } from './hooks/use-dashboard';
const mockUseDashboard = vi.mocked(useDashboard);

function renderPage() {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state', () => {
    mockUseDashboard.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText(/carregando dashboard/i)).toBeInTheDocument();
  });

  it('should show error state', () => {
    mockUseDashboard.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed'),
    });

    renderPage();

    expect(screen.getByText(/não foi possível carregar o dashboard/i)).toBeInTheDocument();
  });

  it('should show empty state', () => {
    mockUseDashboard.mockReturnValue({
      data: {
        totalClients: 0,
        totalCompanyValue: 0,
        latestClients: [],
        chartData: [],
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText(/nenhum cliente cadastrado/i)).toBeInTheDocument();
  });

  it('should render totals and latest clients', () => {
    mockUseDashboard.mockReturnValue({
      data: {
        totalClients: 5,
        totalCompanyValue: 500000,
        latestClients: [
          {
            id: '1',
            name: 'Jane Doe',
            salary: 5000,
            companyValue: 100000,
            viewCount: 2,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        ],
        chartData: [{ month: '2024-01', count: 5 }],
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '@/features/auth';
import { SelectedClientsProvider } from './selected-clients-context';
import { ClientModal } from './client-modal';

function renderCreateModal() {
  return render(
    <AuthProvider>
      <SelectedClientsProvider>
        <MemoryRouter>
          <ClientModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />
        </MemoryRouter>
      </SelectedClientsProvider>
    </AuthProvider>,
  );
}

describe('ClientModal (create)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the create form with 3 fields', () => {
    renderCreateModal();

    expect(screen.getByText(/criar cliente:/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/digite o nome/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/digite o salário/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/digite o valor da empresa/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar cliente/i })).toBeInTheDocument();
  });

  it('should show validation error when name is empty', async () => {
    renderCreateModal();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /criar cliente/i }));

    expect(await screen.findByText(/nome é obrigatório/i)).toBeInTheDocument();
  });
});

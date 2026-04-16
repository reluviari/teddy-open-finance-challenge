import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from './auth-context';
import { LoginPage } from './login-page';

vi.mock('./hooks/use-login', () => ({
  useLogin: vi.fn(),
}));

import { useLogin } from './hooks/use-login';
const mockUseLogin = vi.mocked(useLogin);

function renderLoginPage() {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLogin.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isError: false,
      error: null,
    });
  });

  it('should render the login form', () => {
    renderLoginPage();

    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('should show validation errors when submitting empty form', async () => {
    renderLoginPage();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText(/e-mail é obrigatório/i)).toBeInTheDocument();
    expect(await screen.findByText(/senha é obrigatória/i)).toBeInTheDocument();
  });

  it('should show password min length error', async () => {
    renderLoginPage();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/e-mail/i), 'test@test.com');
    await user.type(screen.getByLabelText(/senha/i), '123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText(/mínimo 6 caracteres/i)).toBeInTheDocument();
  });

  it('should show loading state while login is pending', () => {
    mockUseLogin.mockReturnValue({
      mutate: vi.fn(),
      isPending: true,
      isError: false,
      error: null,
    });

    renderLoginPage();

    expect(screen.getByRole('button', { name: /entrando/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled();
  });

  it('should show error message when login fails', () => {
    mockUseLogin.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      isError: true,
      error: new Error('Credenciais inválidas'),
    });

    renderLoginPage();

    expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
  });

  it('should call mutate with form data on valid submit', async () => {
    const mockMutate = vi.fn();
    mockUseLogin.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      error: null,
    });

    renderLoginPage();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/e-mail/i), 'admin@teddy.com');
    await user.type(screen.getByLabelText(/senha/i), 'password123');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(mockMutate).toHaveBeenCalledWith(
      { email: 'admin@teddy.com', password: 'password123' },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });
});

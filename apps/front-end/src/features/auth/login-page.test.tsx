import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { AuthProvider } from './auth-context';
import { LoginPage } from './login-page';

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
});

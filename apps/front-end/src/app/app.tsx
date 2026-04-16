import { Component, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, LoginPage, ProtectedRoute } from '@/features/auth';
import {
  ClientsListPage,
  ClientDetailPage,
  SelectedClientsPage,
  SelectedClientsProvider,
} from '@/features/clients';
import { DashboardPage } from '@/features/dashboard';
import { Layout } from './layout';

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="mb-2 text-xl font-bold text-gray-900">Algo deu errado</h1>
            <p className="mb-4 text-gray-500">Ocorreu um erro inesperado.</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-[4px] bg-teddy-orange px-4 py-2 text-sm font-semibold text-white hover:bg-teddy-orange-hover"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SelectedClientsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Navigate to="/clients" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/clients" element={<ClientsListPage />} />
                  <Route path="/clients/selected" element={<SelectedClientsPage />} />
                  <Route path="/clients/:id" element={<ClientDetailPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </SelectedClientsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

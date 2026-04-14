import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, LoginPage, ProtectedRoute } from '@/features/auth';
import { ClientsListPage, ClientDetailPage, SelectedClientsPage, SelectedClientsProvider } from '@/features/clients';
import { DashboardPage } from '@/features/dashboard';
import { Layout } from './layout';

export function App() {
  return (
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
  );
}

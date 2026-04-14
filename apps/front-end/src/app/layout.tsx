import { Outlet } from 'react-router-dom';
import { AppHeader } from './app-header';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}

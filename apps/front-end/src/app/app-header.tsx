import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';

export function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `border-b-2 pb-1 text-[14px] font-medium transition-colors ${isActive ? 'border-teddy-orange text-teddy-orange' : 'border-transparent text-gray-500 hover:text-gray-800'}`;

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-5">
          <button
            className="text-xl text-gray-500 hover:text-gray-700 md:hidden"
            aria-label="Menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>

          <img
            src="/teddy-logo.svg"
            alt="Teddy Open Finance"
            className="h-12 w-auto"
          />
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/clients" end className={navLinkClass}>Clientes</NavLink>
          <NavLink to="/clients/selected" className={navLinkClass}>Clientes selecionados</NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
          <button
            onClick={handleLogout}
            className="border-b-2 border-transparent pb-1 text-[14px] font-medium text-gray-500 transition-colors hover:text-gray-800"
          >
            Sair
          </button>
        </nav>

        <span className="hidden text-[14px] text-gray-500 md:inline">
          Olá, <strong className="font-bold text-gray-800">{user?.email?.split('@')[0] || 'Usuário'}</strong>!
        </span>
      </div>

      {menuOpen && (
        <nav className="border-t border-gray-200 px-6 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            <NavLink to="/clients" end className={navLinkClass} onClick={() => setMenuOpen(false)}>Clientes</NavLink>
            <NavLink to="/clients/selected" className={navLinkClass} onClick={() => setMenuOpen(false)}>Clientes selecionados</NavLink>
            <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
            <button
              onClick={() => { setMenuOpen(false); handleLogout(); }}
              className="border-b-2 border-transparent pb-1 text-left text-[14px] font-medium text-gray-500 transition-colors hover:text-gray-800"
            >
              Sair
            </button>
            <span className="text-[14px] text-gray-500">
              Olá, <strong className="font-bold text-gray-800">{user?.email?.split('@')[0] || 'Usuário'}</strong>!
            </span>
          </div>
        </nav>
      )}
    </header>
  );
}

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';

export function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-6">
        <div className="flex items-center gap-5">
          <button className="text-xl text-gray-500 hover:text-gray-700" aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>

          <img
            src="/teddy-logo.svg"
            alt="Teddy Open Finance"
            className="h-8 w-auto"
          />
        </div>

        <nav className="flex items-center gap-8">
          <NavLink
            to="/clients"
            end
            className={({ isActive }) =>
              `border-b-2 pb-1 text-[14px] font-medium transition-colors ${isActive ? 'border-teddy-orange text-teddy-orange' : 'border-transparent text-gray-500 hover:text-gray-800'}`
            }
          >
            Clientes
          </NavLink>
          <NavLink
            to="/clients/selected"
            className={({ isActive }) =>
              `border-b-2 pb-1 text-[14px] font-medium transition-colors ${isActive ? 'border-teddy-orange text-teddy-orange' : 'border-transparent text-gray-500 hover:text-gray-800'}`
            }
          >
            Clientes selecionados
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `border-b-2 pb-1 text-[14px] font-medium transition-colors ${isActive ? 'border-teddy-orange text-teddy-orange' : 'border-transparent text-gray-500 hover:text-gray-800'}`
            }
          >
            Dashboard
          </NavLink>
          <button
            onClick={handleLogout}
            className="border-b-2 border-transparent pb-1 text-[14px] font-medium text-gray-500 transition-colors hover:text-gray-800"
          >
            Sair
          </button>
        </nav>

        <span className="text-[14px] text-gray-500">
          Olá, <strong className="font-bold text-gray-800">{user?.email?.split('@')[0] || 'Usuário'}</strong>!
        </span>
      </div>
    </header>
  );
}

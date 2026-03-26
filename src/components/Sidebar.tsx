import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Gamepad2, ShoppingCart, CreditCard,
  LogOut, Settings, ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { gamesService } from '../services/gamesService';
import type { Game } from '../types';

interface SidebarProps {
  mobile?: boolean
  onClose?: () => void
}

export default function Sidebar({ mobile, onClose }: SidebarProps) {
  const { user, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [gamesOpen, setGamesOpen] = useState(false);
  const [gamesList, setGamesList] = useState<Game[]>([]);

  useEffect(() => {
    gamesService.getAll().then(setGamesList);
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/games')) setGamesOpen(true);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navBase = 'flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-150 group w-full';
  const navActive = 'bg-white/[0.08] text-white';
  const navInactive = 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.04]';

  return (
    <aside className={`flex flex-col h-full border-r border-white/[0.06] bg-gray-900 ${mobile ? 'w-full' : 'w-56'}`}>

      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/[0.06] shrink-0">
        <img src="/sidebar-logo.svg" alt="GameXPay" className="h-7 w-auto" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto scrollbar-thin">

        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          onClick={mobile ? onClose : undefined}
          className={({ isActive }) => `${navBase} ${isActive ? navActive : navInactive}`}
        >
          {({ isActive }) => (
            <>
              <LayoutDashboard size={15} className={isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-300'} />
              Dashboard
            </>
          )}
        </NavLink>

        {/* Games — expandable */}
        <div>
          <button
            onClick={() => setGamesOpen(o => !o)}
            className={`${navBase} ${location.pathname.startsWith('/games') ? navActive : navInactive}`}
          >
            <Gamepad2 size={15} className={location.pathname.startsWith('/games') ? 'text-white' : 'text-gray-600 group-hover:text-gray-300'} />
            <span className="flex-1 text-left">Games</span>
            <ChevronDown
              size={13}
              className={`text-gray-600 transition-transform duration-200 ${gamesOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {gamesOpen && (
            <div className="ml-3 mt-0.5 pl-3 border-l border-white/[0.07] space-y-0.5">
              <NavLink
                to="/games"
                end
                onClick={mobile ? onClose : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-colors ${isActive ? 'text-white bg-white/[0.06]' : 'text-gray-500 hover:text-gray-200 hover:bg-white/[0.03]'}`
                }
              >
                All Games
              </NavLink>
              {gamesList.map(game => (
                <button
                  key={game.id}
                  onClick={() => {
                    navigate('/games', { state: { editGameId: game.id } });
                    if (mobile) onClose?.();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] transition-colors text-gray-600 hover:text-gray-200 hover:bg-white/[0.03] text-left"
                >
                  <img
                    src={game.image}
                    alt={game.shortName}
                    className="w-4 h-4 rounded shrink-0 object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <span className="truncate">{game.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Orders */}
        <NavLink
          to="/orders"
          onClick={mobile ? onClose : undefined}
          className={({ isActive }) => `${navBase} ${isActive ? navActive : navInactive}`}
        >
          {({ isActive }) => (
            <>
              <ShoppingCart size={15} className={isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-300'} />
              Orders
            </>
          )}
        </NavLink>

        {/* Transactions */}
        <NavLink
          to="/transactions"
          onClick={mobile ? onClose : undefined}
          className={({ isActive }) => `${navBase} ${isActive ? navActive : navInactive}`}
        >
          {({ isActive }) => (
            <>
              <CreditCard size={15} className={isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-300'} />
              Transactions
            </>
          )}
        </NavLink>

        {/* Settings */}
        <NavLink
          to="/settings"
          onClick={mobile ? onClose : undefined}
          className={({ isActive }) => `${navBase} ${isActive ? navActive : navInactive}`}
        >
          {({ isActive }) => (
            <>
              <Settings size={15} className={isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-300'} />
              Settings
            </>
          )}
        </NavLink>
      </nav>

      {/* User */}
      <div className="px-2 py-3 border-t border-white/[0.06] shrink-0 space-y-0.5">
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md bg-white/[0.04]">
          <div className="w-6 h-6 rounded-full bg-gray-800 border border-white/10 overflow-hidden shrink-0">
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              : <span className="text-[10px] font-bold text-gray-200 flex items-center justify-center w-full h-full">{user?.name?.[0] ?? 'A'}</span>
            }
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-gray-200 truncate">{user?.name}</p>
            <p className="text-[10px] text-gray-600">{isSuperAdmin ? 'Super Admin' : 'Admin'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] text-gray-600 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

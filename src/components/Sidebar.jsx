import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Gamepad2, ShoppingCart, CreditCard, LogOut, ChevronRight, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/games', label: 'Games', icon: Gamepad2 },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/transactions', label: 'Transactions', icon: CreditCard },
];

export default function Sidebar({ mobile, onClose }) {
  const { user, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className={`
      flex flex-col h-full bg-gray-900 border-r border-gray-700/50
      ${mobile ? 'w-full' : 'w-64'}
    `}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-700/50 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-gray-100 tracking-tight">GameXPay</span>
            <p className="text-[10px] text-gray-500 leading-none mt-0.5">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={mobile ? onClose : undefined}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              transition-colors duration-150 group
              ${isActive
                ? 'bg-violet-600/20 text-violet-400 border border-violet-500/20'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/70'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? 'text-violet-400' : 'text-gray-500 group-hover:text-gray-300'} />
                {label}
                {isActive && <ChevronRight size={13} className="ml-auto text-violet-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="px-3 py-3 border-t border-gray-700/50 shrink-0">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-800/50 mb-1">
          <div className="w-7 h-7 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-violet-400">
              {user?.name?.[0] ?? 'A'}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-200 truncate">{user?.name}</p>
            <span className={`
              text-[10px] font-medium px-1.5 py-0.5 rounded-full
              ${isSuperAdmin
                ? 'bg-violet-500/20 text-violet-400'
                : 'bg-gray-700 text-gray-400'
              }
            `}>
              {isSuperAdmin ? 'Super Admin' : 'Admin'}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

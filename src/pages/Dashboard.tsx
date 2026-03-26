import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart, Clock, TrendingUp,
  ArrowRight, CheckCircle, XCircle,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import { ordersService } from '../services/ordersService';
import { gamesService } from '../services/gamesService';
import { useAuth } from '../context/AuthContext';
import type { Order, Game } from '../types';

function fmt(n: number): string {
  return '₦' + Number(n).toLocaleString('en-NG');
}

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default function Dashboard() {
  const { isSuperAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([ordersService.getAll(), gamesService.getAll()])
      .then(([o, g]) => { setOrders(o); setGames(g); })
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.amount, 0);
  const totalProfit = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.profit, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const activeGames = games.filter(g => g.status === 'active').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Overview of your GameXPay store</p>
      </div>

      {/* Stats — horizontal strip */}
      <div className="bg-gray-900 border border-gray-700/50 rounded-xl overflow-x-auto">
        <div className="flex min-w-[640px]">
          {[
            { label: 'Total Revenue', value: fmt(totalRevenue), change: '+12.4%', positive: true, color: 'text-violet-400', sub: 'than last month' },
            ...(isSuperAdmin ? [{ label: 'Total Profit', value: fmt(totalProfit), change: '+8.1%', positive: true, color: 'text-emerald-400', sub: 'than last month' }] : []),
            { label: 'Total Orders', value: totalOrders.toLocaleString(), change: '+5.3%', positive: true, color: 'text-sky-400', sub: 'than last month' },
            { label: 'Pending Orders', value: pendingOrders.toLocaleString(), change: '-2.7%', positive: false, color: 'text-amber-400', sub: 'than last month' },
            { label: 'Active Games', value: activeGames.toLocaleString(), change: `${games.length} total`, positive: true, color: 'text-rose-400', sub: 'in catalog' },
          ].map((stat, i, arr) => (
            <div
              key={stat.label}
              className={`flex-1 px-6 py-5 ${i < arr.length - 1 ? 'border-r border-gray-700/50' : ''}`}
            >
              <p className="text-xs text-gray-400 mb-1.5 font-medium">{stat.label}</p>
              <p className={`text-3xl leading-none mb-2 ${stat.color}`} style={{ fontFamily: "'Big Shoulders Display', sans-serif", fontWeight: 900, letterSpacing: '0em' }}>{stat.value}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${stat.positive ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-gray-500">· {stat.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Status breakdown */}
        <div className="bg-gray-900 border border-gray-700/50 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">Order Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: 'Completed', count: completedOrders, color: 'bg-emerald-500', total: totalOrders },
              { label: 'Pending', count: pendingOrders, color: 'bg-amber-500', total: totalOrders },
              { label: 'Cancelled', count: cancelledOrders, color: 'bg-red-500', total: totalOrders },
            ].map(({ label, count, color, total }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">{label}</span>
                  <span className="text-xs font-semibold text-gray-200">{count}</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all`}
                    style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-300">Recent Orders</h2>
            <Link
              to="/orders"
              className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              View all <ArrowRight size={13} />
            </Link>
          </div>
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 border-b border-gray-700/40 last:border-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-gray-800 flex items-center justify-center shrink-0">
                    {order.status === 'completed' ? (
                      <CheckCircle size={14} className="text-emerald-400" />
                    ) : order.status === 'cancelled' ? (
                      <XCircle size={14} className="text-red-400" />
                    ) : (
                      <Clock size={14} className="text-amber-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-200 truncate">
                      {order.id} — {order.game.name}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">{order.customerEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <Badge status={order.status} />
                  <span className="text-xs font-semibold text-gray-200">{fmt(order.amount)}</span>
                  <span className="text-[11px] text-gray-500 hidden sm:inline">{fmtDate(order.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game catalog quick stats */}
      <div className="bg-gray-900 border border-gray-700/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-300">Game Catalog</h2>
          <Link
            to="/games"
            className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            Manage <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {games.map((game) => (
            <div
              key={game.id}
              className="flex flex-col items-center gap-2 p-3 bg-gray-800/50 border border-gray-700/40 rounded-lg text-center"
            >
              <img
                src={game.image}
                alt={game.name}
                className="w-6 h-6 rounded object-cover"
                onError={(e) => { e.currentTarget.src = `https://placehold.co/24x24/1e1e1e/ffffff?text=${game.shortName}`; }}
              />
              <div>
                <p className="text-xs font-medium text-gray-200 truncate w-full">{game.shortName}</p>
                <p className="text-[10px] text-gray-500">{game.bundles.length} bundles</p>
              </div>
              <Badge status={game.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

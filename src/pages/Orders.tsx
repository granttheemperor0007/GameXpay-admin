import { useEffect, useState, useCallback, type ReactNode } from 'react';
import { Search, Filter, ExternalLink, CheckCircle, XCircle, StickyNote, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ordersService } from '../services/ordersService';
import { gamesService } from '../services/gamesService';
import { useAuth } from '../context/AuthContext';
import Table from '../components/Table';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { Select } from '../components/Input';
import DateRangePicker from '../components/DateRangePicker';
import type { Order, Game, OrderStatus } from '../types';

function fmt(n: number): string {
  return '₦' + Number(n).toLocaleString('en-NG');
}

function fmtDateTime(d: string): string {
  return new Date(d).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── Order Detail Modal ────────────────────────────────────────────────────────
interface OrderDetailModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onStatusChange: (id: string, newStatus: OrderStatus) => void
  onNoteSaved: (id: string, note: string) => void
  isSuperAdmin: boolean
}

function OrderDetailModal({ order, isOpen, onClose, onStatusChange, onNoteSaved, isSuperAdmin }: OrderDetailModalProps) {
  const [note, setNote] = useState('');
  const [editNote, setEditNote] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  useEffect(() => {
    if (order) {
      setNote(order.notes || '');
      setEditNote(false);
    }
  }, [order]);

  if (!order) return null;

  const handleAction = async (action: string) => {
    setActionLoading(action);
    try {
      const newStatus: OrderStatus = action === 'complete' ? 'completed' : 'cancelled';
      await ordersService.updateStatus(order.id, newStatus);
      onStatusChange(order.id, newStatus);
      setConfirmAction(null);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveNote = async () => {
    setSavingNote(true);
    try {
      await ordersService.addNote(order.id, note);
      onNoteSaved(order.id, note);
      setEditNote(false);
    } finally {
      setSavingNote(false);
    }
  };

  const Row = ({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) => (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-2.5 border-b border-gray-700/40 last:border-0">
      <span className="text-xs text-gray-500 sm:w-40 shrink-0">{label}</span>
      <span className={`text-sm text-gray-200 break-all ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={`Order ${order.id}`} size="lg">
        <div className="space-y-5">
          {/* Status + Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge status={order.status} />
            {isSuperAdmin && order.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  variant="success"
                  icon={<CheckCircle size={13} />}
                  onClick={() => setConfirmAction('complete')}
                  loading={actionLoading === 'complete'}
                >
                  Mark Completed
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  icon={<XCircle size={13} />}
                  onClick={() => setConfirmAction('cancel')}
                  loading={actionLoading === 'cancel'}
                >
                  Mark Cancelled
                </Button>
              </>
            )}
          </div>

          {/* Customer */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Customer</h3>
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg px-4">
              <Row label="Email" value={order.customerEmail} />
              <Row label="Player ID" value={order.playerID} />
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Product</h3>
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg px-4">
              <Row label="Game" value={order.game.name} />
              <Row label="Bundle" value={order.bundle.name} />
              <Row label="Selling Price" value={fmt(order.bundle.sellingPrice)} />
              {isSuperAdmin && <Row label="Cost Price" value={fmt(order.bundle.costPrice)} />}
              {isSuperAdmin && (
                <Row
                  label="Profit"
                  value={
                    <span className={order.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {fmt(order.profit)}
                    </span>
                  }
                />
              )}
            </div>
          </div>

          {/* Redemption Instructions */}
          {order.redemptionInstructions && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Redemption Instructions</h3>
              <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-4">
                <pre className="text-xs text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {order.redemptionInstructions}
                </pre>
              </div>
            </div>
          )}

          {/* Payment */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment</h3>
            <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg px-4">
              <Row label="Paystack Ref" value={order.paystackRef} mono />
              <Row label="Payment Status" value={<Badge status={order.paymentStatus} />} />
              <Row label="Amount Paid" value={fmt(order.amount)} />
              <Row label="Timestamp" value={fmtDateTime(order.transactionTimestamp)} />
              <Row
                label="Transaction"
                value={
                  <Link
                    to={`/transactions?id=${order.transactionId}`}
                    className="flex items-center gap-1 text-violet-400 hover:text-violet-300 transition-colors text-xs"
                    onClick={onClose}
                  >
                    {order.transactionId} <ExternalLink size={11} />
                  </Link>
                }
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Notes</h3>
              {isSuperAdmin && !editNote && (
                <button
                  onClick={() => setEditNote(true)}
                  className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <StickyNote size={12} />
                  {order.notes ? 'Edit note' : 'Add note'}
                </button>
              )}
            </div>
            {editNote ? (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-y"
                  placeholder="Add a note about this order..."
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveNote} loading={savingNote}>Save Note</Button>
                  <Button size="sm" variant="secondary" onClick={() => { setNote(order.notes || ''); setEditNote(false); }}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-3 min-h-[48px]">
                {order.notes
                  ? <p className="text-sm text-gray-300">{order.notes}</p>
                  : <p className="text-xs text-gray-500 italic">No notes added.</p>
                }
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Confirm action dialog */}
      <ConfirmDialog
        isOpen={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => { if (confirmAction) handleAction(confirmAction); }}
        loading={Boolean(actionLoading)}
        title={confirmAction === 'complete' ? 'Mark as Completed' : 'Mark as Cancelled'}
        message={
          confirmAction === 'complete'
            ? `Mark order ${order.id} as completed? This confirms the top-up was delivered.`
            : `Mark order ${order.id} as cancelled? This action cannot be undone.`
        }
        confirmLabel={confirmAction === 'complete' ? 'Mark Completed' : 'Mark Cancelled'}
        confirmVariant={confirmAction === 'complete' ? 'success' : 'danger'}
      />
    </>
  );
}

interface OrderFilters {
  search: string
  status: string
  gameId: string
  dateFrom: string
  dateTo: string
}

// ─── Main Orders Page ──────────────────────────────────────────────────────────
export default function Orders() {
  const { isSuperAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<OrderFilters>({
    search: '', status: '', gameId: '', dateFrom: '', dateTo: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [o, g] = await Promise.all([ordersService.getAll(filters), gamesService.getAll()]);
      setOrders(o);
      setGames(g);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const handleStatusChange = (id: string, newStatus: OrderStatus) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o));
    if (selectedOrder?.id === id) {
      setSelectedOrder((o) => o ? { ...o, status: newStatus } : o);
    }
  };

  const handleNoteSaved = (id: string, note: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, notes: note } : o));
    if (selectedOrder?.id === id) {
      setSelectedOrder((o) => o ? { ...o, notes: note } : o);
    }
  };

  const resetFilters = () => {
    setFilters({ search: '', status: '', gameId: '', dateFrom: '', dateTo: '' });
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const columns = [
    { key: 'id', label: 'Order ID', render: (val: unknown) => <span className="font-mono text-xs text-violet-400">{val as string}</span> },
    { key: 'status', label: 'Status', render: (val: unknown) => <Badge status={val as string} /> },
    { key: 'customerEmail', label: 'Customer Email', render: (val: unknown) => <span className="text-xs">{val as string}</span> },
    { key: 'playerID', label: 'Player ID', render: (val: unknown) => <span className="font-mono text-xs">{val as string}</span> },
    {
      key: 'game',
      label: 'Product',
      render: (val: unknown, row: Order) => (
        <div>
          <p className="text-xs font-medium text-gray-200">{(val as Order['game'])?.name}</p>
          <p className="text-[11px] text-gray-500">{row.bundle?.name}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (val: unknown) => <span className="font-semibold text-gray-200">{fmt(val as number)}</span>,
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (val: unknown) => <span className="text-xs text-gray-400">{fmtDateTime(val as string)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Orders</h1>
        <p className="text-sm text-gray-500 mt-0.5">View and manage customer orders</p>
      </div>

      {/* Filters bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 sm:max-w-sm">
            <Search size={15} style={{ color: '#6F6F6F' }} className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Search order ID, email, player ID..."
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            />
          </div>
          <Button
            variant="secondary"
            icon={<Filter size={14} />}
            onClick={() => setFiltersOpen((v) => !v)}
          >
            Filters
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
            )}
            <ChevronDown size={13} className={`transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="md" onClick={resetFilters} className="text-gray-400">
              Clear
            </Button>
          )}
        </div>

        {/* Expanded filters */}
        {filtersOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-gray-900 border border-gray-700/50 rounded-xl">
            <Select
              label="Status"
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
            <Select
              label="Game"
              value={filters.gameId}
              onChange={(e) => setFilters((f) => ({ ...f, gameId: e.target.value }))}
            >
              <option value="">All Games</option>
              {games.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </Select>
            <DateRangePicker
              label="Date Range"
              from={filters.dateFrom}
              to={filters.dateTo}
              onChange={(from, to) => setFilters((f) => ({ ...f, dateFrom: from, dateTo: to }))}
            />
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-500">
        {orders.length} order{orders.length !== 1 ? 's' : ''} found
      </p>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16 text-gray-500">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <Table<Order>
          columns={columns}
          data={orders}
          onRowClick={setSelectedOrder}
          emptyMessage="No orders match your filters."
        />
      )}

      {/* Order detail modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={handleStatusChange}
        onNoteSaved={handleNoteSaved}
        isSuperAdmin={isSuperAdmin}
      />
    </div>
  );
}

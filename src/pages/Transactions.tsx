import { useEffect, useState, useCallback, type ReactNode } from 'react';
import { Search, Filter, ExternalLink, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { transactionsService } from '../services/transactionsService';
import Table from '../components/Table';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Select } from '../components/Input';
import DateRangePicker from '../components/DateRangePicker';
import type { Transaction } from '../types';

function fmt(n: number): string {
  return '₦' + Number(n).toLocaleString('en-NG');
}

function fmtDateTime(d: string): string {
  return new Date(d).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── Transaction Detail Modal ──────────────────────────────────────────────────
interface TransactionDetailModalProps {
  txn: Transaction | null
  isOpen: boolean
  onClose: () => void
}

function TransactionDetailModal({ txn, isOpen, onClose }: TransactionDetailModalProps) {
  if (!txn) return null;

  const Row = ({ label, value, mono }: { label: string; value: ReactNode; mono?: boolean }) => (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-2.5 border-b border-gray-700/40 last:border-0">
      <span className="text-xs text-gray-500 sm:w-40 shrink-0">{label}</span>
      <span className={`text-sm text-gray-200 break-all ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Transaction ${txn.id}`} size="md">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge status={txn.status} />
          <span className="text-sm font-semibold text-gray-200">{fmt(txn.amount)}</span>
        </div>
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg px-4">
          <Row label="Transaction ID" value={txn.id} mono />
          <Row label="Paystack Ref" value={txn.paystackRef} mono />
          <Row label="Customer Email" value={txn.customerEmail} />
          <Row label="Amount" value={fmt(txn.amount)} />
          <Row label="Status" value={<Badge status={txn.status} />} />
          <Row label="Date & Time" value={fmtDateTime(txn.createdAt)} />
          <Row
            label="Linked Order"
            value={
              <Link
                to={`/orders`}
                className="flex items-center gap-1 text-violet-400 hover:text-violet-300 transition-colors text-xs"
                onClick={onClose}
              >
                {txn.linkedOrderId} <ExternalLink size={11} />
              </Link>
            }
          />
        </div>
      </div>
    </Modal>
  );
}

interface TxnFilters {
  search: string
  status: string
  dateFrom: string
  dateTo: string
  amountMin: string
  amountMax: string
}

// ─── Main Transactions Page ────────────────────────────────────────────────────
export default function Transactions() {
  const location = useLocation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<TxnFilters>({
    search: '', status: '', dateFrom: '', dateTo: '', amountMin: '', amountMax: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await transactionsService.getAll(filters);
      setTransactions(data);

      // If navigated here with ?id=TXN-xxx, open that transaction
      const params = new URLSearchParams(location.search);
      const deepId = params.get('id');
      if (deepId) {
        const found = data.find((t) => t.id === deepId);
        if (found) setSelectedTxn(found);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, location.search]);

  useEffect(() => { load(); }, [load]);

  const resetFilters = () => {
    setFilters({ search: '', status: '', dateFrom: '', dateTo: '', amountMin: '', amountMax: '' });
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const columns = [
    {
      key: 'id',
      label: 'Transaction ID',
      render: (val: unknown) => <span className="font-mono text-xs text-violet-400">{val as string}</span>,
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (val: unknown) => <span className="font-semibold text-gray-200">{fmt(val as number)}</span>,
    },
    {
      key: 'customerEmail',
      label: 'Customer Email',
      render: (val: unknown) => <span className="text-xs">{val as string}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val: unknown) => <Badge status={val as string} />,
    },
    {
      key: 'createdAt',
      label: 'Date & Time',
      render: (val: unknown) => <span className="text-xs text-gray-400">{fmtDateTime(val as string)}</span>,
    },
    {
      key: 'linkedOrderId',
      label: 'Linked Order',
      render: (val: unknown) => (
        <span className="font-mono text-xs text-gray-400">{val as string}</span>
      ),
    },
    {
      key: 'paystackRef',
      label: 'Paystack Ref',
      render: (val: unknown) => (
        <span className="font-mono text-[11px] text-gray-500 truncate max-w-[140px] block" title={val as string}>
          {val as string}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Transactions</h1>
        <p className="text-sm text-gray-500 mt-0.5">Payment records from Paystack — read only</p>
      </div>

      {/* Filters bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 sm:max-w-sm">
            <Search size={15} style={{ color: '#6F6F6F' }} className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Search by ID, email, order, ref..."
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
            <Button variant="ghost" onClick={resetFilters} className="text-gray-400">
              Clear
            </Button>
          )}
        </div>

        {filtersOpen && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-gray-900 border border-gray-700/50 rounded-xl">
            <Select
              label="Status"
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            >
              <option value="">All Statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="abandoned">Abandoned</option>
            </Select>
            <DateRangePicker
              label="Date Range"
              from={filters.dateFrom}
              to={filters.dateTo}
              onChange={(from, to) => setFilters((f) => ({ ...f, dateFrom: from, dateTo: to }))}
            />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Min Amount (₦)</label>
              <input
                type="number"
                placeholder="e.g. 1000"
                value={filters.amountMin}
                onChange={(e) => setFilters((f) => ({ ...f, amountMin: e.target.value }))}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Max Amount (₦)</label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={filters.amountMax}
                onChange={(e) => setFilters((f) => ({ ...f, amountMax: e.target.value }))}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-500">
        {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} found
      </p>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16 text-gray-500">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <Table<Transaction>
          columns={columns}
          data={transactions}
          onRowClick={setSelectedTxn}
          emptyMessage="No transactions match your filters."
        />
      )}

      <TransactionDetailModal
        txn={selectedTxn}
        isOpen={Boolean(selectedTxn)}
        onClose={() => setSelectedTxn(null)}
      />
    </div>
  );
}

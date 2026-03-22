import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Pencil, Power, Trash2, Package, Search, Calculator } from 'lucide-react';
import { gamesService } from '../services/gamesService';
import { useAuth } from '../context/AuthContext';
import Table from '../components/Table';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Input, { Textarea } from '../components/Input';

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function fmt(n) {
  return '₦' + Number(n).toLocaleString('en-NG');
}

// ─── Bundle Row ────────────────────────────────────────────────────────────────
function BundleRow({ bundle, onChange, onRemove, isSuperAdmin, index }) {
  const profit = (Number(bundle.sellingPrice) || 0) - (Number(bundle.costPrice) || 0);

  return (
    <div className="flex gap-2 items-start bg-gray-800/40 border border-gray-700/50 rounded-lg p-3">
      <div className="flex-1 grid grid-cols-2 gap-2">
        <Input
          placeholder="Bundle name (e.g. 80 CP)"
          value={bundle.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
        />
        <Input
          type="number"
          placeholder="Selling Price ₦"
          value={bundle.sellingPrice}
          onChange={(e) => onChange(index, 'sellingPrice', e.target.value)}
        />
        {isSuperAdmin && (
          <>
            <Input
              type="number"
              placeholder="Cost Price ₦"
              value={bundle.costPrice}
              onChange={(e) => onChange(index, 'costPrice', e.target.value)}
            />
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-900/60 border border-gray-700/50 rounded-lg">
              <Calculator size={13} className="text-emerald-400 shrink-0" />
              <span className="text-xs text-gray-400">Profit:</span>
              <span className={`text-xs font-bold ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {fmt(profit)}
              </span>
            </div>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-0.5"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// ─── Game Form Modal ───────────────────────────────────────────────────────────
function GameFormModal({ isOpen, onClose, game, onSaved }) {
  const { isSuperAdmin } = useAuth();
  const isEdit = Boolean(game);

  const emptyForm = {
    name: '',
    image: '',
    redemptionInstructions: '',
    status: 'active',
    bundles: [{ id: `new-${Date.now()}`, name: '', sellingPrice: '', costPrice: '' }],
  };

  const [form, setForm] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const bundlesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (game) {
        setForm({
          name: game.name,
          image: game.image,
          redemptionInstructions: game.redemptionInstructions,
          status: game.status,
          bundles: game.bundles.map((b) => ({ ...b })),
        });
        setImagePreview(game.image);
      } else {
        setForm(emptyForm);
        setImagePreview('');
      }
      setErrors({});
    }
  }, [isOpen, game]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setForm((f) => ({ ...f, image: url }));
  };

  const addBundle = () => {
    setForm((f) => ({
      ...f,
      bundles: [...f.bundles, { id: `new-${Date.now()}`, name: '', sellingPrice: '', costPrice: '' }],
    }));
    setTimeout(() => bundlesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const updateBundle = (idx, field, value) => {
    setForm((f) => {
      const bundles = [...f.bundles];
      bundles[idx] = { ...bundles[idx], [field]: value };
      return { ...f, bundles };
    });
  };

  const removeBundle = (idx) => {
    setForm((f) => ({ ...f, bundles: f.bundles.filter((_, i) => i !== idx) }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Game name is required.';
    if (form.bundles.length === 0) e.bundles = 'Add at least one bundle.';
    form.bundles.forEach((b, i) => {
      if (!b.name.trim()) e[`bundle_name_${i}`] = 'required';
      if (!b.sellingPrice) e[`bundle_sp_${i}`] = 'required';
    });
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      const payload = {
        ...form,
        shortName: form.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 4),
        bundles: form.bundles.map((b) => ({
          ...b,
          sellingPrice: Number(b.sellingPrice),
          costPrice: Number(b.costPrice) || 0,
        })),
      };
      if (isEdit) {
        await gamesService.update(game.id, payload);
      } else {
        await gamesService.create(payload);
      }
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit Game — ${game?.name}` : 'Add New Game'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name + Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Game Name *"
            placeholder="e.g. Call of Duty Mobile"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            error={errors.name}
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-400">Game Image</label>
            <div className="flex items-center gap-3">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-6 h-6 rounded object-cover border border-white/10"
                  onError={(e) => { e.target.src = 'https://placehold.co/24x24/1e1e1e/ffffff?text=?'; }}
                />
              )}
              <label className="flex-1 cursor-pointer">
                <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                <div className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-400 hover:border-violet-500 transition-colors text-center">
                  {imagePreview ? 'Change image' : 'Upload image'}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Redemption instructions */}
        <Textarea
          label="Redemption Instructions"
          placeholder="Step-by-step guide for customers to redeem their purchase..."
          value={form.redemptionInstructions}
          onChange={(e) => setForm((f) => ({ ...f, redemptionInstructions: e.target.value }))}
          rows={4}
        />

        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-400">Status</label>
          <div className="flex gap-3">
            {['active', 'inactive'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setForm((f) => ({ ...f, status: s }))}
                className={`
                  px-4 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize
                  ${form.status === s
                    ? s === 'active'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-gray-700 text-gray-300 border-gray-600'
                    : 'bg-transparent text-gray-500 border-gray-700 hover:border-gray-500'
                  }
                `}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Bundles */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="text-xs font-medium text-gray-400">Bundles</label>
              {errors.bundles && <p className="text-xs text-red-400 mt-0.5">{errors.bundles}</p>}
            </div>
            <Button type="button" variant="secondary" size="sm" icon={<Plus size={13} />} onClick={addBundle}>
              Add Bundle
            </Button>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin pr-1">
            {form.bundles.map((bundle, idx) => (
              <BundleRow
                key={bundle.id}
                bundle={bundle}
                index={idx}
                onChange={updateBundle}
                onRemove={removeBundle}
                isSuperAdmin={isSuperAdmin}
              />
            ))}
            {form.bundles.length === 0 && (
              <p className="text-xs text-gray-500 text-center py-4">
                No bundles yet. Click "Add Bundle" to add one.
              </p>
            )}
            <div ref={bundlesEndRef} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2 border-t border-gray-700/50">
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {isEdit ? 'Save Changes' : 'Create Game'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Main Games Page ───────────────────────────────────────────────────────────
export default function Games() {
  const { isSuperAdmin } = useAuth();
  const location = useLocation();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formModal, setFormModal] = useState({ open: false, game: null });
  const [toggleConfirm, setToggleConfirm] = useState({ open: false, game: null });
  const [toggleLoading, setToggleLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    gamesService.getAll().then(setGames).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  // Auto-open edit modal when navigated from sidebar
  useEffect(() => {
    const editGameId = location.state?.editGameId;
    if (editGameId && games.length > 0) {
      const target = games.find(g => g.id === editGameId);
      if (target) {
        setFormModal({ open: true, game: target });
        // Clear state so refreshing doesn't re-open
        window.history.replaceState({}, '');
      }
    }
  }, [location.state, games]);

  const filtered = games.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = async () => {
    if (!toggleConfirm.game) return;
    setToggleLoading(true);
    try {
      await gamesService.toggleStatus(toggleConfirm.game.id);
      load();
      setToggleConfirm({ open: false, game: null });
    } finally {
      setToggleLoading(false);
    }
  };

  const columns = [
    {
      key: 'image',
      label: '',
      width: '56px',
      render: (val, row) => (
        <img
          src={val}
          alt={row.name}
          className="w-6 h-6 rounded object-cover"
          onError={(e) => { e.target.src = `https://placehold.co/24x24/1e1e1e/ffffff?text=${row.shortName}`; }}
        />
      ),
    },
    {
      key: 'name',
      label: 'Game Name',
      render: (val, row) => (
        <div>
          <p className="font-medium text-gray-200">{val}</p>
          <p className="text-xs text-gray-500">{row.shortName}</p>
        </div>
      ),
    },
    {
      key: 'bundles',
      label: 'Bundles',
      render: (val) => (
        <div className="flex items-center gap-1.5 text-gray-400">
          <Package size={13} />
          <span>{val?.length ?? 0}</span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date Created',
      render: (val) => <span className="text-gray-400">{fmtDate(val)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge status={val} />,
    },
    ...(isSuperAdmin
      ? [
          {
            key: '_actions',
            label: 'Actions',
            render: (_val, row) => (
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setFormModal({ open: true, game: row })}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setToggleConfirm({ open: true, game: row })}
                  className={`p-1.5 rounded-lg transition-colors ${
                    row.status === 'active'
                      ? 'text-gray-400 hover:text-amber-400 hover:bg-amber-500/10'
                      : 'text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                  title={row.status === 'active' ? 'Deactivate' : 'Activate'}
                >
                  <Power size={14} />
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-100">Games</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your game catalog and bundles</p>
        </div>
        {isSuperAdmin && (
          <Button icon={<Plus size={15} />} onClick={() => setFormModal({ open: true, game: null })}>
            Add Game
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-72">
        <Search size={15} style={{ color: '#6F6F6F' }} className="absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          placeholder="Search games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16 text-gray-500">
          <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <Table
          columns={columns}
          data={filtered}
          emptyMessage="No games found."
        />
      )}

      {/* Modals */}
      <GameFormModal
        isOpen={formModal.open}
        onClose={() => setFormModal({ open: false, game: null })}
        game={formModal.game}
        onSaved={load}
      />

      <ConfirmDialog
        isOpen={toggleConfirm.open}
        onClose={() => setToggleConfirm({ open: false, game: null })}
        onConfirm={handleToggle}
        loading={toggleLoading}
        title={toggleConfirm.game?.status === 'active' ? 'Deactivate Game' : 'Activate Game'}
        message={
          toggleConfirm.game?.status === 'active'
            ? `Deactivating "${toggleConfirm.game?.name}" will hide it from customers. Continue?`
            : `Activating "${toggleConfirm.game?.name}" will make it visible to customers. Continue?`
        }
        confirmLabel={toggleConfirm.game?.status === 'active' ? 'Deactivate' : 'Activate'}
        confirmVariant={toggleConfirm.game?.status === 'active' ? 'danger' : 'success'}
      />
    </div>
  );
}

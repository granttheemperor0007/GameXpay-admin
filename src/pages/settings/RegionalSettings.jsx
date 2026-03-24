import { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import { useToast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';
import Toggle from '../../components/Toggle';
import Button from '../../components/Button';

function SectionCard({ title, description, children, onSave, saving, action }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-start justify-between px-6 py-4 border-b border-gray-800">
        <div>
          <h3 className="text-sm font-semibold text-gray-100">{title}</h3>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          {action}
          {onSave && (
            <Button size="sm" onClick={onSave} loading={saving} variant="primary">Save Changes</Button>
          )}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

const emptyCountry = { name: '', code: '', flag: '', enabled: true, kyc: 'Basic', minAge: 18, taxRate: 0, amlThreshold: 500000 };

function AddCountryModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState(emptyCountry);
  const [errors, setErrors] = useState({});

  useEffect(() => { if (isOpen) { setForm(emptyCountry); setErrors({}); } }, [isOpen]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.code.trim()) e.code = 'Required';
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd({ ...form, code: form.code.toUpperCase() });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-sm font-semibold text-gray-100">Add Country / Region</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors">
            <X size={15} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Country Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Nigeria"
                className="w-full px-3 py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Country Code *</label>
              <input value={form.code} onChange={e => set('code', e.target.value)} placeholder="e.g. NG" maxLength={3}
                className="w-full px-3 py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 uppercase" />
              {errors.code && <p className="text-xs text-red-400 mt-1">{errors.code}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Flag Emoji</label>
            <input value={form.flag} onChange={e => set('flag', e.target.value)} placeholder="e.g. 🇳🇬"
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">KYC Level</label>
              <select value={form.kyc} onChange={e => set('kyc', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500">
                {['None', 'Basic', 'Full'].map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Min Age</label>
              <input type="number" value={form.minAge} onChange={e => set('minAge', Number(e.target.value))} min={13}
                className="w-full px-3 py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Tax Rate (%)</label>
              <input type="number" value={form.taxRate} onChange={e => set('taxRate', Number(e.target.value))} min={0}
                className="w-full px-3 py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">AML Threshold (₦)</label>
              <input type="number" value={form.amlThreshold} onChange={e => set('amlThreshold', Number(e.target.value))} min={0}
                className="w-full px-3 py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-gray-300">Enable region immediately</span>
            <Toggle enabled={form.enabled} onChange={v => set('enabled', v)} />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-800">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={handleAdd} className="flex-1">Add Country</Button>
        </div>
      </div>
    </div>
  );
}

export default function RegionalSettings() {
  const toast = useToast();
  const { isSuperAdmin } = useAuth();
  const [regions, setRegions] = useState([]);
  const [ageVerification, setAgeVerification] = useState({ enabled: true, minAge: 18 });
  const [saving, setSaving] = useState({});
  const [addModal, setAddModal] = useState(false);

  useEffect(() => { settingsService.getRegions().then(setRegions); }, []);

  const save = async (section, data) => {
    setSaving(s => ({ ...s, [section]: true }));
    await settingsService.save(section, data);
    setSaving(s => ({ ...s, [section]: false }));
    toast('Changes saved successfully', 'success');
  };

  const updateRegion = (code, field, val) =>
    setRegions(prev => prev.map(r => r.code === code ? { ...r, [field]: val } : r));

  const removeRegion = (code) =>
    setRegions(prev => prev.filter(r => r.code !== code));

  const addRegion = (country) => {
    setRegions(prev => [...prev, country]);
    toast(`${country.name} added successfully`, 'success');
  };

  return (
    <div className="space-y-6">
      <AddCountryModal isOpen={addModal} onClose={() => setAddModal(false)} onAdd={addRegion} />

      {/* Region Table */}
      <SectionCard
        title="Regional Configuration"
        description="Enable regions and configure compliance per country"
        onSave={() => save('regions', regions)}
        saving={saving.regions}
        action={isSuperAdmin && (
          <Button size="sm" variant="secondary" icon={<Plus size={13} />} onClick={() => setAddModal(true)}>
            Add Country
          </Button>
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="border-b border-gray-800 text-xs text-gray-400">
                <th className="text-left pb-3 font-semibold">Region</th>
                <th className="pb-3 font-semibold text-center">Enabled</th>
                <th className="pb-3 font-semibold text-center">KYC Level</th>
                <th className="pb-3 font-semibold text-center">Min Age</th>
                <th className="pb-3 font-semibold text-center">Tax Rate %</th>
                <th className="pb-3 font-semibold text-center">AML Threshold (₦)</th>
                {isSuperAdmin && <th className="pb-3 font-semibold text-center">Remove</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {regions.map(r => (
                <tr key={r.code}>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{r.flag}</span>
                      <div>
                        <p className="text-xs font-semibold text-gray-200">{r.name}</p>
                        <p className="text-[10px] text-gray-500">{r.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex justify-center">
                      <Toggle enabled={r.enabled} onChange={v => updateRegion(r.code, 'enabled', v)} />
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <select value={r.kyc} onChange={e => updateRegion(r.code, 'kyc', e.target.value)}
                      className="bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500">
                      {['None', 'Basic', 'Full'].map(k => <option key={k}>{k}</option>)}
                    </select>
                  </td>
                  <td className="py-3 text-center">
                    <input type="number" value={r.minAge} onChange={e => updateRegion(r.code, 'minAge', e.target.value)}
                      className="w-16 bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-1 focus:ring-violet-500" />
                  </td>
                  <td className="py-3 text-center">
                    <input type="number" value={r.taxRate} onChange={e => updateRegion(r.code, 'taxRate', e.target.value)}
                      className="w-16 bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-1 focus:ring-violet-500" />
                  </td>
                  <td className="py-3 text-center">
                    <input type="number" value={r.amlThreshold} onChange={e => updateRegion(r.code, 'amlThreshold', e.target.value)}
                      className="w-28 bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-1 focus:ring-violet-500" />
                  </td>
                  {isSuperAdmin && (
                    <td className="py-3 text-center">
                      <button onClick={() => removeRegion(r.code)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors mx-auto flex">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* KYC Level Legend */}
      <SectionCard title="KYC Level Reference">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { level: 'None', desc: 'No identity verification required. Suitable for low-risk, low-value markets.', color: 'text-gray-400 bg-gray-700' },
            { level: 'Basic', desc: 'Email + phone verification. BVN or equivalent national ID required.', color: 'text-amber-400 bg-amber-500/10' },
            { level: 'Full', desc: 'Government ID + liveness check + address proof. Required for high-value markets.', color: 'text-emerald-400 bg-emerald-500/10' },
          ].map(k => (
            <div key={k.level} className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg">
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2 ${k.color}`}>{k.level}</span>
              <p className="text-xs text-gray-400 leading-relaxed">{k.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Age Verification */}
      <SectionCard title="Age Verification" description="Global minimum age requirement across all regions" onSave={() => save('age_verification', ageVerification)} saving={saving.age_verification}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm text-gray-200">Require age verification at signup</p>
            <p className="text-xs text-gray-500 mt-0.5">Users must confirm their age before purchasing</p>
          </div>
          <Toggle enabled={ageVerification.enabled} onChange={v => setAgeVerification(a => ({ ...a, enabled: v }))} />
        </div>
        <div className="max-w-xs">
          <label className="block text-xs font-medium text-gray-400 mb-1">Minimum Age (years)</label>
          <input type="number" min={13} max={21} value={ageVerification.minAge}
            onChange={e => setAgeVerification(a => ({ ...a, minAge: e.target.value }))}
            disabled={!ageVerification.enabled}
            className="w-full px-3 py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-40" />
        </div>
      </SectionCard>
    </div>
  );
}

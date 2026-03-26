import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, X, Search, ChevronDown } from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import { useToast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';
import Toggle from '../../components/Toggle';
import Button from '../../components/Button';

const ALL_COUNTRIES = [
  { name: 'Nigeria', code: 'NG', flag: '🇳🇬' },
  { name: 'Ghana', code: 'GH', flag: '🇬🇭' },
  { name: 'Kenya', code: 'KE', flag: '🇰🇪' },
  { name: 'South Africa', code: 'ZA', flag: '🇿🇦' },
  { name: 'Egypt', code: 'EG', flag: '🇪🇬' },
  { name: 'Tanzania', code: 'TZ', flag: '🇹🇿' },
  { name: 'Uganda', code: 'UG', flag: '🇺🇬' },
  { name: 'Ethiopia', code: 'ET', flag: '🇪🇹' },
  { name: 'Senegal', code: 'SN', flag: '🇸🇳' },
  { name: 'Cameroon', code: 'CM', flag: '🇨🇲' },
  { name: 'Côte d\'Ivoire', code: 'CI', flag: '🇨🇮' },
  { name: 'Rwanda', code: 'RW', flag: '🇷🇼' },
  { name: 'Zambia', code: 'ZM', flag: '🇿🇲' },
  { name: 'Zimbabwe', code: 'ZW', flag: '🇿🇼' },
  { name: 'Mozambique', code: 'MZ', flag: '🇲🇿' },
  { name: 'United States', code: 'US', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
  { name: 'France', code: 'FR', flag: '🇫🇷' },
  { name: 'Netherlands', code: 'NL', flag: '🇳🇱' },
  { name: 'Spain', code: 'ES', flag: '🇪🇸' },
  { name: 'Italy', code: 'IT', flag: '🇮🇹' },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷' },
  { name: 'Mexico', code: 'MX', flag: '🇲🇽' },
  { name: 'Argentina', code: 'AR', flag: '🇦🇷' },
  { name: 'Colombia', code: 'CO', flag: '🇨🇴' },
  { name: 'India', code: 'IN', flag: '🇮🇳' },
  { name: 'Pakistan', code: 'PK', flag: '🇵🇰' },
  { name: 'Bangladesh', code: 'BD', flag: '🇧🇩' },
  { name: 'Indonesia', code: 'ID', flag: '🇮🇩' },
  { name: 'Malaysia', code: 'MY', flag: '🇲🇾' },
  { name: 'Philippines', code: 'PH', flag: '🇵🇭' },
  { name: 'Thailand', code: 'TH', flag: '🇹🇭' },
  { name: 'Vietnam', code: 'VN', flag: '🇻🇳' },
  { name: 'Singapore', code: 'SG', flag: '🇸🇬' },
  { name: 'UAE', code: 'AE', flag: '🇦🇪' },
  { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦' },
  { name: 'Turkey', code: 'TR', flag: '🇹🇷' },
  { name: 'China', code: 'CN', flag: '🇨🇳' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵' },
  { name: 'South Korea', code: 'KR', flag: '🇰🇷' },
];

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

const emptyForm = { selected: null, enabled: true, kyc: 'Basic', minAge: 18, taxRate: 0, amlThreshold: 500000 };

function CountryPicker({ value, onChange, exclude }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = ALL_COUNTRIES.filter(c =>
    !exclude.includes(c.code) &&
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => { setOpen(o => !o); setQuery(''); }}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700 text-left focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors">
        {value ? (
          <span className="flex items-center gap-2 text-gray-100">
            <span>{value.flag}</span><span>{value.name}</span>
            <span className="text-gray-500 text-xs">({value.code})</span>
          </span>
        ) : (
          <span className="text-gray-500">Select a country...</span>
        )}
        <ChevronDown size={14} style={{ color: '#6F6F6F' }} />
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="relative px-3 py-2 border-b border-gray-700">
            <Search size={13} className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: '#6F6F6F' }} />
            <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search countries..."
              className="w-full pl-7 pr-3 py-1.5 text-sm bg-transparent text-gray-100 placeholder-gray-500 focus:outline-none" />
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">No countries found</p>
            ) : filtered.map(c => (
              <button key={c.code} type="button"
                onClick={() => { onChange(c); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors text-left">
                <span>{c.flag}</span>
                <span>{c.name}</span>
                <span className="text-gray-500 text-xs ml-auto">{c.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AddCountryModal({ isOpen, onClose, onAdd, existingCodes }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => { if (isOpen) { setForm(emptyForm); setError(''); } }, [isOpen]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAdd = () => {
    if (!form.selected) { setError('Please select a country'); return; }
    onAdd({ ...form.selected, enabled: form.enabled, kyc: form.kyc, minAge: form.minAge, taxRate: form.taxRate, amlThreshold: form.amlThreshold });
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
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Country *</label>
            <CountryPicker value={form.selected} onChange={v => { set('selected', v); setError(''); }} exclude={existingCodes} />
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
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
      <AddCountryModal isOpen={addModal} onClose={() => setAddModal(false)} onAdd={addRegion} existingCodes={regions.map(r => r.code)} />

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

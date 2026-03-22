import { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import { useToast } from '../../components/Toast';
import Toggle from '../../components/Toggle';
import Button from '../../components/Button';

function SectionCard({ title, description, children, onSave, saving }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-start justify-between px-6 py-4 border-b border-gray-800">
        <div>
          <h3 className="text-sm font-semibold text-gray-100">{title}</h3>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
        {onSave && (
          <Button size="sm" onClick={onSave} loading={saving} variant="primary">Save Changes</Button>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function RegionalSettings() {
  const toast = useToast();
  const [regions, setRegions] = useState([]);
  const [ageVerification, setAgeVerification] = useState({ enabled: true, minAge: 18 });
  const [saving, setSaving] = useState({});

  useEffect(() => { settingsService.getRegions().then(setRegions); }, []);

  const save = async (section, data) => {
    setSaving(s => ({ ...s, [section]: true }));
    await settingsService.save(section, data);
    setSaving(s => ({ ...s, [section]: false }));
    toast('Changes saved successfully', 'success');
  };

  const updateRegion = (code, field, val) =>
    setRegions(prev => prev.map(r => r.code === code ? { ...r, [field]: val } : r));

  return (
    <div className="space-y-6">
      {/* Region Table */}
      <SectionCard title="Regional Configuration" description="Enable regions and configure compliance per country" onSave={() => save('regions', regions)} saving={saving.regions}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr className="border-b border-gray-800 text-xs text-gray-400">
                <th className="text-left pb-3 font-semibold">Region</th>
                <th className="pb-3 font-semibold text-center">Enabled</th>
                <th className="pb-3 font-semibold text-center">KYC Level</th>
                <th className="pb-3 font-semibold text-center">Min Age</th>
                <th className="pb-3 font-semibold text-center">Tax Rate %</th>
                <th className="pb-3 font-semibold text-center">AML Threshold (₦)</th>
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
                    <select
                      value={r.kyc}
                      onChange={e => updateRegion(r.code, 'kyc', e.target.value)}
                      className="bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    >
                      {['None', 'Basic', 'Full'].map(k => <option key={k}>{k}</option>)}
                    </select>
                  </td>
                  <td className="py-3 text-center">
                    <input
                      type="number"
                      value={r.minAge}
                      onChange={e => updateRegion(r.code, 'minAge', e.target.value)}
                      className="w-16 bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  </td>
                  <td className="py-3 text-center">
                    <input
                      type="number"
                      value={r.taxRate}
                      onChange={e => updateRegion(r.code, 'taxRate', e.target.value)}
                      className="w-16 bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  </td>
                  <td className="py-3 text-center">
                    <input
                      type="number"
                      value={r.amlThreshold}
                      onChange={e => updateRegion(r.code, 'amlThreshold', e.target.value)}
                      className="w-28 bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-1 focus:ring-violet-500"
                    />
                  </td>
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
          <input
            type="number"
            min={13}
            max={21}
            value={ageVerification.minAge}
            onChange={e => setAgeVerification(a => ({ ...a, minAge: e.target.value }))}
            disabled={!ageVerification.enabled}
            className="w-full px-3 py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-40"
          />
        </div>
      </SectionCard>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
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

function FieldInput({ label, value, onChange, prefix, suffix, type = 'number' }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
      <div className="relative flex items-center">
        {prefix && <span className="absolute left-3 text-xs text-gray-500 select-none">{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`w-full py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors ${prefix ? 'pl-8 pr-3' : suffix ? 'pl-3 pr-8' : 'px-3'}`}
        />
        {suffix && <span className="absolute right-3 text-xs text-gray-500 select-none">{suffix}</span>}
      </div>
    </div>
  );
}

export default function PaymentSettings() {
  const toast = useToast();
  const [methods, setMethods] = useState([]);
  const [limits, setLimits] = useState({});
  const [fees, setFees] = useState([]);
  const [fraudRules, setFraudRules] = useState([]);
  const [payout, setPayout] = useState({ frequency: 'Weekly', threshold: 50000, dayOfWeek: 'Monday' });
  const [saving, setSaving] = useState({});

  useEffect(() => {
    settingsService.getPaymentMethods().then(setMethods);
    settingsService.getTransactionLimits().then(setLimits);
    settingsService.getFeeStructure().then(setFees);
    settingsService.getFraudRules().then(setFraudRules);
    settingsService.getPayoutConfig().then(setPayout);
  }, []);

  const save = async (section, data) => {
    setSaving(s => ({ ...s, [section]: true }));
    await settingsService.save(section, data);
    setSaving(s => ({ ...s, [section]: false }));
    toast('Changes saved successfully', 'success');
  };

  const toggleMethod = (id) => setMethods(prev => prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));

  const updateLimit = (method, field, val) => setLimits(prev => ({ ...prev, [method]: { ...prev[method], [field]: val } }));

  const updateFee = (id, field, val) => setFees(prev => prev.map(f => f.id === id ? { ...f, [field]: val } : f));

  const updateFraudRule = (id, field, val) => setFraudRules(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r));

  const removeFraudRule = (id) => { setFraudRules(prev => prev.filter(r => r.id !== id)); toast('Rule removed', 'success'); };

  const addFraudRule = () => setFraudRules(prev => [...prev, { id: Date.now(), condition: 'New condition', operator: '>', threshold: 0, action: 'Flag for review' }]);

  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <SectionCard title="Payment Methods" description="Enable or disable payment channels" onSave={() => save('payment_methods', methods)} saving={saving.payment_methods}>
        <div className="space-y-3">
          {methods.map(m => (
            <div key={m.id} className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-200">{m.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{m.description}</p>
              </div>
              <Toggle enabled={m.enabled} onChange={() => toggleMethod(m.id)} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Transaction Limits */}
      <SectionCard title="Transaction Limits" description="Set min/max amounts and daily caps per payment type" onSave={() => save('tx_limits', limits)} saving={saving.tx_limits}>
        <div className="space-y-6">
          {Object.entries(limits).map(([method, vals]) => (
            <div key={method}>
              <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3 capitalize">{method.replace('_', ' ')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FieldInput label="Minimum (₦)" value={vals.min} onChange={v => updateLimit(method, 'min', v)} />
                <FieldInput label="Maximum (₦)" value={vals.max} onChange={v => updateLimit(method, 'max', v)} />
                <FieldInput label="Daily Cap (₦)" value={vals.dailyCap} onChange={v => updateLimit(method, 'dailyCap', v)} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Fee Structure */}
      <SectionCard title="Fee Structure" description="Platform fee per payment method" onSave={() => save('fees', fees)} saving={saving.fees}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="border-b border-gray-800 text-xs text-gray-400">
                <th className="text-left pb-3 font-semibold">Method</th>
                <th className="text-left pb-3 font-semibold">Type</th>
                <th className="text-left pb-3 font-semibold">Value</th>
                <th className="text-left pb-3 font-semibold">Cap (₦)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {fees.map(fee => (
                <tr key={fee.id}>
                  <td className="py-3 text-sm font-medium text-gray-200">{fee.method}</td>
                  <td className="py-3">
                    <select value={fee.type} onChange={e => updateFee(fee.id, 'type', e.target.value)}
                      className="bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500">
                      <option>Percentage</option>
                      <option>Flat</option>
                    </select>
                  </td>
                  <td className="py-3">
                    <input type="number" value={fee.value} onChange={e => updateFee(fee.id, 'value', e.target.value)}
                      className="w-20 bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500" />
                    <span className="text-xs text-gray-500 ml-1">{fee.type === 'Percentage' ? '%' : '₦'}</span>
                  </td>
                  <td className="py-3">
                    <input type="number" value={fee.cap ?? ''} placeholder="—" onChange={e => updateFee(fee.id, 'cap', e.target.value || null)}
                      className="w-24 bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Payout Schedule */}
      <SectionCard title="Payout Schedule" description="Configure automatic payout settings" onSave={() => save('payout', payout)} saving={saving.payout}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Frequency</label>
            <select value={payout.frequency} onChange={e => setPayout(p => ({ ...p, frequency: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500">
              {['Daily', 'Weekly', 'Bi-weekly', 'Monthly'].map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Day of Week</label>
            <select value={payout.dayOfWeek} onChange={e => setPayout(p => ({ ...p, dayOfWeek: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <FieldInput label="Minimum Threshold (₦)" value={payout.threshold} onChange={v => setPayout(p => ({ ...p, threshold: v }))} />
        </div>
      </SectionCard>

      {/* Fraud Rules */}
      <SectionCard title="Fraud Detection Rules" description="Automated conditions to flag or block suspicious activity" onSave={() => save('fraud_rules', fraudRules)} saving={saving.fraud_rules}>
        <div className="space-y-3 mb-4">
          {fraudRules.map(rule => (
            <div key={rule.id} className="flex items-center gap-3 p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg flex-wrap">
              <AlertTriangle size={13} className="text-amber-400 shrink-0" />
              <input value={rule.condition} onChange={e => updateFraudRule(rule.id, 'condition', e.target.value)}
                className="flex-1 min-w-[140px] bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500" />
              <select value={rule.operator} onChange={e => updateFraudRule(rule.id, 'operator', e.target.value)}
                className="bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500">
                {['>', '>=', '<', '<=', '=='].map(op => <option key={op}>{op}</option>)}
              </select>
              <input type="number" value={rule.threshold} onChange={e => updateFraudRule(rule.id, 'threshold', e.target.value)}
                className="w-24 bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500" />
              <select value={rule.action} onChange={e => updateFraudRule(rule.id, 'action', e.target.value)}
                className="flex-1 min-w-[140px] bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500">
                {['Flag for review', 'Block IP temporarily', 'Require verification', 'Rate limit user', 'Block transaction'].map(a => <option key={a}>{a}</option>)}
              </select>
              <button onClick={() => removeFraudRule(rule.id)} className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
        <Button size="sm" variant="secondary" icon={<Plus size={13} />} onClick={addFraudRule}>Add Rule</Button>
      </SectionCard>
    </div>
  );
}

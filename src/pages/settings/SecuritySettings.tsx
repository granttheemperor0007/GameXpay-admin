import { useState, useEffect } from 'react';
import { Plus, Trash2, Eye, EyeOff, Copy, RefreshCw } from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import { useToast } from '../../components/Toast';
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

function IPList({ title, items, onRemove, onAdd, color = 'emerald' }) {
  const [newIP, setNewIP] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const handleAdd = () => {
    if (!newIP.trim()) return;
    onAdd({ id: Date.now(), ip: newIP.trim(), label: newLabel.trim() || 'Unlabelled', added: new Date().toISOString().split('T')[0] });
    setNewIP(''); setNewLabel('');
  };

  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</p>
      <div className="space-y-2 mb-3">
        {items.map(item => (
          <div key={item.id} className={`flex items-center justify-between p-3 bg-gray-800/50 border ${color === 'emerald' ? 'border-emerald-500/10' : 'border-red-500/10'} rounded-lg`}>
            <div>
              <p className="text-xs font-mono text-gray-200">{item.ip}</p>
              <p className="text-[10px] text-gray-500">{item.label} · Added {item.added}</p>
            </div>
            <button onClick={() => onRemove(item.id)} className="text-gray-600 hover:text-red-400 transition-colors">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-gray-600 italic py-2">No entries</p>}
      </div>
      <div className="flex gap-2">
        <input value={newIP} onChange={e => setNewIP(e.target.value)} placeholder="IP address or CIDR" onKeyDown={e => e.key === 'Enter' && handleAdd()}
          className="flex-1 px-3 py-2 rounded-lg text-xs bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-500 font-mono" />
        <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Label (optional)"
          className="flex-1 px-3 py-2 rounded-lg text-xs bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-violet-500" />
        <Button size="sm" variant="secondary" icon={<Plus size={13} />} onClick={handleAdd}>Add</Button>
      </div>
    </div>
  );
}

export default function SecuritySettings() {
  const toast = useToast();
  const [whitelist, setWhitelist] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [config, setConfig] = useState({ maxLoginAttempts: 5, lockoutDuration: 30, dataRetentionDays: 365, sessionTimeout: 60 });
  const [showKey, setShowKey] = useState({});
  const [saving, setSaving] = useState({});

  useEffect(() => {
    settingsService.getIPWhitelist().then(setWhitelist);
    settingsService.getIPBlacklist().then(setBlacklist);
    settingsService.getApiKeys().then(setApiKeys);
    settingsService.getSecurityConfig().then(setConfig);
  }, []);

  const save = async (section, data) => {
    setSaving(s => ({ ...s, [section]: true }));
    await settingsService.save(section, data);
    setSaving(s => ({ ...s, [section]: false }));
    toast('Changes saved successfully', 'success');
  };

  const copyKey = (key) => {
    navigator.clipboard.writeText(key);
    toast('API key copied to clipboard', 'success');
  };

  const revokeKey = (id) => { setApiKeys(prev => prev.map(k => k.id === id ? { ...k, active: false } : k)); toast('API key revoked', 'success'); };

  const generateKey = () => {
    const newKey = { id: Date.now(), name: 'New API Key', key: 'gxp_live_' + Math.random().toString(36).substr(2, 32), scope: 'Read Only', created: new Date().toISOString().split('T')[0], lastUsed: '—', active: true };
    setApiKeys(prev => [...prev, newKey]);
    toast('New API key generated', 'success');
  };

  const maskKey = (key) => key.slice(0, 12) + '•'.repeat(20) + key.slice(-4);

  return (
    <div className="space-y-6">
      {/* IP Management */}
      <SectionCard title="IP Access Control" description="Whitelist trusted IPs and blacklist malicious ones" onSave={() => save('ip_lists', { whitelist, blacklist })} saving={saving.ip_lists}>
        <div className="space-y-6">
          <IPList
            title="Whitelist — Always Allow"
            items={whitelist}
            onRemove={id => setWhitelist(prev => prev.filter(x => x.id !== id))}
            onAdd={entry => setWhitelist(prev => [...prev, { ...entry, type: 'whitelist' }])}
            color="emerald"
          />
          <div className="border-t border-gray-800" />
          <IPList
            title="Blacklist — Always Block"
            items={blacklist}
            onRemove={id => setBlacklist(prev => prev.filter(x => x.id !== id))}
            onAdd={entry => setBlacklist(prev => [...prev, { ...entry, type: 'blacklist' }])}
            color="red"
          />
        </div>
      </SectionCard>

      {/* API Keys */}
      <SectionCard title="API Key Manager" description="Generate and manage platform API keys">
        <div className="space-y-3 mb-4">
          {apiKeys.map(key => (
            <div key={key.id} className={`p-4 bg-gray-800/50 border rounded-lg ${key.active ? 'border-gray-700/50' : 'border-gray-800 opacity-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-gray-200">{key.name}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${key.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-700 text-gray-500'}`}>
                    {key.active ? 'Active' : 'Revoked'}
                  </span>
                  <span className="text-[10px] bg-violet-600/15 text-violet-400 px-1.5 py-0.5 rounded-full">{key.scope}</span>
                </div>
                {key.active && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => copyKey(key.key)} className="text-gray-500 hover:text-gray-300 transition-colors"><Copy size={13} /></button>
                    <button onClick={() => setShowKey(s => ({ ...s, [key.id]: !s[key.id] }))} className="text-gray-500 hover:text-gray-300 transition-colors">
                      {showKey[key.id] ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button onClick={() => revokeKey(key.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Revoke</button>
                  </div>
                )}
              </div>
              <p className="text-[11px] font-mono text-gray-500 break-all">
                {showKey[key.id] ? key.key : maskKey(key.key)}
              </p>
              <p className="text-[10px] text-gray-600 mt-1.5">Created {key.created} · Last used {key.lastUsed}</p>
            </div>
          ))}
        </div>
        <Button size="sm" variant="secondary" icon={<RefreshCw size={13} />} onClick={generateKey}>Generate New Key</Button>
      </SectionCard>

      {/* Login Security */}
      <SectionCard title="Login & Session Security" description="Configure brute-force protection and session behaviour" onSave={() => save('security_config', config)} saving={saving.security_config}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'maxLoginAttempts', label: 'Max Login Attempts', suffix: 'attempts' },
            { key: 'lockoutDuration', label: 'Lockout Duration', suffix: 'minutes' },
            { key: 'sessionTimeout', label: 'Session Timeout', suffix: 'minutes' },
            { key: 'dataRetentionDays', label: 'GDPR Data Retention', suffix: 'days' },
          ].map(({ key, label, suffix }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  value={config[key]}
                  onChange={e => setConfig(c => ({ ...c, [key]: e.target.value }))}
                  className="w-full px-3 py-2.5 pr-20 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <span className="absolute right-3 text-xs text-gray-500 select-none">{suffix}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

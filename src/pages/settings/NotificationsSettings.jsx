import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
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

export default function NotificationsSettings() {
  const toast = useToast();
  const [channels, setChannels] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [recipients, setRecipients] = useState(['superadmin@gamexpay.com', 'admin@gamexpay.com']);
  const [newRecipient, setNewRecipient] = useState('');
  const [saving, setSaving] = useState({});

  useEffect(() => {
    settingsService.getNotificationChannels().then(setChannels);
    settingsService.getAlertTriggers().then(setAlerts);
    settingsService.getWebhooks().then(setWebhooks);
  }, []);

  const save = async (section, data) => {
    setSaving(s => ({ ...s, [section]: true }));
    await settingsService.save(section, data);
    setSaving(s => ({ ...s, [section]: false }));
    toast('Changes saved successfully', 'success');
  };

  const addRecipient = () => {
    if (!newRecipient.trim() || !newRecipient.includes('@')) return;
    setRecipients(prev => [...prev, newRecipient.trim()]);
    setNewRecipient('');
  };

  const updateWebhook = (id, field, val) => setWebhooks(prev => prev.map(w => w.id === id ? { ...w, [field]: val } : w));

  const updateAlert = (id, field, val) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, [field]: val } : a));

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <SectionCard title="Notification Channels" description="Choose which channels to use for alerts and updates" onSave={() => save('channels', channels)} saving={saving.channels}>
        <div className="space-y-3">
          {channels.map(c => (
            <div key={c.id} className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg">
              <div>
                <p className="text-sm font-semibold text-gray-200">{c.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{c.description}</p>
              </div>
              <Toggle enabled={c.enabled} onChange={v => setChannels(prev => prev.map(ch => ch.id === c.id ? { ...ch, enabled: v } : ch))} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Alert Triggers */}
      <SectionCard title="Alert Triggers" description="Configure which events trigger notifications and at what threshold" onSave={() => save('alerts', alerts)} saving={saving.alerts}>
        <div className="space-y-3">
          {alerts.map(a => (
            <div key={a.id} className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-200">{a.event}</p>
                <Toggle enabled={a.enabled} onChange={v => updateAlert(a.id, 'enabled', v)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Channel</label>
                  <select value={a.channel} onChange={e => updateAlert(a.id, 'channel', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500">
                    {['Email', 'SMS', 'Push', 'Email + SMS', 'All Channels'].map(ch => <option key={ch}>{ch}</option>)}
                  </select>
                </div>
                {a.threshold !== null && (
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-1">Threshold (₦ or count)</label>
                    <input type="number" value={a.threshold} onChange={e => updateAlert(a.id, 'threshold', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Notification Recipients */}
      <SectionCard title="Notification Recipients" description="Email addresses that receive admin alerts" onSave={() => save('recipients', recipients)} saving={saving.recipients}>
        <div className="space-y-2 mb-4">
          {recipients.map((r, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg">
              <span className="text-xs text-gray-300 font-mono">{r}</span>
              <button onClick={() => setRecipients(prev => prev.filter((_, idx) => idx !== i))} className="text-gray-600 hover:text-red-400 transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="email"
            value={newRecipient}
            onChange={e => setNewRecipient(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addRecipient()}
            placeholder="Add email address..."
            className="flex-1 px-3 py-2 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <Button size="sm" variant="secondary" icon={<Plus size={13} />} onClick={addRecipient}>Add</Button>
        </div>
      </SectionCard>
    </div>
  );
}

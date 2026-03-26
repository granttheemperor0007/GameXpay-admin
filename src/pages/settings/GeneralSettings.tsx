import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
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

export default function GeneralSettings() {
  const toast = useToast();
  const [config, setConfig] = useState({ platformName: 'GameXPay', supportEmail: '', timezone: 'Africa/Lagos', language: 'en', maintenanceMode: false, maintenanceMessage: '', smtpHost: '', smtpPort: 587, smtpUser: '', smtpPassword: '', smtpFrom: '' });
  const [flags, setFlags] = useState([]);
  const [showSmtp, setShowSmtp] = useState(false);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    settingsService.getGeneralConfig().then(setConfig);
    settingsService.getFeatureFlags().then(setFlags);
  }, []);

  const save = async (section, data) => {
    setSaving(s => ({ ...s, [section]: true }));
    await settingsService.save(section, data);
    setSaving(s => ({ ...s, [section]: false }));
    toast('Changes saved successfully', 'success');
  };

  const set = (field, val) => setConfig(c => ({ ...c, [field]: val }));

  const toggleFlag = (id) => setFlags(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));

  return (
    <div className="space-y-6">
      {/* Platform Info */}
      <SectionCard title="Platform Settings" description="Core platform identity and configuration" onSave={() => save('general', config)} saving={saving.general}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Platform Name</label>
            <input value={config.platformName} onChange={e => set('platformName', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Support Email</label>
            <input type="email" value={config.supportEmail} onChange={e => set('supportEmail', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Timezone</label>
            <select value={config.timezone} onChange={e => set('timezone', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500">
              {['Africa/Lagos', 'Africa/Accra', 'Africa/Nairobi', 'Africa/Johannesburg', 'UTC', 'Europe/London', 'America/New_York'].map(tz => <option key={tz}>{tz}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Language</label>
            <select value={config.language} onChange={e => set('language', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500">
              {[['en', 'English'], ['fr', 'French'], ['ha', 'Hausa'], ['yo', 'Yoruba'], ['ig', 'Igbo']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-400 mb-1">Platform Logo</label>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
              <img src="/GameXpay.svg" alt="logo" className="h-8 w-auto" />
            </div>
            <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors border border-violet-500/30 px-3 py-1.5 rounded-lg hover:bg-violet-500/10">Upload new logo</button>
          </div>
        </div>
      </SectionCard>

      {/* Maintenance Mode */}
      <SectionCard title="Maintenance Mode" description="Take the platform offline for scheduled maintenance">
        <div className={`p-4 rounded-lg border ${config.maintenanceMode ? 'bg-amber-500/5 border-amber-500/20' : 'bg-gray-800/50 border-gray-700/50'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={15} className={config.maintenanceMode ? 'text-amber-400' : 'text-gray-500'} />
              <div>
                <p className="text-sm font-semibold text-gray-200">Maintenance Mode</p>
                <p className="text-xs text-gray-500">All users will see the maintenance page</p>
              </div>
            </div>
            <Toggle enabled={config.maintenanceMode} onChange={v => set('maintenanceMode', v)} />
          </div>
          {config.maintenanceMode && (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Maintenance Message</label>
              <textarea
                value={config.maintenanceMessage}
                onChange={e => set('maintenanceMessage', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
              <Button size="sm" variant="primary" className="mt-3 bg-amber-600 hover:bg-amber-500" onClick={() => save('maintenance', config)}>Enable Maintenance Mode</Button>
            </div>
          )}
        </div>
      </SectionCard>

      {/* SMTP Config */}
      <SectionCard title="SMTP Configuration" description="Email delivery settings for transactional emails" onSave={() => save('smtp', config)} saving={saving.smtp}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-400 mb-1">SMTP Host</label>
            <input value={config.smtpHost} onChange={e => set('smtpHost', e.target.value)} placeholder="smtp.resend.com"
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Port</label>
            <input type="number" value={config.smtpPort} onChange={e => set('smtpPort', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">From Address</label>
            <input type="email" value={config.smtpFrom} onChange={e => set('smtpFrom', e.target.value)} placeholder="noreply@gamexpay.com"
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Username</label>
            <input value={config.smtpUser} onChange={e => set('smtpUser', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Password</label>
            <input type={showSmtp ? 'text' : 'password'} value={config.smtpPassword} onChange={e => set('smtpPassword', e.target.value)} placeholder="••••••••••"
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
        </div>
        <button onClick={() => setShowSmtp(v => !v)} className="mt-2 text-xs text-violet-400 hover:text-violet-300 transition-colors">
          {showSmtp ? 'Hide' : 'Show'} password
        </button>
      </SectionCard>

      {/* Feature Flags */}
      <SectionCard title="Feature Flags" description="Toggle platform features on or off without deployment" onSave={() => save('feature_flags', flags)} saving={saving.feature_flags}>
        <div className="space-y-2">
          {flags.map(f => (
            <div key={f.id} className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-200">{f.feature}</p>
                  <code className="text-[10px] bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded font-mono">{f.key}</code>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{f.description}</p>
              </div>
              <Toggle enabled={f.enabled} onChange={() => toggleFlag(f.id)} />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

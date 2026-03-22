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

export default function IntegrationsSettings() {
  const toast = useToast();
  const [analytics, setAnalytics] = useState([]);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    settingsService.getAnalyticsIntegrations().then(setAnalytics);
  }, []);

  const save = async (section, data) => {
    setSaving(s => ({ ...s, [section]: true }));
    await settingsService.save(section, data);
    setSaving(s => ({ ...s, [section]: false }));
    toast('Changes saved successfully', 'success');
  };

  const updateAnalytics = (id, field, val) =>
    setAnalytics(prev => prev.map(a => a.id === id ? { ...a, [field]: val } : a));

  const fieldLabel = (key) => {
    const map = { trackingId: 'Tracking ID', token: 'Token', writeKey: 'Write Key' };
    return map[key] ?? key;
  };

  return (
    <div className="space-y-6">
      {/* Analytics */}
      <SectionCard title="Analytics Integrations" description="Connect analytics platforms for usage insights" onSave={() => save('analytics', analytics)} saving={saving.analytics}>
        <div className="space-y-4">
          {analytics.map(a => (
            <div key={a.id} className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-200">{a.name}</p>
                <Toggle enabled={a.enabled} onChange={v => updateAnalytics(a.id, 'enabled', v)} />
              </div>
              {Object.entries(a).filter(([k]) => !['id', 'name', 'enabled'].includes(k)).map(([field, val]) => (
                <div key={field}>
                  <label className="block text-[10px] text-gray-500 mb-1">{fieldLabel(field)}</label>
                  <input
                    value={val}
                    onChange={e => updateAnalytics(a.id, field, e.target.value)}
                    placeholder={`Enter ${fieldLabel(field).toLowerCase()}...`}
                    className="w-full px-3 py-2 rounded-lg text-xs bg-gray-800 border border-gray-700 text-gray-100 font-mono placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

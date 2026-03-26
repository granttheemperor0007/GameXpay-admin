import { useState, useEffect } from 'react';
import { Plus, Trash2, Download } from 'lucide-react';
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

export default function ReportingSettings() {
  const toast = useToast();
  const [reports, setReports] = useState([]);
  const [config, setConfig] = useState({ defaultDateRange: '30d', dataRetention: '365', timezone: 'Africa/Lagos', defaultFormat: 'PDF' });
  const [saving, setSaving] = useState({});

  useEffect(() => {
    settingsService.getScheduledReports().then(setReports);
    settingsService.getReportingConfig().then(setConfig);
  }, []);

  const save = async (section, data) => {
    setSaving(s => ({ ...s, [section]: true }));
    await settingsService.save(section, data);
    setSaving(s => ({ ...s, [section]: false }));
    toast('Changes saved successfully', 'success');
  };

  const updateReport = (id, field, val) => setReports(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r));
  const removeReport = (id) => { setReports(prev => prev.filter(r => r.id !== id)); toast('Scheduled report removed', 'success'); };

  const addReport = () => setReports(prev => [...prev, {
    id: Date.now(), name: 'New Report', frequency: 'Weekly', format: 'PDF',
    recipient: 'superadmin@gamexpay.com', enabled: true, nextRun: '—'
  }]);

  return (
    <div className="space-y-6">
      {/* Default Config */}
      <SectionCard title="Reporting Defaults" description="Default settings applied to all reports and exports" onSave={() => save('reporting_config', config)} saving={saving.reporting_config}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Default Date Range</label>
            <select value={config.defaultDateRange} onChange={e => setConfig(c => ({ ...c, defaultDateRange: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500">
              {[['7d', 'Last 7 days'], ['30d', 'Last 30 days'], ['90d', 'Last 90 days'], ['365d', 'Last 12 months']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Default Export Format</label>
            <select value={config.defaultFormat} onChange={e => setConfig(c => ({ ...c, defaultFormat: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500">
              {['PDF', 'CSV', 'Excel'].map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Data Retention Period</label>
            <select value={config.dataRetention} onChange={e => setConfig(c => ({ ...c, dataRetention: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500">
              {[['90', '90 days'], ['180', '6 months'], ['365', '1 year'], ['730', '2 years'], ['never', 'Indefinitely']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Reporting Timezone</label>
            <select value={config.timezone} onChange={e => setConfig(c => ({ ...c, timezone: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500">
              {['Africa/Lagos', 'Africa/Accra', 'Africa/Nairobi', 'UTC', 'Europe/London'].map(tz => <option key={tz}>{tz}</option>)}
            </select>
          </div>
        </div>
      </SectionCard>

      {/* Scheduled Exports */}
      <SectionCard title="Scheduled Exports" description="Automatically generate and email reports on a schedule" onSave={() => save('scheduled_reports', reports)} saving={saving.scheduled_reports}>
        <div className="space-y-3 mb-4">
          {reports.map(r => (
            <div key={r.id} className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <input
                  value={r.name}
                  onChange={e => updateReport(r.id, 'name', e.target.value)}
                  className="text-sm font-semibold text-gray-200 bg-transparent border-b border-transparent hover:border-gray-700 focus:border-violet-500 focus:outline-none pb-0.5 transition-colors flex-1 mr-3"
                />
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${r.enabled ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-700 text-gray-500'}`}>
                    {r.enabled ? 'Active' : 'Paused'}
                  </span>
                  <Toggle enabled={r.enabled} onChange={v => updateReport(r.id, 'enabled', v)} />
                  <button onClick={() => removeReport(r.id)} className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Frequency</label>
                  <select value={r.frequency} onChange={e => updateReport(r.id, 'frequency', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500">
                    {['Daily', 'Weekly', 'Bi-weekly', 'Monthly'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Format</label>
                  <select value={r.format} onChange={e => updateReport(r.id, 'format', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500">
                    {['PDF', 'CSV', 'Excel'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-gray-500 mb-1">Recipient Email</label>
                  <input value={r.recipient} onChange={e => updateReport(r.id, 'recipient', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500" />
                </div>
              </div>
              <p className="text-[10px] text-gray-600 mt-2 flex items-center gap-1">
                <Download size={10} /> Next run: {r.nextRun}
              </p>
            </div>
          ))}
        </div>
        <Button size="sm" variant="secondary" icon={<Plus size={13} />} onClick={addReport}>Add Scheduled Report</Button>
      </SectionCard>
    </div>
  );
}

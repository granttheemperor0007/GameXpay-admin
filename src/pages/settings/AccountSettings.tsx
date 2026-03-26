import { useState, useEffect, type ReactNode, type ChangeEvent } from 'react';
import { User, Shield, Monitor, FileText, Check } from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import { useToast } from '../../components/Toast';
import { useAuth } from '../../context/AuthContext';
import Toggle from '../../components/Toggle';
import Button from '../../components/Button';

const PERMISSIONS = ['dashboard', 'games', 'orders', 'transactions', 'settings', 'users'];

interface SectionCardProps {
  title: string
  description?: string
  children: ReactNode
  onSave?: () => void
  saving?: boolean
}

function SectionCard({ title, description, children, onSave, saving }: SectionCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-start justify-between px-6 py-4 border-b border-gray-800">
        <div>
          <h3 className="text-sm font-semibold text-gray-100">{title}</h3>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
        {onSave && (
          <Button size="sm" onClick={onSave} loading={saving} variant="primary">
            Save Changes
          </Button>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function AccountSettings() {
  const toast = useToast();
  const { updateUser } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>({ name: 'Grant Bryan', email: 'superadmin@gamexpay.com', phone: '+234 801 234 5678' });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [roles, setRoles] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sessions, setSessions] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditFilter, setAuditFilter] = useState('');
  const [twoFA, setTwoFA] = useState(false);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    settingsService.getRoles().then(setRoles);
    settingsService.getSessions().then(setSessions);
    settingsService.getAuditLogs().then(setAuditLogs);
  }, []);

  const save = async (section: string) => {
    setSaving(s => ({ ...s, [section]: true }));
    await settingsService.save(section, profile);
    setSaving(s => ({ ...s, [section]: false }));
    if (section === 'profile') updateUser({ avatar: profile.avatar, name: profile.name });
    toast?.('Changes saved successfully', 'success');
  };

  const revokeSession = (id: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setSessions(s => s.filter((x: any) => x.id !== id));
    toast?.('Session revoked', 'success');
  };

  const togglePermission = (roleId: number, perm: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setRoles(prev => prev.map((r: any) =>
      r.id === roleId ? { ...r, permissions: { ...r.permissions, [perm]: !r.permissions[perm] } } : r
    ));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filteredLogs = auditFilter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? auditLogs.filter((l: any) => l.category === auditFilter || l.action.toLowerCase().includes(auditFilter.toLowerCase()))
    : auditLogs;

  return (
    <div className="space-y-6">
      {/* Profile */}
      <SectionCard title="Admin Profile" description="Update your display name and contact info" onSave={() => save('profile')} saving={saving.profile}>
        <div className="flex items-center gap-5 mb-6">
          <label className="cursor-pointer group">
            <input type="file" accept="image/*" className="sr-only" onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) setProfile((p: typeof profile) => ({ ...p, avatar: URL.createObjectURL(file) }));
            }} />
            <div className="w-16 h-16 rounded-xl bg-violet-600/20 border border-violet-500/20 overflow-hidden flex items-center justify-center shrink-0 group-hover:border-violet-400 transition-colors">
              {profile.avatar
                ? <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                : <span className="text-2xl font-bold text-violet-400">{profile.name[0]}</span>
              }
            </div>
          </label>
          <div>
            <p className="text-sm font-medium text-gray-200">{profile.name}</p>
            <p className="text-xs text-gray-500">{profile.email}</p>
            <label className="cursor-pointer">
              <input type="file" accept="image/*" className="sr-only" onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) { const url = URL.createObjectURL(file); setProfile((p: typeof profile) => ({ ...p, avatar: url })); }
              }} />
              <span className="text-xs text-violet-400 hover:text-violet-300 mt-1 transition-colors inline-block">Upload avatar</span>
            </label>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[['Full Name', 'name'], ['Email Address', 'email'], ['Phone Number', 'phone']].map(([label, key]) => (
            <div key={key} className={key === 'phone' ? 'sm:col-span-2 sm:max-w-xs' : ''}>
              <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
              <input
                value={profile[key]}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setProfile((p: typeof profile) => ({ ...p, [key]: e.target.value }))}
                className="w-full px-3 py-3 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
              />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 2FA */}
      <SectionCard title="Two-Factor Authentication" description="Add an extra layer of security to your account">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-200">Authenticator App (TOTP)</p>
            <p className="text-xs text-gray-500 mt-0.5">Use Google Authenticator or Authy</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${twoFA ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-700 text-gray-400'}`}>
              {twoFA ? 'Enabled' : 'Disabled'}
            </span>
            <Toggle enabled={twoFA} onChange={setTwoFA} />
          </div>
        </div>
        {twoFA && (
          <div className="mt-4 p-4 bg-violet-600/10 border border-violet-500/20 rounded-lg">
            <p className="text-xs text-violet-300">Scan the QR code in your authenticator app to complete 2FA setup.</p>
            <div className="mt-3 w-28 h-28 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
              <p className="text-[10px] text-gray-500 text-center">QR Code<br/>Placeholder</p>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Roles & Permissions */}
      <SectionCard title="Role Management" description="Configure access permissions per role" onSave={() => save('roles')} saving={saving.roles}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[580px]">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left pb-3 text-xs font-semibold text-gray-400 w-32">Role</th>
                {PERMISSIONS.map(p => (
                  <th key={p} className="pb-3 text-xs font-semibold text-gray-400 capitalize text-center">{p}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {roles.map((role: any) => (
                <tr key={role.id}>
                  <td className="py-3 pr-4">
                    <p className="text-xs font-semibold text-gray-200">{role.name}</p>
                    <p className="text-[10px] text-gray-500">{role.members} member{role.members !== 1 ? 's' : ''}</p>
                  </td>
                  {PERMISSIONS.map(perm => (
                    <td key={perm} className="py-3 text-center">
                      <div className="flex justify-center">
                        {role.name === 'Super Admin' ? (
                          <Check size={14} className="text-violet-400" />
                        ) : (
                          <Toggle
                            enabled={role.permissions[perm]}
                            onChange={() => togglePermission(role.id, perm)}
                          />
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Active Sessions */}
      <SectionCard title="Active Sessions" description="Devices currently signed in to your account">
        <div className="space-y-3">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {sessions.map((session: any) => (
            <div key={session.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="flex items-center gap-3">
                <Monitor size={15} className="text-gray-400 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-gray-200 flex items-center gap-2">
                    {session.device}
                    {session.current && (
                      <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded-full font-medium">Current</span>
                    )}
                  </p>
                  <p className="text-[10px] text-gray-500">{session.ip} · {session.location} · {session.lastActive}</p>
                </div>
              </div>
              {!session.current && (
                <button onClick={() => revokeSession(session.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Audit Log */}
      <SectionCard title="Audit Log" description="All admin actions are recorded here">
        <div className="mb-4 flex gap-2 flex-wrap">
          {['', 'Auth', 'Games', 'Orders', 'Settings', 'Security'].map(cat => (
            <button
              key={cat}
              onClick={() => setAuditFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${auditFilter === cat ? 'bg-violet-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'}`}
            >
              {cat || 'All'}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {filteredLogs.map((log: any) => (
            <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/40 transition-colors">
              <FileText size={13} className="text-gray-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-200 truncate">{log.action}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{log.user} · {log.ip}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">{log.category}</span>
                <p className="text-[10px] text-gray-600 mt-1">{log.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

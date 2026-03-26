import { useState, type ComponentType } from 'react';
import {
  User, CreditCard, Gamepad2, Globe, Bell, Shield,
  Puzzle, BarChart2, Settings as SettingsIcon, ChevronRight, type LucideIcon
} from 'lucide-react';
import AccountSettings from './settings/AccountSettings';
import PaymentSettings from './settings/PaymentSettings';
import GameSettings from './settings/GameSettings';
import RegionalSettings from './settings/RegionalSettings';
import NotificationsSettings from './settings/NotificationsSettings';
import SecuritySettings from './settings/SecuritySettings';
import IntegrationsSettings from './settings/IntegrationsSettings';
import ReportingSettings from './settings/ReportingSettings';
import GeneralSettings from './settings/GeneralSettings';

interface Section {
  id: string
  label: string
  icon: LucideIcon
  component: ComponentType
}

const sections: Section[] = [
  { id: 'account',       label: 'Account & Admin',          icon: User,          component: AccountSettings },
  { id: 'payment',       label: 'Payment & Transactions',   icon: CreditCard,    component: PaymentSettings },
  { id: 'games',         label: 'Game & Platform',          icon: Gamepad2,      component: GameSettings },
  { id: 'regional',      label: 'Regional & Compliance',    icon: Globe,         component: RegionalSettings },
  { id: 'notifications', label: 'Notifications & Alerts',   icon: Bell,          component: NotificationsSettings },
  { id: 'security',      label: 'Security',                 icon: Shield,        component: SecuritySettings },
  { id: 'integrations',  label: 'Integrations & APIs',      icon: Puzzle,        component: IntegrationsSettings },
  { id: 'reporting',     label: 'Reporting',                icon: BarChart2,     component: ReportingSettings },
  { id: 'general',       label: 'General / System',         icon: SettingsIcon,  component: GeneralSettings },
];

export default function Settings() {
  const [active, setActive] = useState('account');
  const [mobileOpen, setMobileOpen] = useState(false);

  const current = sections.find(s => s.id === active);
  const ActiveComponent = current?.component;

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-100">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage platform configuration, integrations, and compliance.</p>
      </div>

      <div className="flex gap-6 items-start">
        {/* Settings Sidebar — desktop */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden sticky top-0">
          {sections.map(s => {
            const Icon = s.icon;
            const isActive = s.id === active;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors duration-150 group border-b border-gray-800/60 last:border-0 ${
                  isActive
                    ? 'bg-violet-600/15 text-violet-400 font-medium'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-violet-400' : 'text-gray-500 group-hover:text-gray-300'} />
                <span className="flex-1 truncate">{s.label}</span>
                {isActive && <ChevronRight size={13} className="text-violet-400" />}
              </button>
            );
          })}
        </aside>

        {/* Settings Sidebar — mobile dropdown */}
        <div className="lg:hidden w-full mb-4">
          <button
            onClick={() => setMobileOpen(o => !o)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-sm text-gray-200 font-medium"
          >
            <span className="flex items-center gap-2">
              {current && <current.icon size={15} className="text-violet-400" />}
              {current?.label}
            </span>
            <ChevronRight size={15} className={`text-gray-500 transition-transform ${mobileOpen ? 'rotate-90' : ''}`} />
          </button>
          {mobileOpen && (
            <div className="mt-1 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              {sections.map(s => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    onClick={() => { setActive(s.id); setMobileOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left border-b border-gray-800/60 last:border-0 transition-colors ${
                      s.id === active ? 'bg-violet-600/15 text-violet-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                    }`}
                  >
                    <Icon size={15} />
                    {s.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
}

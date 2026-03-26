import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
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

export default function GameSettings() {
  const toast = useToast();
  const [games, setGames] = useState([]);
  const [rates, setRates] = useState([]);
  const [bonus, setBonus] = useState({ welcomeBonus: { enabled: true, percent: 10, maxAmount: 5000 }, cashback: { enabled: true, percent: 2, minSpend: 10000 }, referral: { enabled: true, amount: 500, referrerAmount: 200 } });
  const [saving, setSaving] = useState({});

  useEffect(() => {
    settingsService.getGameCatalog().then(setGames);
    settingsService.getCurrencyRates().then(setRates);
    settingsService.getBonusConfig().then(setBonus);
  }, []);

  const save = async (section, data) => {
    setSaving(s => ({ ...s, [section]: true }));
    await settingsService.save(section, data);
    setSaving(s => ({ ...s, [section]: false }));
    toast('Changes saved successfully', 'success');
  };

  const toggleGame = (id) => setGames(prev => prev.map(g => g.id === id ? { ...g, enabled: !g.enabled } : g));

  const updateRate = (id, val) => setRates(prev => prev.map(r => r.id === id ? { ...r, rate: val } : r));

  return (
    <div className="space-y-6">
      {/* Game Catalog */}
      <SectionCard title="Game Catalog" description="Enable or disable games per platform" onSave={() => save('game_catalog', games)} saving={saving.game_catalog}>
        <div className="space-y-2">
          {games.map(game => (
            <div key={game.id} className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${game.enabled ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-200">{game.name}</p>
                  <p className="text-xs text-gray-500">{game.category} · {game.regions.join(', ')}</p>
                </div>
              </div>
              <Toggle enabled={game.enabled} onChange={() => toggleGame(game.id)} />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Currency Rates */}
      <SectionCard title="Currency Conversion Rates" description="Manual override for exchange rates (auto-sync from provider when backend is live)" onSave={() => save('currency_rates', rates)} saving={saving.currency_rates}>
        <div className="space-y-3">
          {rates.map(r => (
            <div key={r.id} className="flex items-center gap-4 p-3 bg-gray-800/50 border border-gray-700/50 rounded-lg">
              <span className="text-sm font-semibold text-gray-300 w-24">{r.from} → {r.to}</span>
              <div className="flex-1">
                <input
                  type="number"
                  value={r.rate}
                  onChange={e => updateRate(r.id, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-600">Updated</p>
                <p className="text-[10px] text-gray-500">{r.lastUpdated}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
          <RefreshCw size={12} />
          <span>Auto-sync with live rates will be available when backend is connected.</span>
        </div>
      </SectionCard>

      {/* Bonus Config */}
      <SectionCard title="Bonus & Rewards Config" description="Welcome bonus, cashback, and referral settings" onSave={() => save('bonus', bonus)} saving={saving.bonus}>
        <div className="space-y-5">
          {/* Welcome Bonus */}
          <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-200">Welcome Bonus</p>
                <p className="text-xs text-gray-500">First-purchase bonus for new users</p>
              </div>
              <Toggle enabled={bonus.welcomeBonus.enabled} onChange={v => setBonus(b => ({ ...b, welcomeBonus: { ...b.welcomeBonus, enabled: v } }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Bonus %</label>
                <input type="number" value={bonus.welcomeBonus.percent} onChange={e => setBonus(b => ({ ...b, welcomeBonus: { ...b.welcomeBonus, percent: e.target.value } }))}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Max Amount (₦)</label>
                <input type="number" value={bonus.welcomeBonus.maxAmount} onChange={e => setBonus(b => ({ ...b, welcomeBonus: { ...b.welcomeBonus, maxAmount: e.target.value } }))}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
            </div>
          </div>

          {/* Cashback */}
          <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-200">Cashback</p>
                <p className="text-xs text-gray-500">Percentage returned on qualifying purchases</p>
              </div>
              <Toggle enabled={bonus.cashback.enabled} onChange={v => setBonus(b => ({ ...b, cashback: { ...b.cashback, enabled: v } }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Cashback %</label>
                <input type="number" value={bonus.cashback.percent} onChange={e => setBonus(b => ({ ...b, cashback: { ...b.cashback, percent: e.target.value } }))}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Min Spend (₦)</label>
                <input type="number" value={bonus.cashback.minSpend} onChange={e => setBonus(b => ({ ...b, cashback: { ...b.cashback, minSpend: e.target.value } }))}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
            </div>
          </div>

          {/* Referral */}
          <div className="p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-200">Referral Program</p>
                <p className="text-xs text-gray-500">Rewards for referred users and referrers</p>
              </div>
              <Toggle enabled={bonus.referral.enabled} onChange={v => setBonus(b => ({ ...b, referral: { ...b.referral, enabled: v } }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Referred User Gets (₦)</label>
                <input type="number" value={bonus.referral.amount} onChange={e => setBonus(b => ({ ...b, referral: { ...b.referral, amount: e.target.value } }))}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Referrer Gets (₦)</label>
                <input type="number" value={bonus.referral.referrerAmount} onChange={e => setBonus(b => ({ ...b, referral: { ...b.referral, referrerAmount: e.target.value } }))}
                  className="w-full bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

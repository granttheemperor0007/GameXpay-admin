export default function StatCard({ title, value, subtitle, icon: Icon, color = 'violet' }) {
  const colors = {
    violet: 'bg-violet-500/10 text-violet-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-400',
    sky: 'bg-sky-500/10 text-sky-400',
    rose: 'bg-rose-500/10 text-rose-400',
  };

  return (
    <div className="bg-gray-900 border border-gray-700/50 rounded-xl p-5 flex items-start gap-4">
      {Icon && (
        <div className={`p-2.5 rounded-lg shrink-0 ${colors[color] ?? colors.violet}`}>
          <Icon size={20} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider truncate">{title}</p>
        <p className="text-2xl font-bold text-gray-100 mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

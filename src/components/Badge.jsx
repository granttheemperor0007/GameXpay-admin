const variants = {
  // Order statuses
  completed: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  pending: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  cancelled: 'bg-red-500/15 text-red-400 border border-red-500/30',
  // Transaction statuses
  success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  failed: 'bg-red-500/15 text-red-400 border border-red-500/30',
  abandoned: 'bg-gray-500/15 text-gray-400 border border-gray-500/30',
  // Game statuses
  active: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  inactive: 'bg-gray-500/15 text-gray-400 border border-gray-500/30',
};

export default function Badge({ status, label }) {
  const cls = variants[status] ?? 'bg-gray-500/15 text-gray-400 border border-gray-500/30';
  const text = label ?? status;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}>
      {text}
    </span>
  );
}

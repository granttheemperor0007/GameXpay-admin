export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-gray-400">{label}</label>
      )}
      <input
        className={`
          w-full px-3 py-2 rounded-lg text-sm
          bg-gray-800 border text-gray-100 placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
          transition-colors
          ${error ? 'border-red-500/70' : 'border-gray-700'}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-gray-400">{label}</label>
      )}
      <textarea
        rows={4}
        className={`
          w-full px-3 py-2 rounded-lg text-sm
          bg-gray-800 border text-gray-100 placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
          transition-colors resize-y
          ${error ? 'border-red-500/70' : 'border-gray-700'}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function Select({ label, error, className = '', children, ...props }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-gray-400">{label}</label>
      )}
      <select
        className={`
          w-full px-3 py-2 rounded-lg text-sm
          bg-gray-800 border text-gray-100
          focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
          transition-colors
          ${error ? 'border-red-500/70' : 'border-gray-700'}
        `}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

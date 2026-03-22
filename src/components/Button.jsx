const variants = {
  primary:   'bg-white text-gray-950 hover:bg-gray-100 font-semibold',
  secondary: 'bg-white/[0.07] text-gray-200 hover:bg-white/[0.12] border border-white/[0.08]',
  danger:    'bg-red-600/90 hover:bg-red-500 text-white',
  ghost:     'bg-transparent hover:bg-white/[0.05] text-gray-400 hover:text-gray-200',
  success:   'bg-emerald-600 hover:bg-emerald-500 text-white',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-[14px] gap-2',
  lg: 'px-5 py-2.5 text-[14px] gap-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  disabled,
  loading,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center rounded-lg font-medium
        transition-colors duration-150 cursor-pointer
        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant] ?? variants.primary}
        ${sizes[size] ?? sizes.md}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}

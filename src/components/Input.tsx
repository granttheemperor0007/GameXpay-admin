import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

const inputBase = `
  w-full px-3 py-3 rounded-lg text-sm
  bg-gray-800 border text-gray-100 placeholder-gray-500
  focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent
  transition-colors
`;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  className?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-gray-400">{label}</label>
      )}
      <input
        className={`${inputBase} ${error ? 'border-red-500/70' : 'border-white/[0.08]'}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  className?: string
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-gray-400">{label}</label>
      )}
      <textarea
        rows={4}
        className={`${inputBase} resize-y ${error ? 'border-red-500/70' : 'border-white/[0.08]'}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  className?: string
  children: ReactNode
}

export function Select({ label, error, className = '', children, ...props }: SelectProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-gray-400">{label}</label>
      )}
      <div className="relative">
        <select
          className={`
            w-full pl-3 pr-9 py-3 rounded-lg text-sm appearance-none
            bg-gray-800 border text-gray-100
            focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent
            transition-colors cursor-pointer
            ${error ? 'border-red-500/70' : 'border-white/[0.08]'}
          `}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: '#6F6F6F' }}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

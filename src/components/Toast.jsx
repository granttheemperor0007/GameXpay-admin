import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, X, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const icons = { success: CheckCircle, error: XCircle, warning: AlertTriangle };
  const styles = {
    success: 'border-emerald-500/30 text-emerald-400',
    error: 'border-red-500/30 text-red-400',
    warning: 'border-amber-500/30 text-amber-400',
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => {
          const Icon = icons[toast.type] ?? icons.success;
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border bg-gray-900 text-sm font-medium max-w-sm animate-fade-in ${styles[toast.type] ?? styles.success}`}
            >
              <Icon size={15} className="shrink-0" />
              <span className="text-gray-200 flex-1">{toast.message}</span>
              <button onClick={() => dismiss(toast.id)} className="text-gray-500 hover:text-gray-300 transition-colors ml-1">
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

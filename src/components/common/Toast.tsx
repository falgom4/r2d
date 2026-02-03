import { useUI } from '@context/UIContext';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import clsx from 'clsx';

export function ToastContainer() {
  const { toasts, removeToast } = useUI();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={clsx(
            'card p-4 flex items-start gap-3 shadow-lg animate-in slide-in-from-right',
            {
              'border-l-4 border-success': toast.type === 'success',
              'border-l-4 border-error': toast.type === 'error',
              'border-l-4 border-info': toast.type === 'info',
              'border-l-4 border-warning': toast.type === 'warning',
            }
          )}
        >
          <div className="flex-shrink-0">
            {toast.type === 'success' && (
              <CheckCircle className="w-5 h-5 text-success" />
            )}
            {toast.type === 'error' && (
              <XCircle className="w-5 h-5 text-error" />
            )}
            {toast.type === 'info' && <Info className="w-5 h-5 text-info" />}
            {toast.type === 'warning' && (
              <AlertTriangle className="w-5 h-5 text-warning" />
            )}
          </div>
          <p className="flex-1 text-sm text-text-primary">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

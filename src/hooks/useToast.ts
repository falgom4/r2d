import { useUI } from '@context/UIContext';

export function useToast() {
  const { addToast, removeToast, toasts } = useUI();

  return {
    toasts,
    success: (message: string, duration?: number) =>
      addToast(message, 'success', duration),
    error: (message: string, duration?: number) =>
      addToast(message, 'error', duration),
    info: (message: string, duration?: number) =>
      addToast(message, 'info', duration),
    warning: (message: string, duration?: number) =>
      addToast(message, 'warning', duration),
    remove: removeToast,
  };
}

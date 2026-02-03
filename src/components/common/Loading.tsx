import { Loader2 } from 'lucide-react';

export function Loading({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <Loader2 className="w-8 h-8 animate-spin text-accent" />
      {message && <p className="text-sm text-text-secondary">{message}</p>}
    </div>
  );
}

import { useAuth } from '@context/AuthContext';
import { Button } from '@components/common/Button';
import { LogOut, HardDrive } from 'lucide-react';

export function Header() {
  const { credentials, clearCredentials } = useAuth();

  return (
    <header className="border-b border-border bg-surface">
      <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HardDrive className="w-6 h-6 text-accent" />
          <h1 className="text-xl font-semibold text-text-primary">R2Drive</h1>
          {credentials && (
            <span className="text-sm text-text-muted">
              / {credentials.bucketName}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={<LogOut className="w-4 h-4" />}
          onClick={clearCredentials}
        >
          Desconectar
        </Button>
      </div>
    </header>
  );
}

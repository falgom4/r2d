import { useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { Modal } from '@components/common/Modal';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { validateCredentials } from '@utils/validators';
import { createR2Client, testConnection } from '@services/r2Client';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import type { R2Credentials } from '@/types/credentials.types';

export function CredentialsModal() {
  const { setCredentials, setAuthState, authState } = useAuth();
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<R2Credentials>({
    accountId: '',
    accessKeyId: '',
    secretAccessKey: '',
    bucketName: '',
  });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof R2Credentials, string>>
  >({});

  const handleSubmit = async () => {
    setError('');
    setFieldErrors({});

    const validation = validateCredentials(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setAuthState('authenticating');

    try {
      const client = createR2Client(formData);
      const result = await testConnection(client, formData.bucketName);

      if (!result.success) {
        setError(result.error || 'Error al conectar');
        setAuthState('error');
        return;
      }

      setCredentials(formData);
    } catch (err: any) {
      setError(err.message || 'Error al conectar con R2');
      setAuthState('error');
    }
  };

  const isLoading = authState === 'authenticating';

  return (
    <Modal
      isOpen={true}
      onClose={() => {}}
      closeOnOverlayClick={false}
      size="md"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-3">
            <Shield className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            Conectar a R2
          </h2>
          <p className="text-sm text-text-secondary">
            Ingresa tus credenciales de Cloudflare R2
          </p>
        </div>

        <div className="card bg-surface-hover p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
          <div className="text-sm text-text-secondary">
            <p className="font-medium text-text-primary mb-1">
              Seguridad garantizada
            </p>
            <p>
              Tus credenciales solo se mantienen en memoria y nunca se guardan.
              Se perderán al cerrar esta página.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Account ID"
            value={formData.accountId}
            onChange={(value) =>
              setFormData({ ...formData, accountId: value })
            }
            placeholder="ej: a1b2c3d4e5f6"
            error={fieldErrors.accountId}
            disabled={isLoading}
          />

          <Input
            label="Access Key ID"
            value={formData.accessKeyId}
            onChange={(value) =>
              setFormData({ ...formData, accessKeyId: value })
            }
            placeholder="ej: 9f4b7a..."
            error={fieldErrors.accessKeyId}
            disabled={isLoading}
          />

          <div className="relative">
            <Input
              label="Secret Access Key"
              type={showSecretKey ? 'text' : 'password'}
              value={formData.secretAccessKey}
              onChange={(value) =>
                setFormData({ ...formData, secretAccessKey: value })
              }
              placeholder="*****************"
              error={fieldErrors.secretAccessKey}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowSecretKey(!showSecretKey)}
              className="absolute right-3 top-9 text-text-muted hover:text-text-primary transition-colors"
            >
              {showSecretKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          <Input
            label="Bucket Name"
            value={formData.bucketName}
            onChange={(value) =>
              setFormData({ ...formData, bucketName: value })
            }
            placeholder="mi-bucket"
            error={fieldErrors.bucketName}
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="card bg-error/10 border-error p-3 text-sm text-error">
            {error}
          </div>
        )}

        <Button
          variant="primary"
          onClick={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          className="w-full"
        >
          Conectar
        </Button>
      </div>
    </Modal>
  );
}

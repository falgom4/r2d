/**
 * Credenciales para conectar con Cloudflare R2
 */
export interface R2Credentials {
  /** Account ID de Cloudflare */
  accountId: string;
  /** Access Key ID de R2 */
  accessKeyId: string;
  /** Secret Access Key de R2 */
  secretAccessKey: string;
  /** Nombre del bucket */
  bucketName: string;
}

/**
 * Resultado de validación de credenciales
 */
export interface CredentialsValidation {
  isValid: boolean;
  errors: Partial<Record<keyof R2Credentials, string>>;
}

/**
 * Estado de autenticación
 */
export type AuthState =
  | 'unauthenticated'
  | 'authenticating'
  | 'authenticated'
  | 'error';

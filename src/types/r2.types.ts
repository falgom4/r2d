import type { S3Client } from '@aws-sdk/client-s3';

/**
 * Configuración del cliente R2
 */
export interface R2ClientConfig {
  region: string;
  endpoint: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

/**
 * Respuesta de listado de objetos
 */
export interface ListObjectsResponse {
  /** Objetos (archivos) en el nivel actual */
  objects: Array<{
    key: string;
    size: number;
    lastModified: Date;
    etag?: string;
  }>;
  /** Prefijos de carpetas en el nivel actual */
  folders: string[];
  /** Si hay más resultados */
  isTruncated: boolean;
  /** Token para continuar la paginación */
  continuationToken?: string;
}

/**
 * Opciones para operaciones de archivo
 */
export interface FileOperationOptions {
  /** Callback de progreso */
  onProgress?: (progress: number) => void;
  /** Señal de abort */
  signal?: AbortSignal;
}

/**
 * Resultado de una operación de archivo
 */
export interface FileOperationResult {
  success: boolean;
  error?: string;
}

/**
 * Cliente R2 con operaciones
 */
export interface R2Client {
  /** Cliente S3 subyacente */
  client: S3Client;
  /** Nombre del bucket */
  bucketName: string;
}

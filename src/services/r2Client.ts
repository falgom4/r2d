import { S3Client } from '@aws-sdk/client-s3';
import type { R2Credentials } from '@types/credentials.types';

/**
 * Crea un cliente S3 configurado para Cloudflare R2
 */
export function createR2Client(credentials: R2Credentials): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${credentials.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
    },
  });
}

/**
 * Verifica que las credenciales sean válidas intentando listar objetos
 */
export async function testConnection(
  client: S3Client,
  bucketName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { ListObjectsV2Command } = await import('@aws-sdk/client-s3');

    // Intentar listar objetos (máximo 1) para verificar conexión
    await client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        MaxKeys: 1,
      })
    );

    return { success: true };
  } catch (error: any) {
    console.error('Error al probar conexión:', error);

    // Mensajes de error específicos
    if (error.name === 'NoSuchBucket') {
      return { success: false, error: 'El bucket especificado no existe' };
    }

    if (error.name === 'InvalidAccessKeyId') {
      return {
        success: false,
        error: 'Access Key ID inválido',
      };
    }

    if (error.name === 'SignatureDoesNotMatch') {
      return {
        success: false,
        error: 'Secret Access Key inválido',
      };
    }

    if (error.name === 'AccessDenied') {
      return {
        success: false,
        error: 'Acceso denegado. Verifica los permisos del bucket',
      };
    }

    if (error.name === 'NetworkingError' || error.code === 'ENOTFOUND') {
      return {
        success: false,
        error: 'Error de red. Verifica tu conexión a internet',
      };
    }

    return {
      success: false,
      error: error.message || 'Error desconocido al conectar',
    };
  }
}

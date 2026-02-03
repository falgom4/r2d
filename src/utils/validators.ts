import type {
  R2Credentials,
  CredentialsValidation,
} from '@/types/credentials.types';

/**
 * Valida las credenciales de R2
 */
export function validateCredentials(
  credentials: Partial<R2Credentials>
): CredentialsValidation {
  const errors: Partial<Record<keyof R2Credentials, string>> = {};

  // Validar Account ID
  if (!credentials.accountId || credentials.accountId.trim() === '') {
    errors.accountId = 'El Account ID es requerido';
  } else if (credentials.accountId.length < 10) {
    errors.accountId = 'El Account ID no es válido';
  }

  // Validar Access Key ID
  if (!credentials.accessKeyId || credentials.accessKeyId.trim() === '') {
    errors.accessKeyId = 'El Access Key ID es requerido';
  } else if (credentials.accessKeyId.length < 10) {
    errors.accessKeyId = 'El Access Key ID no es válido';
  }

  // Validar Secret Access Key
  if (
    !credentials.secretAccessKey ||
    credentials.secretAccessKey.trim() === ''
  ) {
    errors.secretAccessKey = 'El Secret Access Key es requerido';
  } else if (credentials.secretAccessKey.length < 20) {
    errors.secretAccessKey = 'El Secret Access Key no es válido';
  }

  // Validar Bucket Name
  if (!credentials.bucketName || credentials.bucketName.trim() === '') {
    errors.bucketName = 'El nombre del bucket es requerido';
  } else if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(credentials.bucketName)) {
    errors.bucketName =
      'El nombre del bucket debe contener solo letras minúsculas, números y guiones';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valida un nombre de archivo
 */
export function validateFileName(name: string): {
  isValid: boolean;
  error?: string;
} {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'El nombre no puede estar vacío' };
  }

  // Caracteres no permitidos en nombres de archivo
  const invalidChars = /[<>:"/\\|?*\x00-\x1f]/;
  if (invalidChars.test(name)) {
    return {
      isValid: false,
      error: 'El nombre contiene caracteres no permitidos',
    };
  }

  // Nombres reservados (Windows)
  const reservedNames = [
    'CON',
    'PRN',
    'AUX',
    'NUL',
    'COM1',
    'COM2',
    'COM3',
    'COM4',
    'COM5',
    'COM6',
    'COM7',
    'COM8',
    'COM9',
    'LPT1',
    'LPT2',
    'LPT3',
    'LPT4',
    'LPT5',
    'LPT6',
    'LPT7',
    'LPT8',
    'LPT9',
  ];
  const upperName = name.toUpperCase().split('.')[0];
  if (reservedNames.includes(upperName)) {
    return { isValid: false, error: 'Nombre reservado del sistema' };
  }

  if (name.length > 255) {
    return {
      isValid: false,
      error: 'El nombre es demasiado largo (máximo 255 caracteres)',
    };
  }

  return { isValid: true };
}

/**
 * Valida el tamaño de un archivo
 */
export function validateFileSize(
  size: number,
  maxSize?: number
): { isValid: boolean; error?: string } {
  if (size === 0) {
    return { isValid: false, error: 'El archivo está vacío' };
  }

  if (maxSize && size > maxSize) {
    return {
      isValid: false,
      error: `El archivo excede el tamaño máximo permitido`,
    };
  }

  return { isValid: true };
}

/**
 * Verifica si un archivo es una imagen basándose en su MIME type
 */
export function isImage(contentType: string): boolean {
  return contentType.startsWith('image/');
}

/**
 * Verifica si un archivo es un video
 */
export function isVideo(contentType: string): boolean {
  return contentType.startsWith('video/');
}

/**
 * Verifica si un archivo es un documento
 */
export function isDocument(contentType: string): boolean {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];
  return documentTypes.includes(contentType);
}

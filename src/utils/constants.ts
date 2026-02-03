/**
 * Constantes de la aplicación
 */

// Espaciado
export const SPACING = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
} as const;

// Layout
export const LAYOUT = {
  headerHeight: '64px',
  sidebarWidth: '280px',
  maxContentWidth: '1440px',
} as const;

// Límites de archivos
export const FILE_LIMITS = {
  // Tamaño máximo para upload simple (5MB)
  maxSingleUploadSize: 5 * 1024 * 1024,
  // Tamaño de parte para multipart (5MB - mínimo requerido por S3)
  multipartPartSize: 5 * 1024 * 1024,
  // Número de uploads concurrentes
  concurrentUploads: 4,
} as const;

// Extensiones de archivo y sus íconos
export const FILE_EXTENSIONS = {
  image: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'],
  video: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
  audio: ['.mp3', '.wav', '.ogg', '.flac', '.aac'],
  document: ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt'],
  archive: ['.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'],
  code: [
    '.js',
    '.ts',
    '.jsx',
    '.tsx',
    '.html',
    '.css',
    '.json',
    '.xml',
    '.py',
    '.java',
    '.c',
    '.cpp',
    '.go',
    '.rs',
  ],
} as const;

// MIME types de imágenes soportadas para preview
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
] as const;

// Mensajes de error
export const ERROR_MESSAGES = {
  invalidCredentials: 'Credenciales inválidas. Por favor verifica tus datos.',
  connectionFailed: 'No se pudo conectar al bucket. Verifica tu conexión.',
  bucketNotFound: 'El bucket especificado no existe.',
  uploadFailed: 'Error al subir el archivo. Inténtalo de nuevo.',
  deleteFailed: 'Error al eliminar el archivo.',
  downloadFailed: 'Error al descargar el archivo.',
  createFolderFailed: 'Error al crear la carpeta.',
  renameFailed: 'Error al renombrar el archivo.',
  networkError: 'Error de red. Verifica tu conexión a internet.',
  unknown: 'Ha ocurrido un error desconocido.',
} as const;

// Tiempo de expiración de URLs presignadas (1 hora)
export const PRESIGNED_URL_EXPIRATION = 3600; // segundos

/**
 * Objeto de archivo/carpeta en R2
 */
export interface FileObject {
  /** Ruta completa del archivo en el bucket */
  key: string;
  /** Nombre del archivo (sin path) */
  name: string;
  /** Tamaño en bytes */
  size: number;
  /** Fecha de última modificación */
  lastModified: Date;
  /** Si es una carpeta */
  isFolder: boolean;
  /** MIME type del archivo */
  contentType?: string;
  /** ETag del archivo (para validación) */
  etag?: string;
}

/**
 * Tarea de upload
 */
export interface UploadTask {
  /** ID único de la tarea */
  id: string;
  /** Nombre del archivo */
  fileName: string;
  /** Tamaño del archivo en bytes */
  fileSize: number;
  /** Progreso del upload (0-100) */
  progress: number;
  /** Estado del upload */
  status: 'pending' | 'uploading' | 'completed' | 'error';
  /** Mensaje de error si falla */
  error?: string;
  /** Key en R2 donde se subirá */
  key?: string;
}

/**
 * Progreso de upload
 */
export interface UploadProgress {
  /** Bytes subidos */
  loaded: number;
  /** Total de bytes */
  total: number;
  /** Porcentaje (0-100) */
  percentage: number;
}

/**
 * Tipo de vista del explorador de archivos
 */
export type ViewMode = 'list' | 'grid';

/**
 * Criterio de ordenamiento
 */
export type SortBy = 'name' | 'size' | 'date';

/**
 * Dirección de ordenamiento
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Filtro de archivos
 */
export interface FileFilter {
  /** Buscar por nombre */
  search?: string;
  /** Filtrar por tipo de contenido */
  contentType?: string;
  /** Mostrar solo carpetas */
  foldersOnly?: boolean;
}

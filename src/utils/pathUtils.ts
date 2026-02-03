/**
 * Utilidades para manipular rutas de archivos en R2
 */

/**
 * Une múltiples segmentos de ruta
 */
export function joinPath(...segments: string[]): string {
  return segments
    .filter(Boolean)
    .join('/')
    .replace(/\/+/g, '/') // Eliminar barras duplicadas
    .replace(/^\//, ''); // Eliminar barra inicial
}

/**
 * Obtiene el nombre de archivo desde una ruta completa
 */
export function getFileName(path: string): string {
  const parts = path.split('/');
  return parts[parts.length - 1] || '';
}

/**
 * Obtiene el directorio padre de una ruta
 */
export function getParentPath(path: string): string {
  const parts = path.split('/').filter(Boolean);
  parts.pop();
  return parts.join('/');
}

/**
 * Obtiene la extensión de un archivo
 */
export function getExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length === 1) return '';
  return `.${parts.pop()?.toLowerCase() || ''}`;
}

/**
 * Obtiene el nombre sin extensión
 */
export function getNameWithoutExtension(filename: string): string {
  const ext = getExtension(filename);
  if (!ext) return filename;
  return filename.slice(0, -ext.length);
}

/**
 * Verifica si una ruta es una carpeta (termina en /)
 */
export function isFolder(path: string): boolean {
  return path.endsWith('/');
}

/**
 * Asegura que una ruta de carpeta termine en /
 */
export function ensureTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

/**
 * Elimina la barra final de una ruta
 */
export function removeTrailingSlash(path: string): string {
  return path.endsWith('/') ? path.slice(0, -1) : path;
}

/**
 * Normaliza una ruta eliminando segmentos vacíos y barras duplicadas
 */
export function normalizePath(path: string): string {
  return path
    .split('/')
    .filter(Boolean)
    .join('/');
}

/**
 * Divide una ruta en segmentos para breadcrumbs
 */
export function splitPath(path: string): string[] {
  return path.split('/').filter(Boolean);
}

/**
 * Construye una ruta desde segmentos de breadcrumbs
 */
export function buildPathFromSegments(segments: string[]): string {
  return segments.filter(Boolean).join('/');
}

/**
 * Verifica si una ruta está dentro de otra (es subruta)
 */
export function isSubPath(childPath: string, parentPath: string): boolean {
  const normalizedChild = normalizePath(childPath);
  const normalizedParent = normalizePath(parentPath);

  if (normalizedParent === '') return true; // Raíz contiene todo

  return normalizedChild.startsWith(normalizedParent + '/');
}

/**
 * Sanitiza un nombre de archivo removiendo caracteres no permitidos
 */
export function sanitizeFileName(name: string): string {
  return name
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_') // Reemplazar caracteres inválidos
    .replace(/^\.+/, '') // Eliminar puntos al inicio
    .replace(/\.+$/, '') // Eliminar puntos al final
    .trim();
}

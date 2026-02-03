import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea un tamaño de archivo en bytes a una cadena legible
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);

  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * Formatea una fecha a formato legible
 */
export function formatDate(date: Date): string {
  return format(date, 'dd MMM yyyy, HH:mm', { locale: es });
}

/**
 * Formatea una fecha mostrando el tiempo relativo (hace 2 horas, etc.)
 */
export function formatDateRelative(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true, locale: es });
}

/**
 * Formatea un porcentaje
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Trunca un texto si es muy largo
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Capitaliza la primera letra de cada palabra
 */
export function capitalize(text: string): string {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Formatea un número con separadores de miles
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-ES').format(num);
}

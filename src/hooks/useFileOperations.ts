import { useState } from 'react';
import { useR2 } from '@context/R2Context';
import { useUI } from '@context/UIContext';
import type { FileObject } from '@/types/file.types';

export function useFileOperations() {
  const { operations } = useR2();
  const { addToast } = useUI();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileObject[]>([]);

  const listFiles = async (prefix: string = '') => {
    if (!operations) return;
    setLoading(true);
    try {
      const result = await operations.listFiles(prefix);
      setFiles(result);
      return result;
    } catch (error: any) {
      addToast(error.message || 'Error al listar archivos', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (key: string) => {
    if (!operations) return;
    try {
      await operations.deleteObject(key);
      addToast('Archivo eliminado correctamente', 'success');
    } catch (error: any) {
      addToast(error.message || 'Error al eliminar archivo', 'error');
      throw error;
    }
  };

  const deleteFolder = async (key: string) => {
    if (!operations) return;
    try {
      await operations.deleteFolder(key);
      addToast('Carpeta eliminada correctamente', 'success');
    } catch (error: any) {
      addToast(error.message || 'Error al eliminar carpeta', 'error');
      throw error;
    }
  };

  const createFolder = async (path: string) => {
    if (!operations) return;
    try {
      await operations.createFolder(path);
      addToast('Carpeta creada correctamente', 'success');
    } catch (error: any) {
      addToast(error.message || 'Error al crear carpeta', 'error');
      throw error;
    }
  };

  const renameFile = async (oldKey: string, newKey: string) => {
    if (!operations) return;
    try {
      await operations.moveObject(oldKey, newKey);
      addToast('Archivo renombrado correctamente', 'success');
    } catch (error: any) {
      addToast(error.message || 'Error al renombrar archivo', 'error');
      throw error;
    }
  };

  return {
    loading,
    files,
    listFiles,
    deleteFile,
    deleteFolder,
    createFolder,
    renameFile,
  };
}

import { useEffect } from 'react';
import { useFileOperations } from '@hooks/useFileOperations';
import { useUpload } from '@hooks/useUpload';
import { useUI } from '@context/UIContext';
import { Breadcrumbs } from './Breadcrumbs';
import { Loading } from '@components/common/Loading';
import { Button } from '@components/common/Button';
import { FolderPlus, Upload, Folder, File, Download, Trash2, FolderUp } from 'lucide-react';
import { formatFileSize, formatDateRelative } from '@utils/formatters';
import { joinPath } from '@utils/pathUtils';
import { useR2 } from '@context/R2Context';
import type { FileObject } from '@/types/file.types';

export function FileBrowser() {
  const { currentPath, setCurrentPath } = useUI();
  const { listFiles, loading, files, deleteFile, deleteFolder, createFolder } =
    useFileOperations();
  const { addUpload } = useUpload();
  const { urlGenerator } = useR2();

  useEffect(() => {
    loadFiles(currentPath);
  }, [currentPath]);

  const loadFiles = async (path: string) => {
    try {
      await listFiles(path);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const handleFolderClick = (folderKey: string) => {
    handleNavigate(folderKey);
  };

  const handleCreateFolder = async () => {
    const folderName = prompt('Nombre de la carpeta:');
    if (!folderName) return;

    const folderPath = joinPath(currentPath, folderName);
    await createFolder(folderPath);
    await loadFiles(currentPath);
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files) return;

      for (const file of Array.from(files)) {
        const key = joinPath(currentPath, file.name);
        await addUpload(file, key);
      }

      await loadFiles(currentPath);
    };
    input.click();
  };

  const handleUploadFolder = () => {
    const input = document.createElement('input');
    input.type = 'file';
    // @ts-ignore - webkitdirectory no está en tipos estándar pero funciona en navegadores modernos
    input.webkitdirectory = true;
    // @ts-ignore
    input.directory = true;
    input.multiple = true;
    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length === 0) return;

      // Procesar todos los archivos preservando la estructura de carpetas
      for (const file of Array.from(files)) {
        // webkitRelativePath contiene la ruta completa desde la carpeta seleccionada
        // @ts-ignore
        const relativePath = file.webkitRelativePath || file.name;
        const key = joinPath(currentPath, relativePath);
        await addUpload(file, key);
      }

      await loadFiles(currentPath);
    };
    input.click();
  };

  const handleDownload = async (file: FileObject) => {
    if (!urlGenerator) return;
    try {
      const url = await urlGenerator.getDownloadUrl(file.key);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDelete = async (file: FileObject) => {
    const confirmed = confirm(
      `¿Eliminar ${file.isFolder ? 'carpeta' : 'archivo'} "${file.name}"?`
    );
    if (!confirmed) return;

    try {
      if (file.isFolder) {
        await deleteFolder(file.key);
      } else {
        await deleteFile(file.key);
      }
      await loadFiles(currentPath);
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-surface p-4 space-y-4">
        <Breadcrumbs path={currentPath} onNavigate={handleNavigate} />
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<FolderPlus className="w-4 h-4" />}
            onClick={handleCreateFolder}
          >
            Nueva Carpeta
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Upload className="w-4 h-4" />}
            onClick={handleUpload}
          >
            Subir Archivos
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<FolderUp className="w-4 h-4" />}
            onClick={handleUploadFolder}
          >
            Subir Carpeta
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto scrollbar-custom">
        {loading ? (
          <Loading message="Cargando archivos..." />
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-text-muted">
            <Folder className="w-12 h-12 mb-3 opacity-50" />
            <p>Esta carpeta está vacía</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-border bg-surface sticky top-0">
              <tr className="text-left text-sm text-text-secondary">
                <th className="p-4 font-medium">Nombre</th>
                <th className="p-4 font-medium">Tamaño</th>
                <th className="p-4 font-medium">Modificado</th>
                <th className="p-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr
                  key={file.key}
                  className="border-b border-border hover:bg-surface-hover transition-colors"
                >
                  <td className="p-4">
                    <button
                      onClick={() =>
                        file.isFolder ? handleFolderClick(file.key) : null
                      }
                      className="flex items-center gap-2 text-left hover:text-accent transition-colors"
                    >
                      {file.isFolder ? (
                        <Folder className="w-5 h-5 text-accent" />
                      ) : (
                        <File className="w-5 h-5 text-text-muted" />
                      )}
                      <span className="text-text-primary">{file.name}</span>
                    </button>
                  </td>
                  <td className="p-4 text-text-secondary">
                    {file.isFolder ? '-' : formatFileSize(file.size)}
                  </td>
                  <td className="p-4 text-text-secondary">
                    {formatDateRelative(file.lastModified)}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {!file.isFolder && (
                        <button
                          onClick={() => handleDownload(file)}
                          className="p-1 hover:bg-surface rounded text-text-muted hover:text-accent transition-colors"
                          title="Descargar"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(file)}
                        className="p-1 hover:bg-surface rounded text-text-muted hover:text-error transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

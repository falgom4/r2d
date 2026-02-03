import { useState, useCallback } from 'react';
import { useR2 } from '@context/R2Context';
import { useUI } from '@context/UIContext';
import type { UploadTask } from '@types/file.types';
import { MultipartUploader } from '@services/multipartUpload';

export function useUpload() {
  const { uploader, operations } = useR2();
  const { addToast } = useUI();
  const [uploads, setUploads] = useState<Map<string, UploadTask>>(new Map());

  const addUpload = useCallback(
    async (file: File, key: string) => {
      if (!uploader && !operations) return;

      const id = `${Date.now()}-${file.name}`;
      const task: UploadTask = {
        id,
        fileName: file.name,
        fileSize: file.size,
        progress: 0,
        status: 'pending',
        key,
      };

      setUploads((prev) => new Map(prev).set(id, task));

      try {
        // Decidir si usar multipart o upload simple
        const useMultipart = MultipartUploader.shouldUseMultipart(file.size);

        if (useMultipart && uploader) {
          await uploader.uploadWithProgress(key, file, (progress) => {
            setUploads((prev) => {
              const next = new Map(prev);
              const currentTask = next.get(id);
              if (currentTask) {
                next.set(id, {
                  ...currentTask,
                  progress: progress.percentage,
                  status: 'uploading',
                });
              }
              return next;
            });
          });
        } else if (operations) {
          await operations.uploadFile(key, file);
        }

        setUploads((prev) => {
          const next = new Map(prev);
          const currentTask = next.get(id);
          if (currentTask) {
            next.set(id, { ...currentTask, status: 'completed', progress: 100 });
          }
          return next;
        });

        addToast(`${file.name} subido correctamente`, 'success');
      } catch (error: any) {
        setUploads((prev) => {
          const next = new Map(prev);
          const currentTask = next.get(id);
          if (currentTask) {
            next.set(id, {
              ...currentTask,
              status: 'error',
              error: error.message,
            });
          }
          return next;
        });
        addToast(`Error al subir ${file.name}`, 'error');
      }
    },
    [uploader, operations, addToast]
  );

  const removeUpload = useCallback((id: string) => {
    setUploads((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const clearCompleted = useCallback(() => {
    setUploads((prev) => {
      const next = new Map(prev);
      for (const [id, task] of next.entries()) {
        if (task.status === 'completed') {
          next.delete(id);
        }
      }
      return next;
    });
  }, []);

  return {
    uploads,
    addUpload,
    removeUpload,
    clearCompleted,
  };
}

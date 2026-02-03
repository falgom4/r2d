import { Upload } from '@aws-sdk/lib-storage';
import type { S3Client } from '@aws-sdk/client-s3';
import type { UploadProgress } from '@/types/file.types';
import { FILE_LIMITS } from '@utils/constants';

/**
 * Clase para manejar uploads multipart con progreso
 */
export class MultipartUploader {
  constructor(
    private client: S3Client,
    private bucketName: string
  ) {}

  /**
   * Sube un archivo con progreso
   */
  async uploadWithProgress(
    key: string,
    file: File,
    onProgress?: (progress: UploadProgress) => void,
    signal?: AbortSignal
  ): Promise<void> {
    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucketName,
        Key: key,
        Body: file,
        ContentType: file.type,
      },
      // Configuración para multipart
      queueSize: FILE_LIMITS.concurrentUploads, // Uploads concurrentes
      partSize: FILE_LIMITS.multipartPartSize, // 5MB por parte
      leavePartsOnError: false,
    });

    // Escuchar progreso
    if (onProgress) {
      upload.on('httpUploadProgress', (progress) => {
        if (progress.loaded && progress.total) {
          const percentage = Math.round((progress.loaded / progress.total) * 100);
          onProgress({
            loaded: progress.loaded,
            total: progress.total,
            percentage,
          });
        }
      });
    }

    // Manejar abortar
    if (signal) {
      signal.addEventListener('abort', () => {
        upload.abort();
      });
    }

    try {
      await upload.done();
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Upload cancelado');
      }
      throw error;
    }
  }

  /**
   * Sube múltiples archivos con progreso individual
   */
  async uploadMultipleFiles(
    files: Array<{ key: string; file: File }>,
    onFileProgress?: (fileKey: string, progress: UploadProgress) => void,
    onOverallProgress?: (completed: number, total: number) => void,
    signal?: AbortSignal
  ): Promise<void> {
    const total = files.length;
    let completed = 0;

    const uploadPromises = files.map(async ({ key, file }) => {
      try {
        await this.uploadWithProgress(
          key,
          file,
          (progress) => {
            if (onFileProgress) {
              onFileProgress(key, progress);
            }
          },
          signal
        );

        completed++;
        if (onOverallProgress) {
          onOverallProgress(completed, total);
        }
      } catch (error) {
        completed++;
        if (onOverallProgress) {
          onOverallProgress(completed, total);
        }
        throw error;
      }
    });

    await Promise.all(uploadPromises);
  }

  /**
   * Determina si un archivo debe usar multipart upload
   */
  static shouldUseMultipart(fileSize: number): boolean {
    return fileSize > FILE_LIMITS.maxSingleUploadSize;
  }
}

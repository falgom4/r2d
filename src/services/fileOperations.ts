import {
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  CopyObjectCommand,
  type S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { FileObject } from '@/types/file.types';
import type { ListObjectsResponse } from '@/types/r2.types';
import { isFolder as checkIsFolder } from '@utils/pathUtils';
import { PRESIGNED_URL_EXPIRATION } from '@utils/constants';

/**
 * Clase para operaciones CRUD con archivos en R2
 */
export class R2FileOperations {
  constructor(
    private client: S3Client,
    private bucketName: string
  ) {}

  /**
   * Lista archivos y carpetas en un prefijo dado
   */
  async listObjects(prefix: string = ''): Promise<ListObjectsResponse> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: prefix,
      Delimiter: '/',
    });

    const response = await this.client.send(command);

    // Procesar objetos (archivos)
    const objects =
      response.Contents?.filter((obj) => obj.Key !== prefix).map((obj) => ({
        key: obj.Key!,
        size: obj.Size || 0,
        lastModified: obj.LastModified || new Date(),
        etag: obj.ETag,
      })) || [];

    // Procesar prefijos comunes (carpetas)
    const folders = response.CommonPrefixes?.map((p) => p.Prefix!) || [];

    return {
      objects,
      folders,
      isTruncated: response.IsTruncated || false,
      continuationToken: response.NextContinuationToken,
    };
  }

  /**
   * Convierte la respuesta de listado en objetos FileObject
   */
  async listFiles(prefix: string = ''): Promise<FileObject[]> {
    const response = await this.listObjects(prefix);
    const files: FileObject[] = [];

    // Agregar carpetas
    for (const folderKey of response.folders) {
      files.push({
        key: folderKey,
        name: folderKey.split('/').filter(Boolean).pop() || '',
        size: 0,
        lastModified: new Date(),
        isFolder: true,
      });
    }

    // Agregar archivos
    for (const obj of response.objects) {
      files.push({
        key: obj.key,
        name: obj.key.split('/').pop() || '',
        size: obj.size,
        lastModified: obj.lastModified,
        isFolder: false,
        etag: obj.etag,
      });
    }

    return files;
  }

  /**
   * Obtiene un objeto (archivo)
   */
  async getObject(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await this.client.send(command);
  }

  /**
   * Genera una URL presignada para descargar un archivo
   */
  async getPresignedDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.client, command, {
      expiresIn: PRESIGNED_URL_EXPIRATION,
    });
  }

  /**
   * Sube un archivo (para archivos pequeños)
   */
  async uploadFile(key: string, file: File | Blob): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: file.type,
    });

    await this.client.send(command);
  }

  /**
   * Elimina un archivo
   */
  async deleteObject(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.client.send(command);
  }

  /**
   * Elimina múltiples archivos
   */
  async deleteObjects(keys: string[]): Promise<void> {
    const command = new DeleteObjectsCommand({
      Bucket: this.bucketName,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
        Quiet: true,
      },
    });

    await this.client.send(command);
  }

  /**
   * Elimina una carpeta y todo su contenido recursivamente
   */
  async deleteFolder(prefix: string): Promise<void> {
    const folderPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`;

    // Listar todos los objetos en la carpeta
    const response = await this.listObjectsRecursive(folderPrefix);

    if (response.length === 0) return;

    // Eliminar en lotes de 1000 (límite de S3)
    const batchSize = 1000;
    for (let i = 0; i < response.length; i += batchSize) {
      const batch = response.slice(i, i + batchSize);
      await this.deleteObjects(batch);
    }
  }

  /**
   * Lista todos los objetos de forma recursiva (sin límite)
   */
  private async listObjectsRecursive(prefix: string): Promise<string[]> {
    const allKeys: string[] = [];
    let continuationToken: string | undefined;

    do {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      });

      const response = await this.client.send(command);

      if (response.Contents) {
        allKeys.push(...response.Contents.map((obj) => obj.Key!));
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return allKeys;
  }

  /**
   * Crea una carpeta (objeto vacío con trailing slash)
   */
  async createFolder(path: string): Promise<void> {
    const folderKey = path.endsWith('/') ? path : `${path}/`;
    await this.uploadFile(folderKey, new Blob(['']));
  }

  /**
   * Renombra o mueve un archivo (copia + elimina)
   */
  async moveObject(sourceKey: string, destinationKey: string): Promise<void> {
    // Verificar si es una carpeta
    if (checkIsFolder(sourceKey)) {
      await this.moveFolder(sourceKey, destinationKey);
      return;
    }

    // Copiar archivo
    const copyCommand = new CopyObjectCommand({
      Bucket: this.bucketName,
      CopySource: `${this.bucketName}/${sourceKey}`,
      Key: destinationKey,
    });
    await this.client.send(copyCommand);

    // Eliminar archivo original
    await this.deleteObject(sourceKey);
  }

  /**
   * Mueve una carpeta completa
   */
  private async moveFolder(
    sourcePrefix: string,
    destinationPrefix: string
  ): Promise<void> {
    const sourcePath = sourcePrefix.endsWith('/')
      ? sourcePrefix
      : `${sourcePrefix}/`;
    const destinationPath = destinationPrefix.endsWith('/')
      ? destinationPrefix
      : `${destinationPrefix}/`;

    // Listar todos los objetos en la carpeta
    const keys = await this.listObjectsRecursive(sourcePath);

    // Copiar cada objeto a su nueva ubicación
    for (const key of keys) {
      const relativePath = key.slice(sourcePath.length);
      const newKey = `${destinationPath}${relativePath}`;

      const copyCommand = new CopyObjectCommand({
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${key}`,
        Key: newKey,
      });
      await this.client.send(copyCommand);
    }

    // Eliminar carpeta original
    await this.deleteFolder(sourcePath);
  }

  /**
   * Copia un archivo
   */
  async copyObject(sourceKey: string, destinationKey: string): Promise<void> {
    const command = new CopyObjectCommand({
      Bucket: this.bucketName,
      CopySource: `${this.bucketName}/${sourceKey}`,
      Key: destinationKey,
    });

    await this.client.send(command);
  }
}

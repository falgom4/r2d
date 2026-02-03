import { GetObjectCommand, type S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PRESIGNED_URL_EXPIRATION } from '@utils/constants';

/**
 * Genera URLs presignadas para acceder a objetos en R2
 */
export class URLGenerator {
  constructor(
    private client: S3Client,
    private bucketName: string
  ) {}

  /**
   * Genera una URL presignada para descargar un archivo
   */
  async getDownloadUrl(key: string, expiresIn?: number): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return await getSignedUrl(this.client, command, {
      expiresIn: expiresIn || PRESIGNED_URL_EXPIRATION,
    });
  }

  /**
   * Genera una URL presignada con nombre de archivo personalizado
   */
  async getDownloadUrlWithFilename(
    key: string,
    filename: string,
    expiresIn?: number
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${filename}"`,
    });

    return await getSignedUrl(this.client, command, {
      expiresIn: expiresIn || PRESIGNED_URL_EXPIRATION,
    });
  }

  /**
   * Genera una URL presignada para previsualizar un archivo (inline)
   */
  async getPreviewUrl(key: string, expiresIn?: number): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ResponseContentDisposition: 'inline',
    });

    return await getSignedUrl(this.client, command, {
      expiresIn: expiresIn || PRESIGNED_URL_EXPIRATION,
    });
  }
}

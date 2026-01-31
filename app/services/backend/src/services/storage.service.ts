import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomBytes } from 'crypto';
import path from 'path';

export interface UploadResult {
  key: string;
  bucket: string;
  location: string;
  size: number;
}

export class S3StorageService {
  private s3Client: S3Client;
  private bucket: string;
  private region: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET || 'participa-df-files';
    this.region = process.env.AWS_REGION || 'us-east-1';

    // Configure S3 client for LocalStack
    this.s3Client = new S3Client({
      region: this.region,
      endpoint: process.env.S3_ENDPOINT || 'http://localhost:4566',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
      },
      forcePathStyle: true, // Required for LocalStack
    });
  }

  /**
   * Generate unique file key
   */
  private generateFileKey(originalName: string, folder: string = 'uploads'): string {
    const timestamp = Date.now();
    const randomString = randomBytes(8).toString('hex');
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    const sanitized = baseName.replace(/[^a-zA-Z0-9-_]/g, '_');
    
    return `${folder}/${timestamp}-${randomString}-${sanitized}${extension}`;
  }

  /**
   * Upload file to S3
   */
  async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    folder: string = 'uploads'
  ): Promise<UploadResult> {
    const key = this.generateFileKey(originalName, folder);

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      Metadata: {
        originalName,
        uploadedAt: new Date().toISOString(),
      },
    });

    await this.s3Client.send(command);

    const location = `${process.env.S3_ENDPOINT || 'http://localhost:4566'}/${this.bucket}/${key}`;

    return {
      key,
      bucket: this.bucket,
      location,
      size: buffer.length,
    };
  }

  /**
   * Get file from S3
   */
  async getFile(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const response = await this.s3Client.send(command);
    const stream = response.Body as any;
    
    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    
    return Buffer.concat(chunks);
  }

  /**
   * Delete file from S3
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  /**
   * Get file URL (for LocalStack)
   */
  getFileUrl(key: string): string {
    return `${process.env.S3_ENDPOINT || 'http://localhost:4566'}/${this.bucket}/${key}`;
  }
}

export const s3StorageService = new S3StorageService();

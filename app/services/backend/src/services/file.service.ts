import { db } from '../db';
import { files } from '../db/schema';
import { eq, isNull, and } from 'drizzle-orm';
import { s3StorageService } from './storage.service';
import type { CreateFileInput, UpdateFileInput } from '../schemas';

// Allowed file types
const ALLOWED_MIME_TYPES = {
  // Images
  'image/jpeg': { extension: '.jpg', maxSize: 10 * 1024 * 1024 }, // 10MB
  'image/jpg': { extension: '.jpg', maxSize: 10 * 1024 * 1024 },
  'image/png': { extension: '.png', maxSize: 10 * 1024 * 1024 },
  'image/gif': { extension: '.gif', maxSize: 5 * 1024 * 1024 },
  'image/webp': { extension: '.webp', maxSize: 10 * 1024 * 1024 },
  
  // Videos
  'video/mp4': { extension: '.mp4', maxSize: 100 * 1024 * 1024 }, // 100MB
  'video/mpeg': { extension: '.mpeg', maxSize: 100 * 1024 * 1024 },
  'video/quicktime': { extension: '.mov', maxSize: 100 * 1024 * 1024 },
  'video/x-msvideo': { extension: '.avi', maxSize: 100 * 1024 * 1024 },
  'video/webm': { extension: '.webm', maxSize: 100 * 1024 * 1024 },
  
  // Audio
  'audio/mpeg': { extension: '.mp3', maxSize: 20 * 1024 * 1024 }, // 20MB
  'audio/mp3': { extension: '.mp3', maxSize: 20 * 1024 * 1024 },
  'audio/wav': { extension: '.wav', maxSize: 20 * 1024 * 1024 },
  'audio/ogg': { extension: '.ogg', maxSize: 20 * 1024 * 1024 },
  'audio/webm': { extension: '.webm', maxSize: 20 * 1024 * 1024 },
  'audio/x-m4a': { extension: '.m4a', maxSize: 20 * 1024 * 1024 },
};

export interface FileUpload {
  buffer: Buffer;
  filename: string;
  mimetype: string;
}

export class FileService {
  /**
   * Validate file type
   */
  validateFileType(mimetype: string): boolean {
    return mimetype in ALLOWED_MIME_TYPES;
  }

  /**
   * Validate file size
   */
  validateFileSize(size: number, mimetype: string): boolean {
    const config = ALLOWED_MIME_TYPES[mimetype as keyof typeof ALLOWED_MIME_TYPES];
    if (!config) return false;
    return size <= config.maxSize;
  }

  /**
   * Get file category from mimetype
   */
  getFileCategory(mimetype: string): 'image' | 'video' | 'audio' | 'unknown' {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    if (mimetype.startsWith('audio/')) return 'audio';
    return 'unknown';
  }

  /**
   * Upload file to S3 and create database record
   */
  async uploadFile(fileData: FileUpload, reportId?: number) {
    const { buffer, filename, mimetype } = fileData;

    // Validate file type
    if (!this.validateFileType(mimetype)) {
      throw new Error(`File type not allowed: ${mimetype}`);
    }

    // Validate file size
    if (!this.validateFileSize(buffer.length, mimetype)) {
      const config = ALLOWED_MIME_TYPES[mimetype as keyof typeof ALLOWED_MIME_TYPES];
      throw new Error(`File size exceeds limit of ${config.maxSize / (1024 * 1024)}MB`);
    }

    // Determine folder based on file type
    const category = this.getFileCategory(mimetype);
    const folder = `${category}s`; // images, videos, audios

    // Upload to S3
    const uploadResult = await s3StorageService.uploadFile(buffer, filename, mimetype, folder);

    // Create database record
    const [file] = await db
      .insert(files)
      .values({
        name: filename,
        type: mimetype,
        size: buffer.length,
        storageType: 's3',
      })
      .returning();

    return {
      ...file,
      url: uploadResult.location,
      s3Key: uploadResult.key,
    };
  }

  /**
   * Get file by ID
   */
  async getFileById(id: number) {
    const file = await db.query.files.findFirst({
      where: and(eq(files.id, id), isNull(files.deletedAt)),
    });

    if (!file) {
      return null;
    }

    return file;
  }

  /**
   * Download file from S3
   */
  async downloadFile(id: number): Promise<{ buffer: Buffer; file: any } | null> {
    const file = await this.getFileById(id);
    
    if (!file) {
      return null;
    }

    // For now, we'll need to store the S3 key in the database
    // This is a simplified version - in production you'd want to store the key
    throw new Error('Download functionality requires S3 key storage - will be implemented');
  }

  /**
   * Update file metadata
   */
  async updateFile(id: number, data: UpdateFileInput) {
    const [updatedFile] = await db
      .update(files)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(files.id, id), isNull(files.deletedAt)))
      .returning();

    return updatedFile;
  }

  /**
   * Soft delete file
   */
  async deleteFile(id: number) {
    const [deletedFile] = await db
      .update(files)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(files.id, id), isNull(files.deletedAt)))
      .returning();

    return deletedFile;
  }

  /**
   * List files with pagination
   */
  async listFiles(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const filesList = await db.query.files.findMany({
      where: isNull(files.deletedAt),
      limit,
      offset,
    });

    const [{ count }] = await db
      .select({ count: files.id })
      .from(files)
      .where(isNull(files.deletedAt));

    return {
      data: filesList,
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
      },
    };
  }

  /**
   * Get allowed file types info
   */
  getAllowedFileTypes() {
    return Object.entries(ALLOWED_MIME_TYPES).map(([mimetype, config]) => ({
      mimetype,
      extension: config.extension,
      maxSize: config.maxSize,
      maxSizeMB: config.maxSize / (1024 * 1024),
      category: this.getFileCategory(mimetype),
    }));
  }
}

export const fileService = new FileService();

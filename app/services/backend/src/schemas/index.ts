import { ReportCategory } from 'db/schema';
import { z } from 'zod';

// User Schemas
export const createUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(255),
  lastName: z.string().min(1, 'Last name is required').max(255),
  cpf: z.string().length(11, 'CPF must be 11 digits').regex(/^\d+$/, 'CPF must contain only numbers'),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Birthdate must be in YYYY-MM-DD format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  motherName: z.string().max(255).optional(),
  active: z.boolean().optional().default(true),
});

export const updateUserSchema = createUserSchema.partial();

export const userIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// File Schemas
export const createFileSchema = z.object({
  name: z.string().min(1, 'File name is required').max(255),
  type: z.string().min(1, 'File type is required').max(100),
  size: z.number().int().positive('File size must be positive'),
  storageType: z.enum(['local', 's3', 'azure', 'gcs']).default('local'),
});

export const updateFileSchema = createFileSchema.partial();

export const fileIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Report Schemas
export const reportCategoryEnum = z.enum([ReportCategory.SUGGESTION, ReportCategory.ISSUE, ReportCategory.APPRECIATION, ReportCategory.COMPLAINT]);

export const createReportSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: reportCategoryEnum,
  aditionalInfo: z.array(z.string()).optional().default([]),
  userId: z.number().int().positive().optional(),
  fileIds: z.array(z.number().int().positive()).optional().default([]),
});

export const updateReportSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  category: reportCategoryEnum.optional(),
  aditionalInfo: z.array(z.string()).optional(),
  userId: z.number().int().positive().optional().nullable(),
});

export const reportIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const reportCodeSchema = z.object({
  code: z.string().length(6, 'Code must be exactly 6 characters').regex(/^[A-Z0-9]{6}$/, 'Code must contain only uppercase letters and numbers'),
});

export const listReportsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  userId: z.coerce.number().int().positive().optional(),
  category: reportCategoryEnum.optional(),
});

// Report File Schemas
export const addFileToReportSchema = z.object({
  reportId: z.number().int().positive(),
  fileId: z.number().int().positive(),
});

export const removeFileFromReportSchema = z.object({
  reportId: z.coerce.number().int().positive(),
  fileId: z.coerce.number().int().positive(),
});

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateFileInput = z.infer<typeof createFileSchema>;
export type UpdateFileInput = z.infer<typeof updateFileSchema>;
export type CreateReportInput = z.infer<typeof createReportSchema>;
export type UpdateReportInput = z.infer<typeof updateReportSchema>;
export type ListReportsQuery = z.infer<typeof listReportsQuerySchema>;
export type AddFileToReportInput = z.infer<typeof addFileToReportSchema>;
export type RemoveFileFromReportInput = z.infer<typeof removeFileFromReportSchema>;

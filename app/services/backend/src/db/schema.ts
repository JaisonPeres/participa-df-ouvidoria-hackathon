import { pgTable, serial, text, timestamp, integer, varchar, boolean, date, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export enum ReportCategory {
  SUGGESTION = 'SUGGESTION',
  ISSUE = 'ISSUE',
  APPRECIATION = 'APPRECIATION',
  COMPLAINT = 'COMPLAINT',
}

// Report Category Enum
export const reportCategoryEnum = pgEnum('report_category', [ReportCategory.SUGGESTION, ReportCategory.ISSUE, ReportCategory.APPRECIATION, ReportCategory.COMPLAINT]);

// User Entity
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  cpf: varchar('cpf', { length: 11 }).notNull().unique(),
  birthdate: date('birthdate').notNull(),
  password: text('password').notNull(),
  motherName: varchar('mother_name', { length: 255 }),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

// File Entity
export const files = pgTable('files', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 100 }).notNull(), // mime type
  size: integer('size').notNull(), // size in bytes
  storageType: varchar('storage_type', { length: 50 }).notNull().default('local'), // local, s3, etc.
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

// Report Entity
export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 6 }).notNull().unique(), // 6-digit alphanumeric code
  description: text('description').notNull(),
  category: reportCategoryEnum('category').notNull(),
  aditionalInfo: jsonb('aditional_info').$type<string[]>().default([]), // Array of strings
  userId: integer('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

// Report File (Junction table for Report <-> File many-to-many relationship)
export const reportFiles = pgTable('report_files', {
  id: serial('id').primaryKey(),
  reportId: integer('report_id').notNull().references(() => reports.id, { onDelete: 'cascade' }),
  fileId: integer('file_id').notNull().references(() => files.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  reports: many(reports),
}));

export const reportsRelations = relations(reports, ({ one, many }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
  reportFiles: many(reportFiles),
}));

export const filesRelations = relations(files, ({ many }) => ({
  reportFiles: many(reportFiles),
}));

export const reportFilesRelations = relations(reportFiles, ({ one }) => ({
  report: one(reports, {
    fields: [reportFiles.reportId],
    references: [reports.id],
  }),
  file: one(files, {
    fields: [reportFiles.fileId],
    references: [files.id],
  }),
}));

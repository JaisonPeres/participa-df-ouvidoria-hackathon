import { db } from '../db';
import { reports, reportFiles, files } from '../db/schema';
import { eq, isNull, and, desc } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import type { CreateReportInput, UpdateReportInput, ListReportsQuery } from '../schemas';

export class ReportService {
  /**
   * Generate a unique 6-character alphanumeric code using crypto
   */
  private generateReportCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const bytes = randomBytes(6);
    let code = '';
    
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(bytes[i] % chars.length);
    }
    
    return code;
  }

  /**
   * Generate a unique code that doesn't exist in the database
   */
  private async generateUniqueCode(): Promise<string> {
    let code = this.generateReportCode();
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const existing = await db.query.reports.findFirst({
        where: eq(reports.code, code),
      });

      if (!existing) {
        return code;
      }

      code = this.generateReportCode();
      attempts++;
    }

    throw new Error('Failed to generate unique code after multiple attempts');
  }

  /**
   * Create a new report
   */
  async createReport(data: CreateReportInput) {
    const { fileIds = [], ...reportData } = data;

    // Generate unique code
    const code = await this.generateUniqueCode();

    // Insert report
    const [report] = await db
      .insert(reports)
      .values({
        ...reportData,
        code,
      })
      .returning();

    // If fileIds provided, link files to report
    if (fileIds.length > 0) {
      await db.insert(reportFiles).values(
        fileIds.map((fileId) => ({
          reportId: report.id,
          fileId,
        }))
      );
    }

    // Return report with files
    return this.getReportById(report.id);
  }

  /**
   * Get report by ID with relations
   */
  async getReportById(id: number) {
    const report = await db.query.reports.findFirst({
      where: and(eq(reports.id, id), isNull(reports.deletedAt)),
      with: {
        user: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            cpf: true,
          },
        },
        reportFiles: {
          where: isNull(reportFiles.deletedAt),
          with: {
            file: true,
          },
        },
      },
    });

    if (!report) {
      return null;
    }

    // Transform the response to include files directly, filtering out deleted files
    return {
      ...report,
      files: report.reportFiles
        .map((rf) => rf.file)
        .filter((file) => !file.deletedAt),
      reportFiles: undefined, // Remove intermediate table
    };
  }

  /**
   * Get report by code with relations
   */
  async getReportByCode(code: string) {
    const report = await db.query.reports.findFirst({
      where: and(eq(reports.code, code.toUpperCase()), isNull(reports.deletedAt)),
      with: {
        user: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            cpf: true,
          },
        },
        reportFiles: {
          where: isNull(reportFiles.deletedAt),
          with: {
            file: true,
          },
        },
      },
    });

    if (!report) {
      return null;
    }

    // Transform the response to include files directly, filtering out deleted files
    return {
      ...report,
      files: report.reportFiles
        .map((rf) => rf.file)
        .filter((file) => !file.deletedAt),
      reportFiles: undefined, // Remove intermediate table
    };
  }

  /**
   * List reports with pagination and filters
   */
  async listReports(query: ListReportsQuery) {
    const { page = 1, limit = 10, userId, category } = query;
    const offset = (page - 1) * limit;

    const conditions = [isNull(reports.deletedAt)];
    if (userId) {
      conditions.push(eq(reports.userId, userId));
    }
    if (category) {
      conditions.push(eq(reports.category, category));
    }

    const reportsList = await db.query.reports.findMany({
      where: and(...conditions),
      limit,
      offset,
      orderBy: [desc(reports.createdAt)],
      with: {
        user: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        reportFiles: {
          where: isNull(reportFiles.deletedAt),
          with: {
            file: {
              columns: {
                id: true,
                name: true,
                type: true,
                size: true,
                deletedAt: true,
              },
            },
          },
        },
      },
    });

    // Transform the response and filter out deleted files
    const transformedReports = reportsList.map((report) => ({
      ...report,
      files: report.reportFiles
        .map((rf) => rf.file)
        .filter((file) => !file.deletedAt)
        .map(({ deletedAt: _deletedAt, ...file }) => file), // Remove deletedAt from response
      reportFiles: undefined,
    }));

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: reports.id })
      .from(reports)
      .where(and(...conditions));

    return {
      data: transformedReports,
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
      },
    };
  }

  /**
   * Update a report
   */
  async updateReport(id: number, data: UpdateReportInput) {
    const [updatedReport] = await db
      .update(reports)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(reports.id, id), isNull(reports.deletedAt)))
      .returning();

    if (!updatedReport) {
      return null;
    }

    return this.getReportById(id);
  }

  /**
   * Soft delete a report
   */
  async deleteReport(id: number) {
    const [deletedReport] = await db
      .update(reports)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(reports.id, id), isNull(reports.deletedAt)))
      .returning();

    return deletedReport;
  }

  /**
   * Add a file to a report
   */
  async addFileToReport(reportId: number, fileId: number) {
    // Check if report exists
    const report = await db.query.reports.findFirst({
      where: and(eq(reports.id, reportId), isNull(reports.deletedAt)),
    });

    if (!report) {
      throw new Error('Report not found');
    }

    // Check if file exists
    const file = await db.query.files.findFirst({
      where: and(eq(files.id, fileId), isNull(files.deletedAt)),
    });

    if (!file) {
      throw new Error('File not found');
    }

    // Check if relation already exists
    const existingRelation = await db.query.reportFiles.findFirst({
      where: and(
        eq(reportFiles.reportId, reportId),
        eq(reportFiles.fileId, fileId),
        isNull(reportFiles.deletedAt)
      ),
    });

    if (existingRelation) {
      throw new Error('File already added to this report');
    }

    // Create relation
    const [reportFile] = await db
      .insert(reportFiles)
      .values({
        reportId,
        fileId,
      })
      .returning();

    return reportFile;
  }

  /**
   * Remove a file from a report (soft delete)
   */
  async removeFileFromReport(reportId: number, fileId: number) {
    const [deletedRelation] = await db
      .update(reportFiles)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(reportFiles.reportId, reportId),
          eq(reportFiles.fileId, fileId),
          isNull(reportFiles.deletedAt)
        )
      )
      .returning();

    if (!deletedRelation) {
      throw new Error('File relation not found');
    }

    return deletedRelation;
  }

  /**
   * Get all files for a report
   */
  async getReportFiles(reportId: number) {
    const report = await db.query.reports.findFirst({
      where: and(eq(reports.id, reportId), isNull(reports.deletedAt)),
      with: {
        reportFiles: {
          where: isNull(reportFiles.deletedAt),
          with: {
            file: true,
          },
        },
      },
    });

    if (!report) {
      return null;
    }

    return report.reportFiles
      .map((rf) => rf.file)
      .filter((file) => !file.deletedAt);
  }
}

export const reportService = new ReportService();

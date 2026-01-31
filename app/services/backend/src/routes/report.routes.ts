import type { FastifyInstance } from 'fastify';
import { reportService } from '../services/report.service';
import {
  createReportSchema,
  updateReportSchema,
  reportIdSchema,
  reportCodeSchema,
  listReportsQuerySchema,
} from '../schemas';
import { zodToJsonSchema } from 'zod-to-json-schema';

export async function reportRoutes(fastify: FastifyInstance) {
  // Create a report
  fastify.post(
    '/reports',
    {
      schema: {
        description: 'Create a new report',
        tags: ['reports'],
        body: zodToJsonSchema(createReportSchema),
        response: {
          201: {
            description: 'Report created successfully',
            type: 'object',
            properties: {
              id: { type: 'number' },
              description: { type: 'string' },
              userId: { type: ['number', 'null'] },
              createdAt: { type: 'string' },
              updatedAt: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const body = createReportSchema.parse(request.body);
        const report = await reportService.createReport(body);
        return reply.code(201).send(report);
      } catch (error: any) {
        if (error.name === 'ZodError') {
          return reply.code(400).send({
            error: 'Validation error',
            details: error.errors,
          });
        }
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Get report by ID
  fastify.get(
    '/reports/:id',
    {
      schema: {
        description: 'Get a report by ID',
        tags: ['reports'],
        params: zodToJsonSchema(reportIdSchema),
        response: {
          200: {
            description: 'Report found',
            type: 'object',
          },
          404: {
            description: 'Report not found',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = reportIdSchema.parse(request.params);
        const report = await reportService.getReportById(id);

        if (!report) {
          return reply.code(404).send({ error: 'Report not found' });
        }

        return reply.send(report);
      } catch (error: any) {
        if (error.name === 'ZodError') {
          return reply.code(400).send({
            error: 'Validation error',
            details: error.errors,
          });
        }
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  // List reports with pagination
  fastify.get(
    '/reports',
    {
      onRequest: [fastify.authenticate],
      schema: {
        description: 'List reports with pagination (requires authentication)',
        tags: ['reports'],
        security: [{ bearerAuth: [] }],
        querystring: zodToJsonSchema(listReportsQuerySchema),
        response: {
          200: {
            description: 'List of reports',
            type: 'object',
            properties: {
              data: { type: 'array' },
              pagination: {
                type: 'object',
                properties: {
                  page: { type: 'number' },
                  limit: { type: 'number' },
                  total: { type: 'number' },
                  totalPages: { type: 'number' },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const query = listReportsQuerySchema.parse(request.query);
        const result = await reportService.listReports(query);
        return reply.send(result);
      } catch (error: any) {
        if (error.name === 'ZodError') {
          return reply.code(400).send({
            error: 'Validation error',
            details: error.errors,
          });
        }
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Get report by code
  fastify.get(
    '/reports/code/:code',
    {
      schema: {
        description: 'Get a report by its 6-digit code',
        tags: ['reports'],
        params: zodToJsonSchema(reportCodeSchema),
        response: {
          200: {
            description: 'Report found',
            type: 'object',
          },
          404: {
            description: 'Report not found',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { code } = reportCodeSchema.parse(request.params);
        const report = await reportService.getReportByCode(code);

        if (!report) {
          return reply.code(404).send({ error: 'Report not found' });
        }

        return reply.send(report);
      } catch (error: any) {
        if (error.name === 'ZodError') {
          return reply.code(400).send({
            error: 'Validation error',
            details: error.errors,
          });
        }
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Update report
  fastify.patch(
    '/reports/:id',
    {
      schema: {
        description: 'Update a report',
        tags: ['reports'],
        params: zodToJsonSchema(reportIdSchema),
        body: zodToJsonSchema(updateReportSchema),
        response: {
          200: {
            description: 'Report updated successfully',
            type: 'object',
          },
          404: {
            description: 'Report not found',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = reportIdSchema.parse(request.params);
        const body = updateReportSchema.parse(request.body);
        const report = await reportService.updateReport(id, body);

        if (!report) {
          return reply.code(404).send({ error: 'Report not found' });
        }

        return reply.send(report);
      } catch (error: any) {
        if (error.name === 'ZodError') {
          return reply.code(400).send({
            error: 'Validation error',
            details: error.errors,
          });
        }
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Delete report (soft delete)
  fastify.delete(
    '/reports/:id',
    {
      schema: {
        description: 'Delete a report (soft delete)',
        tags: ['reports'],
        params: zodToJsonSchema(reportIdSchema),
        response: {
          200: {
            description: 'Report deleted successfully',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
          404: {
            description: 'Report not found',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = reportIdSchema.parse(request.params);
        const report = await reportService.deleteReport(id);

        if (!report) {
          return reply.code(404).send({ error: 'Report not found' });
        }

        return reply.send({ message: 'Report deleted successfully' });
      } catch (error: any) {
        if (error.name === 'ZodError') {
          return reply.code(400).send({
            error: 'Validation error',
            details: error.errors,
          });
        }
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Add file to report
  fastify.post(
    '/reports/:reportId/files/:fileId',
    {
      schema: {
        description: 'Add a file to a report',
        tags: ['reports'],
        params: {
          type: 'object',
          properties: {
            reportId: { type: 'number' },
            fileId: { type: 'number' },
          },
        },
        response: {
          201: {
            description: 'File added to report successfully',
            type: 'object',
          },
          400: {
            description: 'Bad request',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const params = request.params as { reportId: string; fileId: string };
        const reportId = parseInt(params.reportId);
        const fileId = parseInt(params.fileId);

        const reportFile = await reportService.addFileToReport(reportId, fileId);
        return reply.code(201).send(reportFile);
      } catch (error: any) {
        fastify.log.error(error);
        return reply.code(400).send({ error: error.message });
      }
    }
  );

  // Remove file from report
  fastify.delete(
    '/reports/:reportId/files/:fileId',
    {
      schema: {
        description: 'Remove a file from a report',
        tags: ['reports'],
        params: {
          type: 'object',
          properties: {
            reportId: { type: 'number' },
            fileId: { type: 'number' },
          },
        },
        response: {
          200: {
            description: 'File removed from report successfully',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
          400: {
            description: 'Bad request',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const params = request.params as { reportId: string; fileId: string };
        const reportId = parseInt(params.reportId);
        const fileId = parseInt(params.fileId);

        await reportService.removeFileFromReport(reportId, fileId);
        return reply.send({ message: 'File removed from report successfully' });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.code(400).send({ error: error.message });
      }
    }
  );

  // Get all files for a report
  fastify.get(
    '/reports/:id/files',
    {
      schema: {
        description: 'Get all files for a report',
        tags: ['reports'],
        params: zodToJsonSchema(reportIdSchema),
        response: {
          200: {
            description: 'List of files',
            type: 'array',
          },
          404: {
            description: 'Report not found',
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = reportIdSchema.parse(request.params);
        const files = await reportService.getReportFiles(id);

        if (!files) {
          return reply.code(404).send({ error: 'Report not found' });
        }

        return reply.send(files);
      } catch (error: any) {
        if (error.name === 'ZodError') {
          return reply.code(400).send({
            error: 'Validation error',
            details: error.errors,
          });
        }
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );
}

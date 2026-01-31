import type { FastifyInstance } from 'fastify';
import { fileService } from '../services/file.service';

export async function fileRoutes(fastify: FastifyInstance) {
  // Upload file
  fastify.post(
    '/files/upload',
    {
      schema: {
        description: 'Upload a file (image, video, or audio)',
        tags: ['files'],
        consumes: ['multipart/form-data'],
        response: {
          201: {
            description: 'File uploaded successfully',
            type: 'object',
            properties: {
              id: { type: 'number' },
              name: { type: 'string' },
              type: { type: 'string' },
              size: { type: 'number' },
              storageType: { type: 'string' },
              url: { type: 'string' },
              s3Key: { type: 'string' },
            },
          },
          400: {
            description: 'Invalid file',
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
        const data = await request.file();

        if (!data) {
          return reply.code(400).send({ error: 'No file provided' });
        }

        const buffer = await data.toBuffer();
        const filename = data.filename;
        const mimetype = data.mimetype;

        const result = await fileService.uploadFile({
          buffer,
          filename,
          mimetype,
        });

        return reply.code(201).send(result);
      } catch (error: any) {
        fastify.log.error(error);
        return reply.code(400).send({ error: error.message });
      }
    }
  );

  // Get file by ID
  fastify.get(
    '/files/:id',
    {
      schema: {
        description: 'Get file metadata by ID',
        tags: ['files'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'number' },
          },
        },
        response: {
          200: {
            description: 'File found',
            type: 'object',
          },
          404: {
            description: 'File not found',
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
        const params = request.params as { id: string };
        const id = parseInt(params.id);
        const file = await fileService.getFileById(id);

        if (!file) {
          return reply.code(404).send({ error: 'File not found' });
        }

        return reply.send(file);
      } catch (error: any) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  // List files
  fastify.get(
    '/files',
    {
      schema: {
        description: 'List files with pagination',
        tags: ['files'],
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', default: 1 },
            limit: { type: 'number', default: 20 },
          },
        },
        response: {
          200: {
            description: 'List of files',
            type: 'object',
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const query = request.query as { page?: number; limit?: number };
        const result = await fileService.listFiles(query.page, query.limit);
        return reply.send(result);
      } catch (error: any) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Delete file
  fastify.delete(
    '/files/:id',
    {
      schema: {
        description: 'Delete a file (soft delete)',
        tags: ['files'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'number' },
          },
        },
        response: {
          200: {
            description: 'File deleted successfully',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
          404: {
            description: 'File not found',
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
        const params = request.params as { id: string };
        const id = parseInt(params.id);
        const file = await fileService.deleteFile(id);

        if (!file) {
          return reply.code(404).send({ error: 'File not found' });
        }

        return reply.send({ message: 'File deleted successfully' });
      } catch (error: any) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Get allowed file types
  fastify.get(
    '/files/allowed-types',
    {
      schema: {
        description: 'Get list of allowed file types and size limits',
        tags: ['files'],
        response: {
          200: {
            description: 'List of allowed file types',
            type: 'array',
          },
        },
      },
    },
    async (_request, reply) => {
      const allowedTypes = fileService.getAllowedFileTypes();
      return reply.send(allowedTypes);
    }
  );
}

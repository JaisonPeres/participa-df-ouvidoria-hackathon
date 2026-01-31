import { FastifyInstance } from 'fastify';
import { reportRoutes } from './report.routes';

export async function healthRoutes(fastify: FastifyInstance) {
  // Health check route
  fastify.get(
    '/health',
    {
      schema: {
        description: 'Health check endpoint',
        tags: ['health'],
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              status: { type: 'string' },
              timestamp: { type: 'string' },
            },
          },
        },
      },
    },
    async (_request, reply) => {
      const response = {
        status: 'ok',
        timestamp: new Date().toISOString(),
      };

      return reply.code(200).send(response);
    }
  );

  // Example route
  fastify.get(
    '/api/hello',
    {
      schema: {
        description: 'Example hello endpoint',
        tags: ['example'],
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (_request, reply) => {
      return reply.code(200).send({ message: 'Hello from Participa DF API!' });
    }
  );
}

// Register all routes
export async function registerRoutes(fastify: FastifyInstance) {
  await healthRoutes(fastify);
  await fastify.register(reportRoutes, { prefix: '/api' });
}


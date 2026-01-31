import { FastifyInstance } from 'fastify';
import { reportRoutes } from './report.routes';
import { fileRoutes } from './file.routes';
import { authRoutes } from './auth.routes';

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
}

// Register all routes
export async function registerRoutes(fastify: FastifyInstance) {
  await healthRoutes(fastify);
  await fastify.register(authRoutes, { prefix: '/api' });
  await fastify.register(reportRoutes, { prefix: '/api' });
  await fastify.register(fileRoutes, { prefix: '/api' });
}


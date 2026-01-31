import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import multipart from '@fastify/multipart';
import jwt from '@fastify/jwt';
import { registerRoutes } from './routes';

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
  bodyLimit: 104857600, // 100MB for file uploads
});

async function start() {
  try {
    // Register CORS
    await fastify.register(cors, {
      origin: true,
    });

    // Register JWT
    await fastify.register(jwt, {
      secret: process.env.JWT_SECRET || 'supersecretkey-change-in-production',
    });

    // Add authentication decorator
    fastify.decorate('authenticate', async function (request: any, reply: any) {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(401).send({ error: 'Unauthorized' });
      }
    });

    // Register multipart for file uploads
    await fastify.register(multipart, {
      limits: {
        fileSize: 104857600, // 100MB max file size
      },
    });

    // Register Swagger
    await fastify.register(swagger, {
      swagger: {
        info: {
          title: 'Participa DF API',
          description: 'API documentation for Participa DF Ouvidoria',
          version: '1.0.0',
        },
        host: `localhost:${PORT}`,
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
          { name: 'health', description: 'Health check endpoints' },
          { name: 'auth', description: 'Authentication endpoints' },
          { name: 'reports', description: 'Report management endpoints' },
          { name: 'files', description: 'File upload and management endpoints' },
        ],
        securityDefinitions: {
          bearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'Enter your bearer token in the format: Bearer {token}',
          },
        },
      },
    });

    // Register Swagger UI
    await fastify.register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false,
      },
    });

    // Register all routes
    await fastify.register(registerRoutes);

    // Start server
    await fastify.listen({ port: PORT, host: HOST });

    console.log(`
🚀 Server is running!
📝 API Documentation: http://localhost:${PORT}/docs
🏥 Health check: http://localhost:${PORT}/health
🔐 Auth API: http://localhost:${PORT}/api/auth
📊 Reports API: http://localhost:${PORT}/api/reports
📁 Files API: http://localhost:${PORT}/api/files
    `);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Handle shutdown gracefully
const closeGracefully = async (signal: string) => {
  console.log(`\nReceived signal to terminate: ${signal}`);
  await fastify.close();
  process.exit(0);
};

process.on('SIGINT', () => closeGracefully('SIGINT'));
process.on('SIGTERM', () => closeGracefully('SIGTERM'));

start();

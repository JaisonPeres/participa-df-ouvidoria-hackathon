import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { healthRoutes } from './routes';

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

async function start() {
  try {
    // Register CORS
    await fastify.register(cors, {
      origin: true,
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
          { name: 'example', description: 'Example endpoints' },
        ],
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

    // Register routes
    await fastify.register(healthRoutes);

    // Start server
    await fastify.listen({ port: PORT, host: HOST });

    console.log(`
🚀 Server is running!
📝 API Documentation: http://localhost:${PORT}/docs
🏥 Health check: http://localhost:${PORT}/health
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

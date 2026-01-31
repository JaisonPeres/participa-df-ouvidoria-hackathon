import type { FastifyInstance } from 'fastify';
import { authService } from '../services/auth.service';
import { signupSchema, signinSchema } from '../schemas';
import { zodToJsonSchema } from 'zod-to-json-schema';

export async function authRoutes(fastify: FastifyInstance) {
  // Sign up
  fastify.post(
    '/auth/signup',
    {
      schema: {
        description: 'Register a new user',
        tags: ['auth'],
        body: zodToJsonSchema(signupSchema),
        response: {
          201: {
            description: 'User created successfully',
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: ['string', 'null'] },
                  cpf: { type: 'string' },
                  birthdate: { type: 'string' },
                  motherName: { type: ['string', 'null'] },
                  active: { type: 'boolean' },
                  createdAt: { type: 'string' },
                },
              },
              token: { type: 'string' },
            },
          },
          400: {
            description: 'Validation error or user already exists',
            type: 'object',
            properties: {
              error: { type: 'string' },
              details: { type: 'array' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const body = signupSchema.parse(request.body);
        const user = await authService.signup(body);

        // Generate JWT token
        const token = fastify.jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          {
            expiresIn: '7d',
          }
        );

        return reply.code(201).send({
          user,
          token,
        });
      } catch (error: any) {
        if (error.name === 'ZodError') {
          return reply.code(400).send({
            error: 'Validation error',
            details: error.errors,
          });
        }
        fastify.log.error(error);
        return reply.code(400).send({ error: error.message });
      }
    }
  );

  // Sign in
  fastify.post(
    '/auth/signin',
    {
      schema: {
        description: 'Sign in with email and password',
        tags: ['auth'],
        body: zodToJsonSchema(signinSchema),
        response: {
          200: {
            description: 'User signed in successfully',
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: ['string', 'null'] },
                  cpf: { type: 'string' },
                  birthdate: { type: 'string' },
                  motherName: { type: ['string', 'null'] },
                  active: { type: 'boolean' },
                  createdAt: { type: 'string' },
                },
              },
              token: { type: 'string' },
            },
          },
          400: {
            description: 'Validation error',
            type: 'object',
            properties: {
              error: { type: 'string' },
              details: { type: 'array' },
            },
          },
          401: {
            description: 'Invalid credentials',
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
        const body = signinSchema.parse(request.body);
        const user = await authService.signin(body);

        // Generate JWT token
        const token = fastify.jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          {
            expiresIn: '7d',
          }
        );

        return reply.send({
          user,
          token,
        });
      } catch (error: any) {
        if (error.name === 'ZodError') {
          return reply.code(400).send({
            error: 'Validation error',
            details: error.errors,
          });
        }
        fastify.log.error(error);
        return reply.code(401).send({ error: error.message });
      }
    }
  );

  // Get current user (requires authentication)
  fastify.get(
    '/auth/me',
    {
      onRequest: [fastify.authenticate],
      schema: {
        description: 'Get current authenticated user',
        tags: ['auth'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'Current user',
            type: 'object',
            properties: {
              id: { type: 'number' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              email: { type: 'string' },
              phone: { type: ['string', 'null'] },
              cpf: { type: 'string' },
              birthdate: { type: 'string' },
              motherName: { type: ['string', 'null'] },
              active: { type: 'boolean' },
              createdAt: { type: 'string' },
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
        const userId = (request.user as any).id;
        const user = await authService.getUserById(userId);

        if (!user) {
          return reply.code(404).send({ error: 'User not found' });
        }

        return reply.send(user);
      } catch (error: any) {
        fastify.log.error(error);
        return reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );
}

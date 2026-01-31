# Backend Service

Backend service built with Fastify, Drizzle ORM, and TypeScript.

## Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Install dependencies from the root:
```bash
pnpm install
```

## Development

```bash
# Start dev server
pnpm dev

# Run tests
pnpm test

# Lint code
pnpm lint
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:3001/docs
- Health check: http://localhost:3001/health

## Database

This project uses Drizzle ORM. Define your schemas in `src/db/schema.ts`.

```bash
# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio
```

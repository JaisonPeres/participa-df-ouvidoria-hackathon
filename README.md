# Participa DF - Ouvidoria Hackathon

Monorepo project for Participa DF Ouvidoria using Turborepo, pnpm, and modern web technologies.

## 🏗️ Project Structure

```
.
├── app/
│   ├── frontends/
│   │   └── pwa-front/          # PWA Frontend (React + Vite)
│   └── services/
│       └── backend/            # Backend API (Fastify + Drizzle ORM)
├── packages/
│   ├── eslint-config/          # Shared ESLint configurations
│   └── typescript-config/      # Shared TypeScript configurations
├── docker-compose.yml          # Docker services (PostgreSQL)
└── turbo.json                  # Turborepo configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Docker and Docker Compose

### Easy Start (Recommended)

**One command to start everything:**
```bash
pnpm start
```

This will automatically:
- ✅ Install pnpm if needed
- ✅ Install all dependencies
- ✅ Create .env files from examples
- ✅ Start Docker services (PostgreSQL + PgAdmin)
- ✅ Wait for database to be ready
- ✅ Start development servers (frontend + backend)

The command will keep running with your dev servers. Press `Ctrl+C` to stop.

### Manual Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Setup environment files:**
   ```bash
   pnpm env:setup
   ```

3. **Start Docker services:**
   ```bash
   pnpm docker:up
   ```

4. **Start development servers:**
   ```bash
   pnpm dev
   ```

## 📦 Available Commands

### Setup & Start
```bash
# Start everything (setup + dev servers) - ONE COMMAND!
pnpm start

# Alternative: Manual steps
pnpm install            # Install dependencies
pnpm env:setup          # Create .env files
pnpm docker:up          # Start Docker services
pnpm dev                # Start dev servers only
```

### Development
```bash
# Start all apps in development mode
pnpm dev

# Build all apps
pnpm build

# Run tests across all apps
pnpm test

# Lint all code
pnpm lint

# Format code
pnpm format

# Clean all build outputs and node_modules
pnpm clean
```

### Docker Management
```bash
# Start Docker services
pnpm docker:up

# Stop Docker services
pnpm docker:down

# View Docker logs
pnpm docker:logs
```

### Backend Commands

```bash
cd app/services/backend

# Start dev server (http://localhost:3001)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test

# Generate Drizzle migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio
```

### Frontend Commands

```bash
cd app/frontends/pwa-front

# Start dev server (http://localhost:3000)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test
```

## 🔧 Tech Stack

### Backend
- **Framework:** Fastify
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL
- **Validation:** Zod
- **Documentation:** Swagger/OpenAPI
- **Testing:** Vitest

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **PWA:** vite-plugin-pwa with Workbox
- **Routing:** React Router
- **Testing:** Vitest
- **Styling:** CSS Modules

### Shared
- **Package Manager:** pnpm
- **Monorepo:** Turborepo
- **Language:** TypeScript
- **Code Quality:** ESLint + Prettier

## 🐳 Docker Services

The project includes the following Docker services:

### PostgreSQL Database
- **Port:** 5432
- **User:** postgres
- **Password:** postgres
- **Database:** participa_df

### PgAdmin
- **Port:** 5050
- **Email:** admin@participa-df.local
- **Password:** admin
- **URL:** http://localhost:5050

To connect PgAdmin to PostgreSQL:
1. Open http://localhost:5050
2. Login with the credentials above
3. Add new server:
   - Host: postgres
   - Port: 5432
   - Username: postgres
   - Password: postgres

## 📚 Documentation

### API Documentation
Once the backend is running, access Swagger UI at:
- **URL:** http://localhost:3001/docs

### API Endpoints
- `GET /health` - Health check
- `GET /api/hello` - Example endpoint

### Frontend
- **Dev Server:** http://localhost:3000
- **PWA Features:** Service worker, offline support, install prompt

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test -- --coverage
```

## 🏗️ Building for Production

```bash
# Build all apps
pnpm build

# Apps will be built to:
# - Backend: app/services/backend/dist/
# - Frontend: app/frontends/pwa-front/dist/
```

## 🔍 Project Features

### Monorepo Benefits
- ✅ Shared configuration across packages
- ✅ Consistent code style with shared ESLint config
- ✅ Unified TypeScript setup
- ✅ Fast builds with Turborepo caching
- ✅ Parallel task execution

### Backend Features
- ✅ RESTful API with Fastify
- ✅ Type-safe database queries with Drizzle ORM
- ✅ Auto-generated API documentation
- ✅ Request validation with Zod
- ✅ CORS support
- ✅ Health check endpoints

### Frontend Features
- ✅ Progressive Web App (PWA)
- ✅ Service Worker for offline support
- ✅ Auto-update notifications
- ✅ Responsive design
- ✅ Fast HMR with Vite
- ✅ Type-safe with TypeScript

## 📝 Environment Variables

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/participa_df
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Create a pull request

## 📄 License

MIT

---

**Made for Participa DF Ouvidoria Hackathon** 🇧🇷

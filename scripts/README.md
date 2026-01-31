# Setup Scripts

TypeScript-based setup scripts for Participa DF monorepo.

## Scripts

### setup.ts
Main setup script that handles the complete project initialization and starts development servers.

**Usage:**
```bash
pnpm start
```

**What it does:**
- ✅ Checks if pnpm is installed (installs if missing)
- ✅ Checks if Docker is available
- ✅ Installs all project dependencies
- ✅ Creates .env files from examples
- ✅ Starts Docker services (PostgreSQL + PgAdmin)
- ✅ Waits for database to be ready
- ✅ Automatically starts development servers (`pnpm dev`)

**Note:** The command will keep running with your dev servers. Press `Ctrl+C` to stop everything.

### setup-env.ts
Environment file setup script (creates .env files only).

**Usage:**
```bash
pnpm env:setup
```

**What it does:**
- ✅ Copies backend .env.example to .env
- ✅ Copies frontend .env.example to .env
- ✅ Skips if files already exist

## Why TypeScript?

- ✅ Type safety for better reliability
- ✅ Better IDE support with IntelliSense
- ✅ Consistent with the rest of the monorepo
- ✅ Modern async/await syntax
- ✅ Easy to maintain and extend

## Running Scripts

Scripts are executed using `tsx` which allows running TypeScript directly without compilation:

```bash
# Via pnpm (recommended)
pnpm start        # Run full setup + dev servers
pnpm env:setup    # Just create .env files

# Direct execution (if needed)
tsx scripts/setup.ts
tsx scripts/setup-env.ts
```

## Adding New Scripts

1. Create a new `.ts` file in the `scripts/` folder
2. Add the shebang line: `#!/usr/bin/env tsx`
3. Make it executable: `chmod +x scripts/your-script.ts`
4. Add to package.json scripts if needed
5. Follow the existing patterns for colors and logging

## Dependencies

- **tsx**: TypeScript execution environment (already in devDependencies)
- **@types/node**: TypeScript types for Node.js APIs

No additional dependencies needed!

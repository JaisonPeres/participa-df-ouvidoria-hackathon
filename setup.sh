#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Participa DF - Project Setup${NC}\n"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm is not installed. Installing...${NC}"
    npm install -g pnpm@9.1.0
fi

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
pnpm install

# Setup environment files
echo -e "${BLUE}🔧 Setting up environment files...${NC}"

if [ ! -f "app/services/backend/.env" ]; then
    cp app/services/backend/.env.example app/services/backend/.env
    echo -e "${GREEN}✓ Created backend .env file${NC}"
fi

if [ ! -f "app/frontends/pwa-front/.env" ]; then
    cp app/frontends/pwa-front/.env.example app/frontends/pwa-front/.env
    echo -e "${GREEN}✓ Created frontend .env file${NC}"
fi

# Start Docker services
echo -e "${BLUE}🐳 Starting Docker services...${NC}"
docker-compose up -d

# Wait for PostgreSQL to be ready
echo -e "${BLUE}⏳ Waiting for PostgreSQL to be ready...${NC}"
sleep 5

echo -e "${GREEN}\n✅ Setup complete!${NC}\n"
echo -e "${BLUE}📝 Next steps:${NC}"
echo -e "  1. Run ${GREEN}pnpm dev${NC} to start development servers"
echo -e "  2. Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "  3. Backend API: ${GREEN}http://localhost:3001${NC}"
echo -e "  4. API Docs: ${GREEN}http://localhost:3001/docs${NC}"
echo -e "  5. PgAdmin: ${GREEN}http://localhost:5050${NC}"
echo -e "\n${YELLOW}💡 Tip: Check README.md for more commands${NC}\n"

#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Participa DF Development Environment${NC}\n"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}⏹️  Shutting down services...${NC}"
    # Kill all background jobs
    jobs -p | xargs -r kill 2>/dev/null
    exit 0
}

# Trap CTRL+C and call cleanup
trap cleanup INT TERM

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed${NC}"
    echo -e "${YELLOW}Install it with: npm install -g pnpm@9.1.0${NC}"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running${NC}"
    echo -e "${YELLOW}Please start Docker Desktop and try again${NC}"
    exit 1
fi

# Start Docker services
echo -e "${BLUE}🐳 Starting Docker services...${NC}"
docker-compose up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to start Docker services${NC}"
    exit 1
fi

# Wait for PostgreSQL to be ready
echo -e "${BLUE}⏳ Waiting for PostgreSQL to be ready...${NC}"
attempt=0
max_attempts=30

until docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ $attempt -eq $max_attempts ]; then
        echo -e "${RED}❌ PostgreSQL failed to start${NC}"
        exit 1
    fi
    echo -e "${YELLOW}   Waiting... (${attempt}/${max_attempts})${NC}"
    sleep 1
done

echo -e "${GREEN}✓ PostgreSQL is ready!${NC}\n"

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    pnpm install
    echo ""
fi

# Start development servers
echo -e "${BLUE}🔧 Starting development servers...${NC}\n"

# Use pnpm turbo to start all dev servers
pnpm dev &

# Wait for services to start
sleep 3

# Display service URLs
echo -e "\n${GREEN}✅ All services are starting!${NC}\n"
echo -e "${BLUE}📝 Service URLs:${NC}"
echo -e "   ${GREEN}Frontend:${NC}     http://localhost:3000"
echo -e "   ${GREEN}Backend API:${NC}  http://localhost:3001"
echo -e "   ${GREEN}API Docs:${NC}     http://localhost:3001/docs"
echo -e "   ${GREEN}PgAdmin:${NC}      http://localhost:5050"
echo -e ""
echo -e "${YELLOW}💡 Press Ctrl+C to stop all services${NC}\n"

# Wait for background jobs
wait

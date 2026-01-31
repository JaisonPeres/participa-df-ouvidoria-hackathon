@echo off
echo ================================
echo Starting Participa DF Dev Environment
echo ================================
echo.

REM Check if pnpm is installed
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] pnpm is not installed
    echo Install it with: npm install -g pnpm@9.1.0
    exit /b 1
)

REM Check if Docker is running
docker info >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker is not running
    echo Please start Docker Desktop and try again
    exit /b 1
)

REM Start Docker services
echo Starting Docker services...
docker-compose up -d

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to start Docker services
    exit /b 1
)

REM Wait for PostgreSQL
echo Waiting for PostgreSQL to be ready...
timeout /t 5 /nobreak >nul

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    call pnpm install
)

REM Start development servers
echo.
echo Starting development servers...
echo.
call pnpm dev

echo.
echo Service URLs:
echo   Frontend:     http://localhost:3000
echo   Backend API:  http://localhost:3001
echo   API Docs:     http://localhost:3001/docs
echo   PgAdmin:      http://localhost:5050
echo.
echo Press Ctrl+C to stop all services

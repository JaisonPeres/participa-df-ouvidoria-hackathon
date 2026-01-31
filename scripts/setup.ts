#!/usr/bin/env tsx

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
} as const;

type Color = keyof typeof colors;

function log(message: string, color: Color = 'reset'): void {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command: string, errorMessage?: string): boolean {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    if (errorMessage) {
      log(`❌ ${errorMessage}`, 'red');
    }
    return false;
  }
}

function checkCommand(command: string): boolean {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function copyEnvFile(src: string, dest: string): boolean {
  // Check if source .env.example exists
  if (!fs.existsSync(src)) {
    log(`⚠️  ${path.basename(path.dirname(src))} .env.example not found, skipping`, 'yellow');
    return false;
  }
  
  // Check if destination .env already exists
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    log(`✓ Created ${path.basename(path.dirname(dest))} .env file`, 'green');
    return true;
  }
  return false;
}

async function main(): Promise<void> {
  log('\n🚀 Participa DF - Project Setup\n', 'blue');

  // Check if pnpm is installed
  log('📋 Checking prerequisites...', 'blue');
  if (!checkCommand('pnpm')) {
    log('⚠️  pnpm is not installed. Installing...', 'yellow');
    execCommand('npm install -g pnpm@9.1.0', 'Failed to install pnpm');
  } else {
    log('✓ pnpm is installed', 'green');
  }

  // Check Docker
  if (!checkCommand('docker')) {
    log('⚠️  Docker is not installed or not running', 'yellow');
    log('   Please install Docker Desktop: https://www.docker.com/products/docker-desktop', 'yellow');
  } else {
    log('✓ Docker is available', 'green');
  }

  // Install dependencies
  log('\n📦 Installing dependencies...', 'blue');
  if (!execCommand('pnpm install', 'Failed to install dependencies')) {
    process.exit(1);
  }

  // Setup environment files
  log('\n🔧 Setting up environment files...', 'blue');
  
  const backendEnv = path.join(__dirname, '..', 'app', 'services', 'backend', '.env');
  const backendEnvExample = path.join(__dirname, '..', 'app', 'services', 'backend', '.env.example');
  copyEnvFile(backendEnvExample, backendEnv);

  const frontendEnv = path.join(__dirname, '..', 'app', 'frontends', 'pwa-front', '.env');
  const frontendEnvExample = path.join(__dirname, '..', 'app', 'frontends', 'pwa-front', '.env.example');
  copyEnvFile(frontendEnvExample, frontendEnv);

  // Start Docker services
  if (checkCommand('docker')) {
    log('\n🐳 Starting Docker services...', 'blue');
    execCommand('docker-compose up -d', 'Failed to start Docker services');
    
    log('⏳ Waiting for PostgreSQL to be ready...', 'blue');
    // Simple wait - 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));
    log('✓ PostgreSQL should be ready', 'green');
  }
  
  log('\n🚀 Starting development servers...\n', 'blue');
  
  // Start dev servers
  execCommand('pnpm dev', 'Failed to start development servers');
}

main().catch((error: Error) => {
  log(`\n❌ Setup failed: ${error.message}`, 'red');
  process.exit(1);
});

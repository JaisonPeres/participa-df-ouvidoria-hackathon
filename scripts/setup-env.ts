#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
} as const;

type Color = keyof typeof colors;

function log(message: string, color: Color = 'reset'): void {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function copyEnvFile(src: string, dest: string, name: string): boolean {
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    log(`✓ Created ${name} .env file`, 'green');
    return true;
  } else {
    log(`⚠️  ${name} .env file already exists, skipping`, 'yellow');
    return false;
  }
}

function main(): void {
  log('\n🔧 Setting up environment files...\n', 'blue');

  const backendEnv = path.join(__dirname, '..', 'app', 'services', 'backend', '.env');
  const backendEnvExample = path.join(__dirname, '..', 'app', 'services', 'backend', '.env.example');
  
  const frontendEnv = path.join(__dirname, '..', 'app', 'frontends', 'pwa-front', '.env');
  const frontendEnvExample = path.join(__dirname, '..', 'app', 'frontends', 'pwa-front', '.env.example');

  copyEnvFile(backendEnvExample, backendEnv, 'Backend');
  copyEnvFile(frontendEnvExample, frontendEnv, 'Frontend');

  log('\n✅ Environment setup complete!\n', 'green');
}

main();

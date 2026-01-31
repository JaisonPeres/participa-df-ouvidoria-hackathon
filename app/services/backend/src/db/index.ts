import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || '';

// For query purposes
export const client = postgres(connectionString);
export const db = drizzle(client);

import { createClient, Client } from '@libsql/client';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

let client: Client;

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

if (tursoUrl && tursoUrl.startsWith('libsql://')) {
  client = createClient({
    url: tursoUrl,
    authToken: tursoAuthToken
  });
  console.log('[Database] Initialized Turso Cloud Database client:', tursoUrl);
} else {
  const localDbPath = path.resolve(process.cwd(), 'dishasaathi.db');
  client = createClient({
    url: `file:${localDbPath}`
  });
  console.log('[Database] Initialized local SQLite client:', localDbPath);
}

export const dbClient = client;

// Initialize schema
export async function initDatabase() {
  try {
    await dbClient.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbClient.execute(`
      CREATE TABLE IF NOT EXISTS user_journeys (
        user_id TEXT PRIMARY KEY,
        journey_data TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('[Database] Schema verification completed successfully.');
  } catch (err: any) {
    console.error('[Database] Failed to initialize database schema:', err?.message || err);
  }
}

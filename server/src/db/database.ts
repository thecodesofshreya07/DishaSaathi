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

import bcrypt from 'bcryptjs';

// Initialize schema & seed super admin
export async function initDatabase() {
  try {
    await dbClient.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'citizen',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure role column exists if table existed previously
    try {
      await dbClient.execute(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'citizen';`);
    } catch {
      // Column already exists, safe to ignore
    }

    await dbClient.execute(`
      CREATE TABLE IF NOT EXISTS user_journeys (
        user_id TEXT PRIMARY KEY,
        journey_data TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Seed official Admin account if not present
    const adminEmail = 'admin@dishasaathi.gov.in';
    const checkAdmin = await dbClient.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [adminEmail]
    });

    if (checkAdmin.rows.length === 0) {
      const adminPasswordHash = bcrypt.hashSync('Admin@DishaSaathi2026', 10);
      await dbClient.execute({
        sql: `INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
        args: ['admin-dishasaathi-root', 'Chief Validation Officer (Admin)', adminEmail, adminPasswordHash, 'admin']
      });
      console.log('[Database] Seeded default Admin user: admin@dishasaathi.gov.in (Password: Admin@DishaSaathi2026)');
    }

    console.log('[Database] Schema verification & admin seeding completed successfully.');
  } catch (err: any) {
    console.error('[Database] Failed to initialize database schema:', err?.message || err);
  }
}


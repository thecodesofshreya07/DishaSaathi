import Database from 'better-sqlite3';
import path from 'path';

// Database file path in server root (works across CJS and ESM)
const dbPath = path.resolve(process.cwd(), 'dishasaathi.db');

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_journeys (
      user_id TEXT PRIMARY KEY,
      journey_data TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  console.log('[Database] SQLite database initialized at:', dbPath);
}

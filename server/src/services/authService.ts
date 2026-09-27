import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbClient } from '../db/database.js';
import { JWT_SECRET, AuthUser } from '../middleware/authMiddleware.js';
import { CivicJourney } from '../types.js';

export interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export async function registerUser(name: string, email: string, password: string): Promise<{ user: AuthUser; token: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  
  // Check if exists
  const existingResult = await dbClient.execute({
    sql: 'SELECT id FROM users WHERE email = ?',
    args: [normalizedEmail]
  });
  
  if (existingResult.rows.length > 0) {
    throw new Error('An account with this email address already exists.');
  }

  const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const passwordHash = bcrypt.hashSync(password, 10);

  await dbClient.execute({
    sql: 'INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)',
    args: [id, name.trim(), normalizedEmail, passwordHash]
  });

  const user: AuthUser = { id, name: name.trim(), email: normalizedEmail };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

  return { user, token };
}

export async function loginUser(email: string, password: string): Promise<{ user: AuthUser; token: string; savedJourney?: CivicJourney }> {
  const normalizedEmail = email.trim().toLowerCase();
  const result = await dbClient.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [normalizedEmail]
  });

  if (result.rows.length === 0) {
    throw new Error('Invalid email or password.');
  }

  const row = result.rows[0] as unknown as UserRow;

  const isMatch = bcrypt.compareSync(password, row.password_hash);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  const user: AuthUser = { id: row.id, name: row.name, email: row.email };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

  // Hydrate saved journey if present
  let savedJourney: CivicJourney | undefined;
  const journeyResult = await dbClient.execute({
    sql: 'SELECT journey_data FROM user_journeys WHERE user_id = ?',
    args: [row.id]
  });

  if (journeyResult.rows.length > 0) {
    const rawData = journeyResult.rows[0].journey_data as string;
    try {
      savedJourney = JSON.parse(rawData);
    } catch (e) {
      console.error('Failed to parse saved journey for user', row.id);
    }
  }

  return { user, token, savedJourney };
}

export async function saveUserJourney(userId: string, journey: CivicJourney): Promise<void> {
  const journeyJson = JSON.stringify(journey);
  await dbClient.execute({
    sql: `
      INSERT INTO user_journeys (user_id, journey_data, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        journey_data = excluded.journey_data,
        updated_at = CURRENT_TIMESTAMP
    `,
    args: [userId, journeyJson]
  });
}

export async function getUserJourney(userId: string): Promise<CivicJourney | null> {
  const result = await dbClient.execute({
    sql: 'SELECT journey_data FROM user_journeys WHERE user_id = ?',
    args: [userId]
  });

  if (result.rows.length === 0) return null;
  try {
    return JSON.parse(result.rows[0].journey_data as string);
  } catch {
    return null;
  }
}

// Seed default demo account if not exists
export async function seedDefaultUser() {
  const email = 'bhumika@dishasaathi.gov.in';
  try {
    const existing = await dbClient.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email]
    });
    if (existing.rows.length === 0) {
      const { user } = await registerUser('Bhumika Sharma', email, 'citizen123');
      console.log('[Auth] Seeded demo user account:', user.email);
    }
  } catch (err: any) {
    // Ignore if table not ready or duplicate
  }
}

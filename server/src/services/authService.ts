import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';
import { JWT_SECRET, AuthUser } from '../middleware/authMiddleware.js';
import { CivicJourney } from '../types.js';

export interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
}

export function registerUser(name: string, email: string, password: string): { user: AuthUser; token: string } {
  const normalizedEmail = email.trim().toLowerCase();
  
  // Check if exists
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (existing) {
    throw new Error('An account with this email address already exists.');
  }

  const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const passwordHash = bcrypt.hashSync(password, 10);

  db.prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)').run(
    id,
    name.trim(),
    normalizedEmail,
    passwordHash
  );

  const user: AuthUser = { id, name: name.trim(), email: normalizedEmail };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

  return { user, token };
}

export function loginUser(email: string, password: string): { user: AuthUser; token: string; savedJourney?: CivicJourney } {
  const normalizedEmail = email.trim().toLowerCase();
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail) as UserRow | undefined;

  if (!row) {
    throw new Error('Invalid email or password.');
  }

  const isMatch = bcrypt.compareSync(password, row.password_hash);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  const user: AuthUser = { id: row.id, name: row.name, email: row.email };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

  // Hydrate saved journey if present
  let savedJourney: CivicJourney | undefined;
  const journeyRow = db.prepare('SELECT journey_data FROM user_journeys WHERE user_id = ?').get(row.id) as { journey_data: string } | undefined;
  if (journeyRow) {
    try {
      savedJourney = JSON.parse(journeyRow.journey_data);
    } catch (e) {
      console.error('Failed to parse saved journey for user', row.id);
    }
  }

  return { user, token, savedJourney };
}

export function saveUserJourney(userId: string, journey: CivicJourney): void {
  const journeyJson = JSON.stringify(journey);
  db.prepare(`
    INSERT INTO user_journeys (user_id, journey_data, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET
      journey_data = excluded.journey_data,
      updated_at = CURRENT_TIMESTAMP
  `).run(userId, journeyJson);
}

export function getUserJourney(userId: string): CivicJourney | null {
  const row = db.prepare('SELECT journey_data FROM user_journeys WHERE user_id = ?').get(userId) as { journey_data: string } | undefined;
  if (!row) return null;
  try {
    return JSON.parse(row.journey_data);
  } catch {
    return null;
  }
}

// Seed default demo account if not exists
export function seedDefaultUser() {
  const email = 'bhumika@dishasaathi.gov.in';
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (!existing) {
    try {
      const { user } = registerUser('Bhumika Sharma', email, 'citizen123');
      console.log('[Auth] Seeded demo user account:', user.email);
    } catch (err) {
      // Ignore if exists
    }
  }
}

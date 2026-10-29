/**
 * Cryptographic Password Hashing, Session Management & Rate Limiting Engine
 * Uses Node's built-in crypto module for scrypt key derivation and constant-time comparison.
 */

import crypto from 'node:crypto';

export interface PasswordHashRecord {
  salt: string;
  hash: string;
}

/**
 * Hashes a plaintext password using scrypt with a cryptographically secure random salt.
 */
export function hashPassword(password: string): PasswordHashRecord {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return {
    salt,
    hash: derivedKey.toString('hex'),
  };
}

/**
 * Verifies a plaintext password against a stored salt and hash using timing-safe comparison.
 */
export function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  try {
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const storedBuffer = Buffer.from(storedHash, 'hex');
    if (derivedKey.length !== storedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(derivedKey, storedBuffer);
  } catch {
    return false;
  }
}

/**
 * Generates an unguessable 256-bit cryptographically secure session token.
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * In-memory brute-force rate limiter
 * Allows up to maxAttempts per windowMs.
 */
interface RateLimitEntry {
  attempts: number;
  resetAt: number;
}

const rateLimitRegistry = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  key: string,
  maxAttempts = 5,
  windowMs = 15 * 60 * 1000
): { allowed: boolean; remainingAttempts: number; retryAfterSeconds?: number } {
  const now = Date.now();
  const entry = rateLimitRegistry.get(key);

  if (!entry || entry.resetAt <= now) {
    rateLimitRegistry.set(key, { attempts: 1, resetAt: now + windowMs });
    return { allowed: true, remainingAttempts: maxAttempts - 1 };
  }

  if (entry.attempts >= maxAttempts) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
  }

  entry.attempts += 1;
  return { allowed: true, remainingAttempts: maxAttempts - entry.attempts };
}

export function resetRateLimit(key: string): void {
  rateLimitRegistry.delete(key);
}

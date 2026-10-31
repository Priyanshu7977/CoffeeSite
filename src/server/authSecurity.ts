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

// Pre-computed constant-time dummy record to prevent timing attacks and account enumeration
const DUMMY_SALT = crypto.randomBytes(16).toString('hex');
const DUMMY_HASH = crypto.scryptSync('dummy_timing_mitigation_password', DUMMY_SALT, 64).toString('hex');

/**
 * Executes a dummy scrypt computation with identical CPU time
 * when an account does not exist, defeating timing-based email enumeration attacks.
 */
export function performDummyPasswordVerification(password: string): void {
  try {
    const derivedKey = crypto.scryptSync(password || 'dummy', DUMMY_SALT, 64);
    const storedBuffer = Buffer.from(DUMMY_HASH, 'hex');
    crypto.timingSafeEqual(derivedKey, storedBuffer);
  } catch {
    // Timing mitigation intentionally ignored
  }
}

/**
 * Multi-tier rate limiting for login attempts
 * Tier 1: Per-IP limiting (max 10 failed attempts / 15m) prevents distributed brute force
 * Tier 2: Per-Account limiting (max 5 failed attempts / 15m) prevents password spraying
 */
export function checkLoginRateLimit(
  clientIp: string,
  email: string
): { allowed: boolean; error?: string; retryAfterSeconds?: number } {
  const cleanIp = (clientIp || 'unknown').trim().toLowerCase();
  const cleanEmail = (email || 'unknown').trim().toLowerCase();

  // Tier 1: IP rate limit
  const ipCheck = checkRateLimit(`login_ip_${cleanIp}`, 10, 15 * 60 * 1000);
  if (!ipCheck.allowed) {
    const minutes = Math.max(1, Math.ceil((ipCheck.retryAfterSeconds || 60) / 60));
    return {
      allowed: false,
      error: `Too many sign-in attempts from your network. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`,
      retryAfterSeconds: ipCheck.retryAfterSeconds,
    };
  }

  // Tier 2: Account rate limit
  if (cleanEmail && cleanEmail !== 'unknown') {
    const acctCheck = checkRateLimit(`login_acct_${cleanEmail}`, 5, 15 * 60 * 1000);
    if (!acctCheck.allowed) {
      const minutes = Math.max(1, Math.ceil((acctCheck.retryAfterSeconds || 60) / 60));
      return {
        allowed: false,
        error: `Too many failed sign-in attempts for this account. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`,
        retryAfterSeconds: acctCheck.retryAfterSeconds,
      };
    }
  }

  return { allowed: true };
}

/**
 * Resets rate limit counters after successful authentication
 */
export function resetLoginRateLimit(clientIp: string, email: string): void {
  const cleanIp = (clientIp || 'unknown').trim().toLowerCase();
  const cleanEmail = (email || 'unknown').trim().toLowerCase();
  resetRateLimit(`login_ip_${cleanIp}`);
  if (cleanEmail && cleanEmail !== 'unknown') {
    resetRateLimit(`login_acct_${cleanEmail}`);
  }
}

/**
 * Periodic cleanup of expired rate limit entries to prevent memory growth
 */
export function cleanupExpiredRateLimits(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitRegistry.entries()) {
    if (entry.resetAt <= now) {
      rateLimitRegistry.delete(key);
    }
  }
}

// Prune expired rate limit entries every 5 minutes in long-running processes
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(cleanupExpiredRateLimits, 5 * 60 * 1000);
  if (timer.unref) timer.unref();
}

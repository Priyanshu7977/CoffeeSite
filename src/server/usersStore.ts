/**
 * Authoritative Customer Profile, Security Credentials & Session Registry
 * Manages scrypt password hashes, sessions, addresses, and customer profiles.
 * Serverless-safe with os.tmpdir() fallback and in-memory cache.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type { CustomerProfile, SavedAddress } from '../types/auth';
import { generateSessionToken } from './authSecurity';

export interface UserRecord {
  profile: CustomerProfile;
  passwordSalt?: string;
  passwordHash?: string;
}

export interface ActiveSession {
  token: string;
  email: string;
  userId: string;
  role: string;
  name: string;
  createdAt: string;
  expiresAt: string;
}

function getUsersFilePath(): string {
  try {
    const localDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    return path.join(localDir, 'users.json');
  } catch {
    const tmpDir = path.join(os.tmpdir(), 'noir-roast-data');
    try {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
    } catch {
      // Ignored
    }
    return path.join(tmpDir, 'users.json');
  }
}

// In-Memory Fast Cache of users with credentials
let usersCache: Map<string, UserRecord> = new Map();
// Active sessions registry (token -> ActiveSession)
const sessionsCache: Map<string, ActiveSession> = new Map();

function loadUsersFromDisk(): void {
  try {
    const filePath = getUsersFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      if (raw.trim()) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          usersCache = new Map(
            parsed.map((entry) => {
              // Backward compatibility if file had raw CustomerProfile
              if ('uid' in entry && !('profile' in entry)) {
                return [entry.email.toLowerCase(), { profile: entry }];
              }
              return [entry.profile.email.toLowerCase(), entry];
            })
          );
        }
      }
    }
  } catch (err) {
    console.warn('Users storage read notice (in-memory active):', err);
  }
}

function persistUsersToDisk(): void {
  try {
    const filePath = getUsersFilePath();
    const list = Array.from(usersCache.values());
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Users persistence notice (in-memory active):', err);
  }
}

loadUsersFromDisk();

export class UsersStore {
  /**
   * Retrieves a customer profile by email (never exposes password hashes)
   */
  public static getUserByEmail(email: string): CustomerProfile | undefined {
    const record = usersCache.get(email.toLowerCase().trim());
    return record ? record.profile : undefined;
  }

  /**
   * Internal retrieval with cryptographic password credentials
   */
  public static getUserRecord(email: string): UserRecord | undefined {
    return usersCache.get(email.toLowerCase().trim());
  }

  /**
   * Retrieves a user by their UID or Member ID
   */
  public static getUserById(identifier: string): CustomerProfile | undefined {
    const clean = identifier.trim().toLowerCase();
    for (const record of usersCache.values()) {
      const u = record.profile;
      if (
        u.uid.toLowerCase() === clean ||
        u.memberId.toLowerCase() === clean ||
        u.email.toLowerCase() === clean
      ) {
        return u;
      }
    }
    return undefined;
  }

  /**
   * Saves or registers a new customer profile with optional password salt and hash
   */
  public static saveUserWithCredentials(
    profile: CustomerProfile,
    passwordSalt?: string,
    passwordHash?: string
  ): CustomerProfile {
    profile.updatedAt = new Date().toISOString();
    const record: UserRecord = {
      profile,
      passwordSalt,
      passwordHash,
    };
    usersCache.set(profile.email.toLowerCase().trim(), record);
    persistUsersToDisk();
    return profile;
  }

  /**
   * Legacy wrapper for saveUser
   */
  public static saveUser(user: CustomerProfile): CustomerProfile {
    return this.saveUserWithCredentials(user);
  }

  /**
   * Updates an existing profile
   */
  public static updateUser(
    email: string,
    updates: Partial<CustomerProfile>
  ): CustomerProfile | undefined {
    const existingRecord = usersCache.get(email.toLowerCase().trim());
    if (!existingRecord) return undefined;

    const updatedProfile: CustomerProfile = {
      ...existingRecord.profile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    existingRecord.profile = updatedProfile;
    usersCache.set(email.toLowerCase().trim(), existingRecord);
    persistUsersToDisk();
    return updatedProfile;
  }

  /**
   * Adds a delivery address to the customer's profile
   */
  public static addAddress(email: string, address: SavedAddress): CustomerProfile | undefined {
    const user = this.getUserByEmail(email);
    if (!user) return undefined;

    const currentAddresses = user.savedAddresses || [];

    if (address.isDefault) {
      currentAddresses.forEach((a) => (a.isDefault = false));
    } else if (currentAddresses.length === 0) {
      address.isDefault = true;
    }

    const updatedAddresses = [...currentAddresses, address];
    return this.updateUser(email, { savedAddresses: updatedAddresses });
  }

  /**
   * Deletes a delivery address
   */
  public static deleteAddress(email: string, addressId: string): CustomerProfile | undefined {
    const user = this.getUserByEmail(email);
    if (!user) return undefined;

    const filtered = (user.savedAddresses || []).filter((a) => a.id !== addressId);
    if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
      filtered[0].isDefault = true;
    }

    return this.updateUser(email, { savedAddresses: filtered });
  }

  /**
   * Sets default delivery address
   */
  public static setDefaultAddress(email: string, addressId: string): CustomerProfile | undefined {
    const user = this.getUserByEmail(email);
    if (!user) return undefined;

    const updated = (user.savedAddresses || []).map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));

    return this.updateUser(email, { savedAddresses: updated });
  }

  /**
   * Session Management: Creates a secure token session (valid for 7 days)
   */
  public static createSession(profile: CustomerProfile): ActiveSession {
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const session: ActiveSession = {
      token,
      email: profile.email,
      userId: profile.uid,
      role: profile.role,
      name: profile.fullName,
      createdAt: new Date().toISOString(),
      expiresAt,
    };
    sessionsCache.set(token, session);
    return session;
  }

  /**
   * Validates an active session token
   */
  public static getSession(token: string): ActiveSession | null {
    if (!token) return null;
    const session = sessionsCache.get(token);
    if (!session) return null;
    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      sessionsCache.delete(token);
      return null;
    }
    return session;
  }

  /**
   * Revokes a session token (Logout)
   */
  public static revokeSession(token: string): void {
    if (token) {
      sessionsCache.delete(token);
    }
  }

  /**
   * Returns all users (for diagnostics / admin)
   */
  public static getAllUsers(): CustomerProfile[] {
    return Array.from(usersCache.values()).map((r) => r.profile);
  }
}

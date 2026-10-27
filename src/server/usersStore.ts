/**
 * Authoritative Customer Profile & Address Storage for Noir Dakshin Coffee
 * Serverless-safe with os.tmpdir() fallback and in-memory cache.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type { CustomerProfile, SavedAddress } from '../types/auth';

function getUsersFilePath(): string {
  try {
    const localDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    return path.join(localDir, 'users.json');
  } catch {
    const tmpDir = path.join(os.tmpdir(), 'noir-dakshin-orders');
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

// In-Memory Fast Cache & Primary Record
let usersCache: Map<string, CustomerProfile> = new Map();

function loadUsersFromDisk(): void {
  try {
    const filePath = getUsersFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      if (raw.trim()) {
        const parsed: CustomerProfile[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          usersCache = new Map(parsed.map((u) => [u.email.toLowerCase(), u]));
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

// Initial safe load
loadUsersFromDisk();

export class UsersStore {
  /**
   * Retrieves a user by their email address
   */
  public static getUserByEmail(email: string): CustomerProfile | undefined {
    return usersCache.get(email.toLowerCase().trim());
  }

  /**
   * Retrieves a user by their UID or Member ID
   */
  public static getUserById(identifier: string): CustomerProfile | undefined {
    const clean = identifier.trim().toLowerCase();
    for (const user of usersCache.values()) {
      if (
        user.uid.toLowerCase() === clean ||
        user.memberId.toLowerCase() === clean ||
        user.email.toLowerCase() === clean
      ) {
        return user;
      }
    }
    return undefined;
  }

  /**
   * Saves or registers a new customer profile
   */
  public static saveUser(user: CustomerProfile): CustomerProfile {
    user.updatedAt = new Date().toISOString();
    usersCache.set(user.email.toLowerCase().trim(), user);
    persistUsersToDisk();
    return user;
  }

  /**
   * Updates an existing profile
   */
  public static updateUser(
    email: string,
    updates: Partial<CustomerProfile>
  ): CustomerProfile | undefined {
    const existing = this.getUserByEmail(email);
    if (!existing) return undefined;

    const updated: CustomerProfile = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    usersCache.set(email.toLowerCase().trim(), updated);
    persistUsersToDisk();
    return updated;
  }

  /**
   * Adds a delivery address to the customer's profile
   */
  public static addAddress(email: string, address: SavedAddress): CustomerProfile | undefined {
    const user = this.getUserByEmail(email);
    if (!user) return undefined;

    const currentAddresses = user.savedAddresses || [];

    // If marked as default, clear isDefault on existing addresses
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
   * Returns all users (for diagnostics / admin)
   */
  public static getAllUsers(): CustomerProfile[] {
    return Array.from(usersCache.values());
  }
}

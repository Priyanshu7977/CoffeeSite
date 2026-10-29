/**
 * Authoritative Private Micro-Lot Allocation & Reserve Request Store
 * Persists reservation records to data/reservations.json with in-memory cache and os.tmpdir() fallback.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export interface MicroLotReservation {
  id: string;
  certificateId: string;
  batchId: string;
  batchName: string;
  fullName: string;
  email: string;
  quantity: number;
  grind: string;
  status: 'confirmed' | 'waitlist';
  createdAt: string;
  updatedAt: string;
}

const BATCH_CAPACITIES: Record<string, { totalAllocations: number; name: string }> = {
  'batch-01': { totalAllocations: 85, name: 'BABA BUDAN OBSIDIAN' },
  'batch-02': { totalAllocations: 60, name: 'MALABAR MONSOONED CASK' },
  'batch-03': { totalAllocations: 75, name: 'SHEVAROY ELEVATION 1600' },
  'batch-04': { totalAllocations: 50, name: 'WAYANAD WILD ROBUSTA' },
};

function getReservationsFilePath(): string {
  try {
    const localDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    return path.join(localDir, 'reservations.json');
  } catch {
    const tmpDir = path.join(os.tmpdir(), 'noir-roast-data');
    try {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
    } catch {
      // Ignored
    }
    return path.join(tmpDir, 'reservations.json');
  }
}

let reservationsCache: Map<string, MicroLotReservation> = new Map();

function loadReservationsFromDisk(): void {
  try {
    const filePath = getReservationsFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      if (raw.trim()) {
        const parsed: MicroLotReservation[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          reservationsCache = new Map(parsed.map((r) => [r.id, r]));
        }
      }
    }
  } catch (err) {
    console.warn('Reservations storage read notice (in-memory active):', err);
  }
}

function persistReservationsToDisk(): void {
  try {
    const filePath = getReservationsFilePath();
    const list = Array.from(reservationsCache.values());
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Reservations persistence notice (in-memory active):', err);
  }
}

loadReservationsFromDisk();

export class ReservationsStore {
  public static getRemainingAllocations(batchId: string): number {
    const batch = BATCH_CAPACITIES[batchId] || { totalAllocations: 85, name: 'BABA BUDAN OBSIDIAN' };
    let reserved = 0;
    for (const res of reservationsCache.values()) {
      if (res.batchId === batchId && res.status === 'confirmed') {
        reserved += res.quantity;
      }
    }
    return Math.max(0, batch.totalAllocations - reserved);
  }

  public static createReservation(data: {
    batchId: string;
    fullName: string;
    email: string;
    quantity: number;
    grind: string;
  }): { success: boolean; reservation: MicroLotReservation; error?: string } {
    const batch = BATCH_CAPACITIES[data.batchId] || {
      totalAllocations: 85,
      name: data.batchId.toUpperCase(),
    };

    const remaining = this.getRemainingAllocations(data.batchId);
    const safeQty = Math.max(1, Math.min(10, Math.floor(data.quantity)));

    const status: 'confirmed' | 'waitlist' = remaining >= safeQty ? 'confirmed' : 'waitlist';

    const cleanBatch = data.batchId.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const id = `res_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const certificateId = `NR-RES-2026-${cleanBatch}-${Math.floor(1000 + Math.random() * 9000)}`;

    const reservation: MicroLotReservation = {
      id,
      certificateId,
      batchId: data.batchId,
      batchName: batch.name,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      quantity: safeQty,
      grind: data.grind,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    reservationsCache.set(id, reservation);
    persistReservationsToDisk();

    return {
      success: true,
      reservation,
    };
  }

  public static getReservationById(id: string): MicroLotReservation | null {
    return reservationsCache.get(id) || null;
  }

  public static getReservationsByEmail(email: string): MicroLotReservation[] {
    const clean = email.trim().toLowerCase();
    const results: MicroLotReservation[] = [];
    for (const res of reservationsCache.values()) {
      if (res.email === clean) {
        results.push(res);
      }
    }
    return results;
  }
}

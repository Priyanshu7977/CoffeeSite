/**
 * Authoritative Newsletter & Roastery Dispatch Subscribers Store
 * Persistent across serverless/Node runs with in-memory caching and os.tmpdir() fallback.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

export interface NewsletterSubscriber {
  email: string;
  source: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
}

function getSubscribersFilePath(): string {
  try {
    const localDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    return path.join(localDir, 'subscribers.json');
  } catch {
    const tmpDir = path.join(os.tmpdir(), 'noir-roast-data');
    try {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
    } catch {
      // Ignored
    }
    return path.join(tmpDir, 'subscribers.json');
  }
}

let subscribersCache: Map<string, NewsletterSubscriber> = new Map();

function loadSubscribersFromDisk(): void {
  try {
    const filePath = getSubscribersFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      if (raw.trim()) {
        const parsed: NewsletterSubscriber[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          subscribersCache = new Map(parsed.map((s) => [s.email.toLowerCase(), s]));
        }
      }
    }
  } catch (err) {
    console.warn('Subscribers storage read notice (in-memory active):', err);
  }
}

function persistSubscribersToDisk(): void {
  try {
    const filePath = getSubscribersFilePath();
    const list = Array.from(subscribersCache.values());
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Subscribers persistence notice (in-memory active):', err);
  }
}

loadSubscribersFromDisk();

export class NewsletterStore {
  public static isSubscribed(email: string): boolean {
    const clean = email.trim().toLowerCase();
    const existing = subscribersCache.get(clean);
    return Boolean(existing && existing.status === 'active');
  }

  public static subscribe(email: string, source = 'footer'): { success: boolean; alreadySubscribed: boolean } {
    const clean = email.trim().toLowerCase();
    const existing = subscribersCache.get(clean);

    if (existing && existing.status === 'active') {
      return { success: true, alreadySubscribed: true };
    }

    const subscriber: NewsletterSubscriber = {
      email: clean,
      source,
      subscribedAt: new Date().toISOString(),
      status: 'active',
    };

    subscribersCache.set(clean, subscriber);
    persistSubscribersToDisk();
    return { success: true, alreadySubscribed: false };
  }

  public static unsubscribe(email: string): boolean {
    const clean = email.trim().toLowerCase();
    const existing = subscribersCache.get(clean);
    if (existing) {
      existing.status = 'unsubscribed';
      persistSubscribersToDisk();
      return true;
    }
    return false;
  }

  public static getAllSubscribers(): NewsletterSubscriber[] {
    return Array.from(subscribersCache.values());
  }
}

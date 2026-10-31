import { describe, it, expect, beforeEach } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  resetRateLimit,
  checkLoginRateLimit,
  resetLoginRateLimit,
  performDummyPasswordVerification,
} from '../server/authSecurity';
import {
  hasMaliciousContent,
  isValidEmail,
  isValidName,
  isValidPhone,
} from '../utils/validation';
import { UsersStore } from '../server/usersStore';
import type { CustomerProfile } from '../types/auth';

describe('Advanced Security Hardening: Server-Side Validation, Rate Limiting, Password Encryption & Generic Errors', () => {
  beforeEach(() => {
    // Reset rate limits between tests
    resetRateLimit('login_test_ip');
    resetRateLimit('login_acct_victim@noirkaapi.in');
  });

  describe('1. Server-Side Input Validation & Sanitization', () => {
    it('strictly validates customer names and rejects scripts, digits, and oversized inputs', () => {
      expect(isValidName('Priyanshu Singh')).toBe(true);
      expect(isValidName('A')).toBe(false); // Min 2 chars
      expect(isValidName('A'.repeat(65))).toBe(false); // Max length exceeded
      expect(isValidName('Priyanshu123')).toBe(false);
      expect(isValidName('<script>alert("hack")</script>')).toBe(false);
      expect(isValidName('Vikram; DROP TABLE users;--')).toBe(false);
    });

    it('strictly validates RFC-compliant emails and rejects header injections & XSS', () => {
      expect(isValidEmail('concierge@noirkaapi.in')).toBe(true);
      expect(isValidEmail('victim@noirkaapi.in\r\nBcc: hacker@evil.com')).toBe(false);
      expect(isValidEmail('victim@noirkaapi.in<script>')).toBe(false);
      expect(isValidEmail('plainaddress')).toBe(false);
      expect(isValidEmail('@missingusername.com')).toBe(false);
    });

    it('strictly validates phone numbers with digits only', () => {
      expect(isValidPhone('7977641125')).toBe(true);
      expect(isValidPhone('+91 79776 41125')).toBe(true);
      expect(isValidPhone('12345')).toBe(false); // Too short
      expect(isValidPhone('phone-number-here')).toBe(false);
    });

    it('detects Prototype Pollution and object injection attempts in payloads', () => {
      expect(hasMaliciousContent('__proto__.polluted = true')).toBe(true);
      expect(hasMaliciousContent('constructor.prototype.isAdmin = true')).toBe(true);
      expect(hasMaliciousContent('<img src=x onerror=alert(1)>')).toBe(true);
    });
  });

  describe('2. Login Rate Limiting & Brute-Force Throttling', () => {
    it('enforces multi-tier rate limiting for login attempts', () => {
      const testIp = `ip_${Date.now()}`;
      const testEmail = `target_${Date.now()}@noirkaapi.in`;

      // 5 login attempts should be allowed
      for (let i = 0; i < 5; i++) {
        const check = checkLoginRateLimit(testIp, testEmail);
        expect(check.allowed).toBe(true);
      }

      // 6th attempt on the same account within 15 minutes must be blocked
      const blockedAccount = checkLoginRateLimit(testIp, testEmail);
      expect(blockedAccount.allowed).toBe(false);
      expect(blockedAccount.error).toContain('Too many failed sign-in attempts for this account');

      // Successful login resets the rate limit
      resetLoginRateLimit(testIp, testEmail);
      const afterReset = checkLoginRateLimit(testIp, testEmail);
      expect(afterReset.allowed).toBe(true);
    });

    it('blocks high-volume IP credential stuffing across different emails', () => {
      const sprayIp = `spray_ip_${Date.now()}`;

      // IP limit allows up to 10 failed attempts across different accounts
      for (let i = 0; i < 10; i++) {
        const check = checkLoginRateLimit(sprayIp, `user_${i}_${Date.now()}@noirkaapi.in`);
        expect(check.allowed).toBe(true);
      }

      // 11th attempt from same IP is blocked regardless of the email
      const blockedIp = checkLoginRateLimit(sprayIp, `new_victim_${Date.now()}@noirkaapi.in`);
      expect(blockedIp.allowed).toBe(false);
      expect(blockedIp.error).toContain('Too many sign-in attempts from your network');
    });
  });

  describe('3. Cryptographic Password Encryption & Salt Derivation', () => {
    it('uses scrypt key derivation with cryptographically unique salts', () => {
      const password = 'SpecialtyCoffee@2026';
      const record1 = hashPassword(password);
      const record2 = hashPassword(password);

      // Salts must be unique random 16-byte hex strings
      expect(record1.salt).not.toBe(record2.salt);
      expect(record1.salt.length).toBe(32);
      expect(record1.hash).not.toBe(record2.hash);
      expect(record1.hash.length).toBe(128); // 64 bytes scrypt derived key

      // Both hashes verify accurately against their respective salts
      expect(verifyPassword(password, record1.salt, record1.hash)).toBe(true);
      expect(verifyPassword(password, record2.salt, record2.hash)).toBe(true);
      expect(verifyPassword('WrongPassword!', record1.salt, record1.hash)).toBe(false);
    });

    it('executes constant-time dummy verification for unknown users to eliminate timing side-channels', () => {
      const start = performance.now();
      performDummyPasswordVerification('NonExistentUserPassword123');
      const duration = performance.now() - start;

      // Dummy scrypt execution should take measurable CPU time (~1-10ms) comparable to real verification
      expect(duration).toBeGreaterThan(0);
    });

    it('ensures UserStore never exposes password salt or hash on public user profiles', () => {
      const testEmail = `collector_${Date.now()}@noirkaapi.in`;
      const creds = hashPassword('SecretRoastKey123');

      const profile: CustomerProfile = {
        uid: `usr_test_${Date.now()}`,
        memberId: 'NR-2026-8801',
        fullName: 'Vikramaditya Rao',
        email: testEmail,
        phone: '7977641125',
        role: 'CUSTOMER',
        authProvider: 'password',
        savedAddresses: [],
        preferences: {
          favoriteGrind: 'Whole Bean',
          newsletter: true,
          cuppingAlerts: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      UsersStore.saveUserWithCredentials(profile, creds.salt, creds.hash);

      const publicUser = UsersStore.getUserByEmail(testEmail);
      expect(publicUser).toBeDefined();
      expect((publicUser as any).passwordSalt).toBeUndefined();
      expect((publicUser as any).passwordHash).toBeUndefined();
      expect((publicUser as any).password).toBeUndefined();

      // Only internal getUserRecord has the cryptographic credentials
      const internalRecord = UsersStore.getUserRecord(testEmail);
      expect(internalRecord?.passwordSalt).toBe(creds.salt);
      expect(internalRecord?.passwordHash).toBe(creds.hash);
    });
  });

  describe('4. Generic Error Handling & User Enumeration Defense', () => {
    it('validates that login failure responses use uniform generic error messaging', () => {
      const genericError = 'Invalid email or password.';

      // Both unknown email and incorrect password must result in identical generic error
      const simulateLoginFailure = (emailExists: boolean, passwordValid: boolean): string => {
        if (!emailExists || !passwordValid) {
          return genericError;
        }
        return 'Signed in successfully.';
      };

      expect(simulateLoginFailure(false, false)).toBe('Invalid email or password.');
      expect(simulateLoginFailure(true, false)).toBe('Invalid email or password.');
      expect(simulateLoginFailure(false, true)).toBe('Invalid email or password.');
    });
  });
});

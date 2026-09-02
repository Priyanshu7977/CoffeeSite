/**
 * Strict Input Validation and Security Sanitization Utilities
 * Enforces strict character sets and blocks XSS, script tags, iframes, and HTML injections.
 */

/**
 * Checks whether an input contains potentially malicious script or iframe tags
 */
export const hasMaliciousContent = (value: string): boolean => {
  if (!value) return false;
  const maliciousPattern = /<[^>]*>?|javascript:|data:|vbscript:|on\w+\s*=/i;
  return maliciousPattern.test(value);
};

/**
 * Strips all HTML tags, script tags, iframe tags, and event handlers
 */
export const stripDangerousMarkup = (value: string): string => {
  if (!value) return '';
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

/**
 * Sanitizes and restricts Name fields to alphabetic characters, spaces, hyphens, and apostrophes only.
 * Completely strips all numbers, symbols, scripts, and iframe injections.
 */
export const sanitizeName = (value: string): string => {
  const clean = stripDangerousMarkup(value);
  // Retain only alphabetic letters (A-Z, a-z), spaces, apostrophes, and hyphens
  return clean.replace(/[^A-Za-z\s'-]/g, '');
};

/**
 * Validates if a name contains only alphabetic letters and valid spacing.
 */
export const isValidName = (value: string): boolean => {
  if (!value || value.trim().length < 2) return false;
  return /^[A-Za-z\s'-]+$/.test(value.trim());
};

/**
 * Sanitizes and restricts Phone Number fields to numbers, plus sign, spaces, hyphens, and parentheses only.
 * Completely strips all alphabetic characters, symbols, scripts, and iframes.
 */
export const sanitizePhone = (value: string): string => {
  const clean = stripDangerousMarkup(value);
  // Retain only numbers (0-9), plus (+), hyphens (-), spaces, and parentheses ()
  return clean.replace(/[^0-9+\s()-]/g, '');
};

/**
 * Validates if a phone number contains at least 7 valid numeric digits.
 */
export const isValidPhone = (value: string): boolean => {
  const digitsOnly = value.replace(/\D/g, '');
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
};

/**
 * Sanitizes Address fields:
 * Completely strips any script tags, iframe tags, or HTML elements.
 * Permits only safe address characters: alphanumeric letters, numbers, spaces, commas, periods, hyphens, slashes, and #.
 */
export const sanitizeAddress = (value: string): string => {
  const clean = stripDangerousMarkup(value);
  // Only allow alphanumeric characters, spaces, and standard address punctuation
  return clean.replace(/[^A-Za-z0-9\s,.\-#/]/g, '');
};

/**
 * Sanitizes City fields:
 * Completely strips scripts, iframes, and numbers.
 * Permits only alphabetic letters, spaces, periods, and hyphens.
 */
export const sanitizeCity = (value: string): string => {
  const clean = stripDangerousMarkup(value);
  // Only allow alphabetic characters, spaces, periods, and hyphens (NO numbers)
  return clean.replace(/[^A-Za-z\s.'-]/g, '');
};

/**
 * Sanitizes Country fields:
 * Completely strips scripts, iframes, and numbers.
 * Permits only alphabetic letters, spaces, and hyphens.
 */
export const sanitizeCountry = (value: string): string => {
  const clean = stripDangerousMarkup(value);
  // Only allow alphabetic characters, spaces, and hyphens (NO numbers)
  return clean.replace(/[^A-Za-z\s'-]/g, '');
};

/**
 * Sanitizes Postal Code fields:
 * Completely strips scripts, iframes, and special symbols.
 * Permits only alphanumeric characters, spaces, and hyphens.
 */
export const sanitizePostalCode = (value: string): string => {
  const clean = stripDangerousMarkup(value);
  // Allow letters, digits, spaces, hyphens (supports international zip/postal codes)
  return clean.replace(/[^A-Za-z0-9\s-]/g, '');
};

/**
 * Validates email address format according to standard RFC pattern.
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || email.trim().length === 0) return false;
  if (hasMaliciousContent(email)) return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
};

/**
 * Sanitizes generic text fields to strip HTML tags and script/iframe injections.
 */
export const sanitizeText = (value: string): string => {
  return stripDangerousMarkup(value).trim();
};

/**
 * Strict Input Validation and Sanitization Utilities
 * Enforces strict character sets and protects against script injection (XSS).
 */

/**
 * Sanitizes and restricts Name fields to alphabetic characters, spaces, hyphens, and apostrophes only.
 * Completely strips all numbers, symbols, and script/HTML tags.
 */
export const sanitizeName = (value: string): string => {
  // Strip any script or HTML tags first
  const cleanScript = value.replace(/<[^>]*>?/gm, '');
  // Retain only alphabetic letters (A-Z, a-z), spaces, apostrophes, and hyphens
  return cleanScript.replace(/[^A-Za-z\s'-]/g, '');
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
 * Completely strips all alphabetic characters, symbols, and script tags.
 */
export const sanitizePhone = (value: string): string => {
  // Strip any script or HTML tags first
  const cleanScript = value.replace(/<[^>]*>?/gm, '');
  // Retain only numbers (0-9), plus (+), hyphens (-), spaces, and parentheses ()
  return cleanScript.replace(/[^0-9+\s()-]/g, '');
};

/**
 * Validates if a phone number contains at least 7 valid numeric digits.
 */
export const isValidPhone = (value: string): boolean => {
  const digitsOnly = value.replace(/\D/g, '');
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
};

/**
 * Validates email address format according to standard RFC pattern.
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || email.trim().length === 0) return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
};

/**
 * Sanitizes generic text fields to strip HTML tags and script injections.
 */
export const sanitizeText = (value: string): string => {
  return value.replace(/<[^>]*>?/gm, '').trim();
};

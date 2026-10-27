/**
 * Customer Authentication & Profile API Client
 * Interfaces with /api/auth/* endpoints
 */

import type { CustomerProfile, SavedAddress, UserSession } from '../types/auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  profile?: CustomerProfile;
  session?: UserSession;
}

/**
 * Register account with backend
 */
export async function registerCustomer(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

/**
 * Sign in customer with backend
 */
export async function loginCustomer(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

/**
 * Synchronize Firebase authenticated session into backend database
 */
export async function syncCustomerSession(payload: {
  uid: string;
  email: string;
  fullName?: string;
  phone?: string;
  authProvider: 'google' | 'phone' | 'password';
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/auth/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

/**
 * Get customer profile
 */
export async function getCustomerProfile(identifier: string): Promise<{ success: boolean; profile?: CustomerProfile; error?: string }> {
  const isEmail = identifier.includes('@');
  const query = isEmail ? `email=${encodeURIComponent(identifier)}` : `memberId=${encodeURIComponent(identifier)}`;
  const res = await fetch(`${API_BASE}/api/auth/profile?${query}`);
  return res.json();
}

/**
 * Update customer profile details
 */
export async function updateCustomerProfile(
  email: string,
  updates: { fullName?: string; phone?: string; preferences?: Record<string, unknown> }
): Promise<{ success: boolean; profile?: CustomerProfile; error?: string }> {
  const res = await fetch(`${API_BASE}/api/auth/update-profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, ...updates }),
  });
  return res.json();
}

/**
 * Save new delivery address
 */
export async function saveCustomerAddress(
  email: string,
  address: Partial<SavedAddress>
): Promise<{ success: boolean; message?: string; profile?: CustomerProfile; error?: string }> {
  const res = await fetch(`${API_BASE}/api/auth/address`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, address }),
  });
  return res.json();
}

/**
 * Delete delivery address
 */
export async function deleteCustomerAddress(
  email: string,
  addressId: string
): Promise<{ success: boolean; message?: string; profile?: CustomerProfile; error?: string }> {
  const res = await fetch(`${API_BASE}/api/auth/address/${addressId}?email=${encodeURIComponent(email)}`, {
    method: 'DELETE',
  });
  return res.json();
}

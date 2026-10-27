/**
 * Customer Authentication & Profile Type Definitions
 * For Noir Dakshin Specialty Coffee E-Commerce
 */

export interface SavedAddress {
  id: string;
  label: string; // e.g. "Home", "Office / Studio", "Roastery Lab"
  fullName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface CustomerPreferences {
  favoriteGrind?: string; // e.g. "Whole Bean", "Filter Fine (Brass Davarah)", "French Press"
  newsletter?: boolean;
  cuppingAlerts?: boolean;
}

export interface CustomerProfile {
  uid: string; // Unique ID (Firebase UID or server ID)
  memberId: string; // Public Member ID e.g. "NR-2026-7841"
  fullName: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'ADMIN' | 'IMS_ENGINEER';
  authProvider: 'password' | 'google' | 'phone';
  savedAddresses: SavedAddress[];
  preferences: CustomerPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  name: string;
  email: string;
  phone: string;
  memberId: string;
  isLoggedIn: boolean;
  role?: 'CUSTOMER' | 'ADMIN' | 'IMS_ENGINEER';
  savedAddresses?: SavedAddress[];
}

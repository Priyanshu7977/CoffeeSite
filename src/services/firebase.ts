/**
 * Official Firebase Authentication & Firestore Service for Noir Dakshin Coffee
 * Configures real Google OAuth, SMS Phone OTP, Email/Password, and Profile Firestore sync.
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  onAuthStateChanged,
  type Auth,
  type User,
  type ConfirmationResult,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  type Firestore,
} from 'firebase/firestore';
import type { CustomerProfile } from '../types/auth';

// Read Firebase client environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

/**
 * Checks whether valid Firebase credentials have been supplied
 */
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.apiKey !== 'your_firebase_api_key_here' &&
      firebaseConfig.projectId &&
      firebaseConfig.projectId !== 'your_firebase_project_id_here'
  );
};

// Initialize Firebase safely
let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;

if (isFirebaseConfigured()) {
  try {
    appInstance = getApps().length ? getApp() : initializeApp(firebaseConfig);
    authInstance = getAuth(appInstance);
    firestoreInstance = getFirestore(appInstance);
  } catch (err) {
    console.warn('Firebase initialization notice:', err);
  }
}

export const auth = authInstance;
export const firestore = firestoreInstance;
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: 'select_account',
});

/**
 * 1. Register with Email and Password
 */
export async function registerWithFirebase(
  fullName: string,
  email: string,
  phone: string,
  password: string
): Promise<{ user: User; profile: CustomerProfile }> {
  if (!authInstance) {
    throw new Error(
      'Firebase is not yet configured. Please add your VITE_FIREBASE_* credentials in your environment variables.'
    );
  }

  const credential = await createUserWithEmailAndPassword(authInstance, email, password);
  const user = credential.user;

  // Update display name on Firebase Auth Profile
  await updateProfile(user, {
    displayName: fullName,
  });

  const memberId = `NR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const profile: CustomerProfile = {
    uid: user.uid,
    memberId,
    fullName,
    email: user.email || email,
    phone,
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

  // Persist to Firestore if available
  if (firestoreInstance) {
    try {
      const userRef = doc(firestoreInstance, 'customers', user.uid);
      await setDoc(userRef, profile);
    } catch (dbErr) {
      console.warn('Firestore profile write notice:', dbErr);
    }
  }

  return { user, profile };
}

/**
 * 2. Sign In with Email and Password
 */
export async function loginWithFirebase(
  email: string,
  password: string
): Promise<{ user: User; profile?: CustomerProfile }> {
  if (!authInstance) {
    throw new Error(
      'Firebase is not yet configured. Please add your VITE_FIREBASE_* credentials in your environment variables.'
    );
  }

  const credential = await signInWithEmailAndPassword(authInstance, email, password);
  const user = credential.user;

  // Fetch customer profile from Firestore
  let profile: CustomerProfile | undefined;
  if (firestoreInstance) {
    try {
      const userRef = doc(firestoreInstance, 'customers', user.uid);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        profile = snapshot.data() as CustomerProfile;
      }
    } catch (dbErr) {
      console.warn('Firestore profile fetch notice:', dbErr);
    }
  }

  return { user, profile };
}

/**
 * 3. Sign In with Google OAuth (Real Google Sign-In)
 */
export async function loginWithGoogleOAuth(): Promise<{
  user: User;
  profile: CustomerProfile;
}> {
  if (!authInstance) {
    throw new Error(
      'Firebase is not yet configured. Please add your VITE_FIREBASE_* credentials in your environment variables.'
    );
  }

  const result = await signInWithPopup(authInstance, googleAuthProvider);
  const user = result.user;

  let profile: CustomerProfile | null = null;

  // Check if profile already exists in Firestore
  if (firestoreInstance) {
    try {
      const userRef = doc(firestoreInstance, 'customers', user.uid);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        profile = snapshot.data() as CustomerProfile;
      }
    } catch (err) {
      console.warn('Firestore read error during Google sign-in:', err);
    }
  }

  // Create new profile if not found
  if (!profile) {
    const memberId = `NR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    profile = {
      uid: user.uid,
      memberId,
      fullName: user.displayName || 'Noir Kaapi Member',
      email: user.email || '',
      phone: user.phoneNumber || '',
      role: 'CUSTOMER',
      authProvider: 'google',
      savedAddresses: [],
      preferences: {
        favoriteGrind: 'Whole Bean',
        newsletter: true,
        cuppingAlerts: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (firestoreInstance) {
      try {
        const userRef = doc(firestoreInstance, 'customers', user.uid);
        await setDoc(userRef, profile);
      } catch (err) {
        console.warn('Firestore profile creation error for Google user:', err);
      }
    }
  }

  return { user, profile };
}

/**
 * 4. Send Password Reset Email
 */
export async function sendFirebasePasswordReset(email: string): Promise<void> {
  if (!authInstance) {
    throw new Error(
      'Firebase is not yet configured. Please add your VITE_FIREBASE_* credentials in your environment variables.'
    );
  }

  await sendPasswordResetEmail(authInstance, email);
}

/**
 * 5. Setup Invisible / Visible Recaptcha for Phone Verification
 */
export function setupRecaptchaVerifier(
  containerId: string,
  onSolved?: () => void
): RecaptchaVerifier {
  if (!authInstance) {
    throw new Error(
      'Firebase is not yet configured. Please add your VITE_FIREBASE_* credentials in your environment variables.'
    );
  }

  return new RecaptchaVerifier(authInstance, containerId, {
    size: 'invisible',
    callback: () => {
      if (onSolved) onSolved();
    },
    'expired-callback': () => {
      console.warn('Recaptcha expired. Please retry.');
    },
  });
}

/**
 * 6. Send SMS Phone OTP
 */
export async function sendPhoneOtpCode(
  phoneNumber: string,
  verifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  if (!authInstance) {
    throw new Error(
      'Firebase is not yet configured. Please add your VITE_FIREBASE_* credentials in your environment variables.'
    );
  }

  // Ensure formatted with E.164 (e.g. +91 9876543210 -> +919876543210)
  const cleanPhone = phoneNumber.replace(/[\s\-()]/g, '');
  const formatted = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`;

  return signInWithPhoneNumber(authInstance, formatted, verifier);
}

/**
 * 7. Confirm Phone OTP
 */
export async function confirmPhoneOtp(
  confirmationResult: ConfirmationResult,
  otpCode: string
): Promise<{ user: User; profile: CustomerProfile }> {
  const credential = await confirmationResult.confirm(otpCode);
  const user = credential.user;

  let profile: CustomerProfile | null = null;
  if (firestoreInstance) {
    try {
      const userRef = doc(firestoreInstance, 'customers', user.uid);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        profile = snapshot.data() as CustomerProfile;
      }
    } catch (err) {
      console.warn('Firestore read error during phone sign-in:', err);
    }
  }

  if (!profile) {
    const memberId = `NR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    profile = {
      uid: user.uid,
      memberId,
      fullName: user.displayName || 'Patron',
      email: user.email || '',
      phone: user.phoneNumber || '',
      role: 'CUSTOMER',
      authProvider: 'phone',
      savedAddresses: [],
      preferences: {
        favoriteGrind: 'Whole Bean',
        newsletter: true,
        cuppingAlerts: true,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (firestoreInstance) {
      try {
        const userRef = doc(firestoreInstance, 'customers', user.uid);
        await setDoc(userRef, profile);
      } catch (err) {
        console.warn('Firestore write error during phone profile creation:', err);
      }
    }
  }

  return { user, profile };
}

/**
 * 8. Update Customer Profile in Firestore
 */
export async function updateFirebaseProfile(
  uid: string,
  updates: Partial<CustomerProfile>
): Promise<void> {
  if (!firestoreInstance) return;

  try {
    const userRef = doc(firestoreInstance, 'customers', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Failed to update Firestore customer profile:', err);
  }
}

/**
 * 9. Sign Out
 */
export async function logoutFirebase(): Promise<void> {
  if (!authInstance) return;
  await signOut(authInstance);
}

/**
 * 10. Listen to Auth State Changes
 */
export function onFirebaseAuthStateChange(callback: (user: User | null) => void): () => void {
  if (!authInstance) {
    return () => {};
  }
  return onAuthStateChanged(authInstance, callback);
}

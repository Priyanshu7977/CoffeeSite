/**
 * Global Authentication Context for Noir Dakshin Specialty Coffee
 * Manages Firebase Auth, Backend Profile Persistence, and Instant Session Restoration.
 */

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { CustomerProfile, SavedAddress, UserSession } from '../types/auth';
import {
  isFirebaseConfigured,
  onFirebaseAuthStateChange,
  registerWithFirebase,
  loginWithFirebase,
  loginWithGoogleOAuth,
  sendFirebasePasswordReset,
  setupRecaptchaVerifier,
  sendPhoneOtpCode,
  confirmPhoneOtp,
  logoutFirebase,
} from '../services/firebase';
import {
  registerCustomer,
  loginCustomer,
  syncCustomerSession,
  getCustomerProfile,
  updateCustomerProfile,
  saveCustomerAddress,
  deleteCustomerAddress,
} from '../utils/authApi';
import { dispatchVIPWelcomeEmail, type AutomatedEmail } from '../utils/emailService';
import type { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';

interface AuthContextType {
  userSession: UserSession | null;
  profile: CustomerProfile | null;
  isLoading: boolean;
  isFirebaseActive: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (fullName: string, email: string, phone: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  sendPhoneOtp: (phone: string, containerId: string) => Promise<ConfirmationResult>;
  verifyPhoneOtp: (confirmationResult: ConfirmationResult, code: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateProfileData: (updates: { fullName?: string; phone?: string; preferences?: Record<string, unknown> }) => Promise<void>;
  addSavedAddress: (address: Partial<SavedAddress>) => Promise<void>;
  removeSavedAddress: (addressId: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode; onEmailDispatched?: (email: AutomatedEmail) => void }> = ({
  children,
  onEmailDispatched,
}) => {
  const [profile, setProfile] = useState<CustomerProfile | null>(() => {
    try {
      const saved = localStorage.getItem('noir_customer_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('noir_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFirebaseActive = isFirebaseConfigured();

  // Keep localStorage synced with session and profile
  const saveSession = (session: UserSession | null, prof: CustomerProfile | null) => {
    setUserSession(session);
    setProfile(prof);

    try {
      if (session) {
        localStorage.setItem('noir_user_session', JSON.stringify(session));
      } else {
        localStorage.removeItem('noir_user_session');
      }

      if (prof) {
        localStorage.setItem('noir_customer_profile', JSON.stringify(prof));
      } else {
        localStorage.removeItem('noir_customer_profile');
      }
    } catch (e) {
      console.warn('Storage sync notice:', e);
    }
  };

  // Re-verify profile on mount
  useEffect(() => {
    const restoreSession = async () => {
      // 1. If Firebase is active, listen to state
      if (isFirebaseActive) {
        const unsubscribe = onFirebaseAuthStateChange(async (firebaseUser) => {
          if (firebaseUser) {
            try {
              const syncRes = await syncCustomerSession({
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                fullName: firebaseUser.displayName || undefined,
                phone: firebaseUser.phoneNumber || undefined,
                authProvider: firebaseUser.providerData[0]?.providerId.includes('google')
                  ? 'google'
                  : firebaseUser.phoneNumber
                  ? 'phone'
                  : 'password',
              });

              if (syncRes.success && syncRes.session && syncRes.profile) {
                saveSession(syncRes.session, syncRes.profile);
              }
            } catch (err) {
              console.warn('Firebase profile sync notice:', err);
            }
          }
          setIsLoading(false);
        });

        return () => unsubscribe();
      }

      // 2. Fallback to stored session re-verification with backend
      if (userSession?.email) {
        try {
          const res = await getCustomerProfile(userSession.email);
          if (res.success && res.profile) {
            const updatedSession: UserSession = {
              name: res.profile.fullName,
              email: res.profile.email,
              phone: res.profile.phone,
              memberId: res.profile.memberId,
              isLoggedIn: true,
              role: res.profile.role,
              savedAddresses: res.profile.savedAddresses,
            };
            saveSession(updatedSession, res.profile);
          }
        } catch {
          // Keep existing cached session
        }
      }

      setIsLoading(false);
    };

    restoreSession();
  }, []);

  /**
   * Email/Password Login
   */
  const loginWithEmail = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Try Firebase if configured
      if (isFirebaseActive) {
        try {
          const { user, profile: fbProfile } = await loginWithFirebase(email, password);
          const syncRes = await syncCustomerSession({
            uid: user.uid,
            email: user.email || email,
            fullName: user.displayName || fbProfile?.fullName,
            phone: user.phoneNumber || fbProfile?.phone,
            authProvider: 'password',
          });

          if (syncRes.session && syncRes.profile) {
            saveSession(syncRes.session, syncRes.profile);
            return;
          }
        } catch (fbErr: unknown) {
          // If Firebase account not found, fall through to backend check (for IMS accounts or backend users)
          console.info('Firebase login returned:', fbErr instanceof Error ? fbErr.message : fbErr);
        }
      }

      // Backend auth check
      const res = await loginCustomer(email, password);
      if (!res.success || !res.session || !res.profile) {
        throw new Error(res.error || 'Invalid email or password.');
      }

      saveSession(res.session, res.profile);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Email/Password Registration
   */
  const registerWithEmail = async (
    fullName: string,
    email: string,
    phone: string,
    password: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      // 1. Firebase Auth Registration if active
      if (isFirebaseActive) {
        await registerWithFirebase(fullName, email, phone, password);
      }

      // 2. Backend authoritative registration & profile creation
      const res = await registerCustomer({
        fullName,
        email,
        phone,
        password,
      });

      if (!res.success || !res.session || !res.profile) {
        throw new Error(res.error || 'Failed to create customer account.');
      }

      saveSession(res.session, res.profile);

      // 3. Dispatch VIP Welcome Email with 10% privilege promo
      if (onEmailDispatched) {
        const emailNotice = dispatchVIPWelcomeEmail(
          fullName,
          email,
          res.profile.memberId,
          phone
        );
        onEmailDispatched(emailNotice);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Google OAuth Login
   */
  const loginWithGoogle = async (): Promise<void> => {
    if (!isFirebaseActive) {
      throw new Error(
        'Google Authentication requires Firebase configuration. Please configure VITE_FIREBASE_* in your environment.'
      );
    }

    setIsLoading(true);
    try {
      const { user, profile: fbProfile } = await loginWithGoogleOAuth();

      const syncRes = await syncCustomerSession({
        uid: user.uid,
        email: user.email || '',
        fullName: user.displayName || fbProfile.fullName,
        phone: user.phoneNumber || fbProfile.phone,
        authProvider: 'google',
      });

      if (syncRes.session && syncRes.profile) {
        saveSession(syncRes.session, syncRes.profile);
      } else {
        const session: UserSession = {
          name: fbProfile.fullName,
          email: fbProfile.email,
          phone: fbProfile.phone,
          memberId: fbProfile.memberId,
          isLoggedIn: true,
          role: fbProfile.role,
          savedAddresses: fbProfile.savedAddresses,
        };
        saveSession(session, fbProfile);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Send Phone SMS OTP
   */
  const sendPhoneOtp = async (phone: string, containerId: string): Promise<ConfirmationResult> => {
    if (!isFirebaseActive) {
      throw new Error(
        'SMS Phone OTP requires Firebase configuration. Please add VITE_FIREBASE_* credentials.'
      );
    }

    const verifier: RecaptchaVerifier = setupRecaptchaVerifier(containerId);
    return sendPhoneOtpCode(phone, verifier);
  };

  /**
   * Verify Phone SMS OTP
   */
  const verifyPhoneOtp = async (
    confirmationResult: ConfirmationResult,
    code: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const { user, profile: fbProfile } = await confirmPhoneOtp(confirmationResult, code);

      const syncRes = await syncCustomerSession({
        uid: user.uid,
        email: user.email || `${user.phoneNumber}@phone.noirkaapi.in`,
        fullName: user.displayName || fbProfile.fullName,
        phone: user.phoneNumber || fbProfile.phone,
        authProvider: 'phone',
      });

      if (syncRes.session && syncRes.profile) {
        saveSession(syncRes.session, syncRes.profile);
      } else {
        const session: UserSession = {
          name: fbProfile.fullName,
          email: fbProfile.email,
          phone: fbProfile.phone,
          memberId: fbProfile.memberId,
          isLoggedIn: true,
          role: fbProfile.role,
          savedAddresses: fbProfile.savedAddresses,
        };
        saveSession(session, fbProfile);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Password Reset Email
   */
  const sendPasswordReset = async (email: string): Promise<void> => {
    if (isFirebaseActive) {
      await sendFirebasePasswordReset(email);
    } else {
      throw new Error(
        'Password reset requires Firebase configuration. Please configure your Firebase environment variables.'
      );
    }
  };

  /**
   * Update Profile
   */
  const updateProfileData = async (updates: {
    fullName?: string;
    phone?: string;
    preferences?: Record<string, unknown>;
  }): Promise<void> => {
    if (!userSession?.email) return;

    const res = await updateCustomerProfile(userSession.email, updates);
    if (res.success && res.profile) {
      const updatedSession: UserSession = {
        ...userSession,
        name: res.profile.fullName,
        phone: res.profile.phone,
      };
      saveSession(updatedSession, res.profile);
    } else {
      throw new Error(res.error || 'Failed to update profile.');
    }
  };

  /**
   * Add Saved Address
   */
  const addSavedAddress = async (address: Partial<SavedAddress>): Promise<void> => {
    if (!userSession?.email) return;

    const res = await saveCustomerAddress(userSession.email, address);
    if (res.success && res.profile) {
      const updatedSession: UserSession = {
        ...userSession,
        savedAddresses: res.profile.savedAddresses,
      };
      saveSession(updatedSession, res.profile);
    } else {
      throw new Error(res.error || 'Failed to save address.');
    }
  };

  /**
   * Remove Saved Address
   */
  const removeSavedAddress = async (addressId: string): Promise<void> => {
    if (!userSession?.email) return;

    const res = await deleteCustomerAddress(userSession.email, addressId);
    if (res.success && res.profile) {
      const updatedSession: UserSession = {
        ...userSession,
        savedAddresses: res.profile.savedAddresses,
      };
      saveSession(updatedSession, res.profile);
    } else {
      throw new Error(res.error || 'Failed to remove address.');
    }
  };

  /**
   * Sign Out
   */
  const logout = async (): Promise<void> => {
    if (isFirebaseActive) {
      try {
        await logoutFirebase();
      } catch (err) {
        console.warn('Firebase signout notice:', err);
      }
    }

    saveSession(null, null);
    sessionStorage.removeItem('noir_ims_auth_session_v1');
  };

  return (
    <AuthContext.Provider
      value={{
        userSession,
        profile,
        isLoading,
        isFirebaseActive,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        sendPhoneOtp,
        verifyPhoneOtp,
        sendPasswordReset,
        updateProfileData,
        addSavedAddress,
        removeSavedAddress,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

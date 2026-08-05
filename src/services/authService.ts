import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged,
  updateProfile,
  ConfirmationResult,
  RecaptchaVerifier,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { UserProfile } from '../types';

export interface AuthStateListener {
  (user: FirebaseUser | null): void;
}

/**
 * Sign in with Google Popup
 */
export async function loginWithGoogle(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    throw new Error(error.message || 'Google sign-in failed. Please try again.');
  }
}

/**
 * Sign in with Email and Password
 */
export async function loginWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    return cred.user;
  } catch (error: any) {
    console.error('Email Sign In Error:', error);
    let msg = error.message;
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      msg = 'Invalid email or password. Please verify your credentials.';
    } else if (error.code === 'auth/user-not-found') {
      msg = 'No account found with this email. Please sign up first.';
    }
    throw new Error(msg);
  }
}

/**
 * Sign up with Email, Password & Display Name
 */
export async function registerWithEmail(
  email: string, 
  pass: string, 
  displayName: string
): Promise<FirebaseUser> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (cred.user && displayName.trim()) {
      await updateProfile(cred.user, { displayName: displayName.trim() });
    }
    return cred.user;
  } catch (error: any) {
    console.error('Email Sign Up Error:', error);
    let msg = error.message;
    if (error.code === 'auth/email-already-in-use') {
      msg = 'An account already exists with this email address. Please sign in.';
    } else if (error.code === 'auth/weak-password') {
      msg = 'Password should be at least 6 characters long.';
    }
    throw new Error(msg);
  }
}

/**
 * Initialize invisible/normal RecaptchaVerifier for Phone OTP
 */
let currentRecaptchaVerifier: RecaptchaVerifier | null = null;

export function getOrCreateRecaptchaVerifier(containerId: string = 'recaptcha-container'): RecaptchaVerifier {
  if (currentRecaptchaVerifier) {
    try {
      currentRecaptchaVerifier.clear();
    } catch {
      // Ignore
    }
  }

  currentRecaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved
    },
    'expired-callback': () => {
      console.warn('reCAPTCHA expired. User should try sending OTP again.');
    }
  });

  return currentRecaptchaVerifier;
}

/**
 * Send Phone Verification OTP
 */
export async function sendPhoneOtp(
  phoneNumberE164: string,
  containerId: string = 'recaptcha-container'
): Promise<ConfirmationResult> {
  try {
    const verifier = getOrCreateRecaptchaVerifier(containerId);
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumberE164, verifier);
    return confirmationResult;
  } catch (error: any) {
    console.error('Send Phone OTP Error:', error);
    throw new Error(error.message || 'Could not send OTP to this number. Please verify the mobile format (+91 XXXXX XXXXX).');
  }
}

/**
 * Confirm Phone Verification Code
 */
export async function confirmPhoneOtp(
  confirmationResult: ConfirmationResult,
  otpCode: string
): Promise<FirebaseUser> {
  try {
    const userCred = await confirmationResult.confirm(otpCode);
    return userCred.user;
  } catch (error: any) {
    console.error('Verify OTP Error:', error);
    throw new Error('Invalid or expired verification code. Please check and try again.');
  }
}

/**
 * Sign Out Current User
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Sign Out Error:', error);
  }
}

/**
 * Listen to Auth State Changes
 */
export function subscribeToAuthState(callback: AuthStateListener): () => void {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}

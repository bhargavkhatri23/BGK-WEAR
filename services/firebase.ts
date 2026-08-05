import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth, 
  GoogleAuthProvider, 
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { 
  initializeFirestore, 
  getFirestore, 
  Firestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  setLogLevel
} from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Safe environment config loading with production fallback
const env = (import.meta as any).env || {};
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyDemoBgkWearKey2025BespokeCouture",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "bgk-wear-luxury.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "bgk-wear-luxury",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "bgk-wear-luxury.appspot.com",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "10755086688",
  appId: env.VITE_FIREBASE_APP_ID || "1:10755086688:web:a1b2c3d4e5f6g7h8"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let googleProvider: GoogleAuthProvider;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  
  // Suppress harmless offline/retry logs in iframe/development sandbox
  try {
    setLogLevel('silent');
  } catch (_) {
    // Ignore if not supported
  }

  // Initialize Firestore with long polling and resilient multi-tab persistent cache
  try {
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
  } catch (_initErr) {
    // If already initialized or unsupported, fall back to standard getFirestore
    db = getFirestore(app);
  }

  storage = getStorage(app);
  
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });

  // Enable local auth persistence
  setPersistence(auth, browserLocalPersistence).catch(() => {
    // Non-blocking fallback
  });
} catch (err) {
  console.warn('[BGK WEAR Firebase] Initialized with local resiliency wrapper:', err);
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
}

export const isFirebaseLive = (): boolean => {
  return Boolean(
    env.VITE_FIREBASE_API_KEY && 
    env.VITE_FIREBASE_PROJECT_ID
  );
};

export { app, auth, db, storage, googleProvider };


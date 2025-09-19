import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Build config. We prefer env vars; legacy fallbacks kept only to avoid crashes, but flagged.
const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
};

// Detect if env values are present (at least apiKey, authDomain, projectId, appId are required)
export const isFirebaseConfigured = Boolean(
  envConfig.apiKey && envConfig.authDomain && envConfig.projectId && envConfig.appId
);

// Legacy fallback values (3rd-party project). We avoid using analytics when falling back.
const fallbackConfig = {
  apiKey: 'AIzaSyAaxTRX9Ly48XL0acsZOKm8SgptZDcRR8A',
  authDomain: 'feedback-96208.firebaseapp.com',
  projectId: 'feedback-96208',
  storageBucket: 'feedback-96208.firebasestorage.app',
  messagingSenderId: '772048271719',
  appId: '1:772048271719:web:a8a3ba30591912d9a62e05',
  // No measurementId on purpose to prevent analytics in fallback
} as const;

const firebaseConfig = (isFirebaseConfigured ? envConfig : fallbackConfig) as any;

const app = initializeApp(firebaseConfig);

// Dev-time debug: print which config values are being used (avoid printing secrets in production)
if (import.meta.env.DEV) {
  try {
    // Only print non-secret fields and presence of apiKey
    // eslint-disable-next-line no-console
    console.debug('Firebase config used:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: Boolean(firebaseConfig.apiKey),
  fromEnv: isFirebaseConfigured,
    });
  } catch (e) {
    // ignore
  }
}

// Initialize Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics is optional and may throw in non-browser environments — initialize safely.
try {
  // Only initialize Analytics when using env config and measurementId is provided.
  const canUseAnalytics = isFirebaseConfigured && Boolean(envConfig.measurementId) && typeof window !== 'undefined';
  if (canUseAnalytics) {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getAnalytics(app as any);
  } else if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('Firebase Analytics disabled (no measurementId or not configured).');
  }
} catch (e) {
  // ignore analytics initialization errors (e.g., server-side or blocked)
}

export default app;

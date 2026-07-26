/**
 * Firebase Integration Module
 * Prepares the application for Firebase Authentication and Firestore Database.
 * Safe graceful fallback to local persistent state if config is not provisioned yet.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let isFirebaseConfigured = false;

try {
  // Dynamically import or load config if present
  const configModule = (import.meta as any).glob('/firebase-applet-config.json', { eager: true });
  const configKeys = Object.keys(configModule);

  if (configKeys.length > 0) {
    const firebaseConfig = (configModule[configKeys[0]] as any).default || configModule[configKeys[0]];
    if (firebaseConfig && firebaseConfig.apiKey) {
      if (!getApps().length) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApp();
      }

      db = getFirestore(app);
      auth = getAuth(app);
      isFirebaseConfigured = true;
      console.log('⚡ Firebase Auth & Firestore successfully initialized for CampusFind AI!');
    }
  }
} catch (e) {
  console.warn('Firebase config file not found or inactive. Running in local reactive state mode.', e);
}

export { app, auth, db, isFirebaseConfigured };

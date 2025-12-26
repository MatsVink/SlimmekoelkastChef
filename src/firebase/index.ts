'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

// This function ensures that Firebase is initialized only once.
function initializeFirebaseSDKs() {
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }
  auth = getAuth(firebaseApp);
  firestore = getFirestore(firebaseApp);
}

// Call the initialization function immediately.
initializeFirebaseSDKs();

// Export the initialized instances.
export { firebaseApp, auth, firestore };

// Export hooks and providers.
export * from './provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';

// IMPORTANT: This is a legacy function and should not be used.
// The SDKs are now initialized eagerly.
export function initializeFirebase(): { firebaseApp: FirebaseApp; auth: Auth; firestore: Firestore } {
  return { firebaseApp, auth, firestore };
}

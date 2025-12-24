import { initializeApp, getApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from './config'; 

// IMPORTANT: DO NOT USE ON THE CLIENT

function initializeFirebaseAdmin() {
  if (!getApps().length) {
    return initializeApp({
        projectId: firebaseConfig.projectId
    });
  }
  return getApp();
}

const app = initializeFirebaseAdmin();
const db = getFirestore(app);

export { app, db };

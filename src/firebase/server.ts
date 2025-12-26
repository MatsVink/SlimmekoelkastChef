import { initializeApp, getApp, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// IMPORTANT: DO NOT USE ON THE CLIENT

let app: App;
if (!getApps().length) {
  app = initializeApp();
} else {
  app = getApp();
}

const db: Firestore = getFirestore(app);

export { app, db };

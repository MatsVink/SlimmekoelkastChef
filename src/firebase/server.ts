import { initializeApp, getApp, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// IMPORTANT: DO NOT USE ON THE CLIENT

let app: App;
if (!getApps().length) {
  app = initializeApp({
      // The projectId is discovered from the environment automatically
      // when deployed to a Google Cloud environment.
  });
} else {
  app = getApp();
}

const db: Firestore = getFirestore(app);

export { app, db };

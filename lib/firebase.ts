"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  getAuth,
  indexedDBLocalPersistence,
  initializeAuth,
  type Auth,
} from "firebase/auth";
import { getDatabase } from "firebase/database";

const config = {
  // Firebase web configuration identifies the public client app; it is not a
  // private credential. Environment values take precedence for deployments.
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyCB3w-KJLytDcrcmoeE2eouNFL66D5yxv4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "studio-1605945732-d0a2d.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ?? "https://studio-1605945732-d0a2d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "studio-1605945732-d0a2d",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "studio-1605945732-d0a2d.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "291694258455",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:291694258455:web:6572543d49d1abb6b0af52",
};

export const firebaseConfigured = Boolean(
  config.apiKey && config.authDomain && config.projectId && config.appId
);

const app = firebaseConfigured
  ? getApps().length
    ? getApp()
    : initializeApp(config)
  : null;

function createAuth(app: FirebaseApp): Auth {
  try {
    // This app only uses anonymous auth. `getAuth` installs a proactive
    // popup/redirect resolver, which loads Google's gapi iframe and its
    // third-party cookies even though no Google sign-in flow exists here.
    return initializeAuth(app, {
      persistence: [
        indexedDBLocalPersistence,
        browserLocalPersistence,
        browserSessionPersistence,
      ],
    });
  } catch (error) {
    if ((error as { code?: string }).code === "auth/already-initialized") {
      return getAuth(app);
    }
    throw error;
  }
}

export const firebaseAuth = app ? createAuth(app) : null;
export const realtimeDatabase = app ? getDatabase(app) : null;

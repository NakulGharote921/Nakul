"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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

export const firebaseAuth = app ? getAuth(app) : null;
export const realtimeDatabase = app ? getDatabase(app) : null;

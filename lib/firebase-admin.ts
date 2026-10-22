import "server-only";

import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

function app() {
  if (getApps().length) return getApp();
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("Firebase Admin is not configured.");
  return initializeApp({ credential: cert(JSON.parse(raw)) });
}

export async function verifyFirebaseToken(token: string): Promise<string> {
  const decoded = await getAuth(app()).verifyIdToken(token);
  return decoded.uid;
}

export function adminFirestore() {
  return getFirestore(app());
}

export const adminServerTimestamp = () => FieldValue.serverTimestamp();

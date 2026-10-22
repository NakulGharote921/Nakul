# Firebase portfolio chat setup

1. In Firebase Console, enable **Authentication → Sign-in method → Anonymous**.
2. The chat uses **Realtime Database**. Make sure a Realtime Database instance exists (the URL is `https://studio-1605945732-d0a2d-default-rtdb.asia-southeast1.firebasedatabase.app`).
3. Open **Realtime Database → Rules**, paste [`database.rules.json`](./database.rules.json), and publish it (or deploy with the Firebase CLI).
4. Copy the Firebase web configuration into `.env.local` using the `NEXT_PUBLIC_FIREBASE_*` variables in `.env.example`.
5. Keep the existing `OPENAI_*` variables server-only. The browser sends the conversation to `/api/chat` and stores both the user message and the streamed assistant reply in the visitor's own session.

Messages are stored at `assistantSessions/{uid}/messages/{pushId}`. The rules only let a visitor read and create messages in their own session. If the database is unavailable, the assistant falls back to a local in-memory conversation so chat keeps working.

`firebase-admin.ts` and `FIREBASE_SERVICE_ACCOUNT_JSON` are optional and currently unused by the chat route.

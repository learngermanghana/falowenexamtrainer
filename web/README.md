# Falowen Exam Coach – Frontend

This React app guides learners through recording or typing answers for speaking practice and now connects directly to Firebase Firestore for student profiles and scores.

## Setup
1. Install dependencies (from the repo root):
   ```
   cd web
   npm install
   ```
2. Create a `.env` file in `web/` with your Firebase project settings:
   ```
   REACT_APP_FIREBASE_API_KEY=xxxx
   REACT_APP_FIREBASE_AUTH_DOMAIN=xxxx.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=xxxx
   REACT_APP_FIREBASE_STORAGE_BUCKET=xxxx.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=xxxx
   REACT_APP_FIREBASE_APP_ID=xxxx
   REACT_APP_FIREBASE_VAPID_KEY=your-web-push-key
   ```
   These values are provided in Vercel and are required for Firestore reads and writes.

## Development
Start the dev server from inside `web/`:
```
npm start
```
The app runs at `http://localhost:3000`.

## Production build
To generate static assets for hosting from disk or any static server:
```
npm run build
```
The build output is written to `web/build/`.

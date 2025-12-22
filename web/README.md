# Falowen Learning Hub – Frontend

This React app guides learner through recording or typing answers for speaking practice and now connects directly to Firebase Firestore for student profiles and scores.

## Setup
1. Install dependencies (from the repo root):
   ```
   cd web
   npm install
   ```
   If your environment injects an HTTP(S) proxy that blocks the npm registry, the included
   [`.npmrc`](./.npmrc) pins the registry to `https://registry.npmjs.org/` so `npm install`
   can bypass the proxy-specific override. If you still see 403 or network errors, temporarily
   unset `HTTP_PROXY`/`HTTPS_PROXY` before installing so npm can reach the public registry
   directly.
2. Create a `.env` file in `web/` with your Firebase project settings:
   ```
   REACT_APP_FIREBASE_API_KEY=xxxx
   REACT_APP_FIREBASE_AUTH_DOMAIN=xxxx.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=xxxx
   REACT_APP_FIREBASE_STORAGE_BUCKET=xxxx.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=xxxx
   REACT_APP_FIREBASE_APP_ID=xxxx
   REACT_APP_FIREBASE_VAPID_KEY=your-web-push-key
   # Optional: override the URL used in password reset and email verification links
   REACT_APP_AUTH_CONTINUE_URL=https://your-app-url
   ```
   These values are provided in Vercel and are required for Firestore reads and writes.

3. In the Firebase Console, create a **Web App** under your project and enable the features this UI needs:
   - **Authentication → Sign-in method**: enable **Email/Password**. The email verification and password reset flows will use the
     `REACT_APP_AUTH_CONTINUE_URL` if set; otherwise they default to the app origin.
   - **Firestore Database**: create a database (Start in production mode for real users). The app reads and writes student
     profiles and placements here.
   - **Cloud Messaging** (optional): generate a Web Push certificate key and paste it into
     `REACT_APP_FIREBASE_VAPID_KEY` to enable in-browser notifications.
   - (Optional) **Authentication → Templates**: update the verification and reset email templates to include your app name and
     a link back to the host you set in `REACT_APP_AUTH_CONTINUE_URL`.

### Checking who is verified
- Go to **Authentication → Users** in the Firebase Console to see the **Email verified** column. It is `true` only after a
  student clicks the verification link.
- Accounts created before verification emails were configured will still be listed with `Email verified: false`. Have the
  student log in and resend the verification email from the app, or use the console's user menu to **Send verification email**;
  the flag will flip to `true` once they confirm.

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

## Offline experience
- A service worker precaches the app shell, manifest, and offline fallback page in production builds. After first load, repeat
  visits will continue to show the UI even if the network is temporarily unavailable.
- Navigation requests fall back to `offline.html` when the network is unreachable, while previously fetched static assets are
  served from the cache.

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
   # Optional: random learner testimonial source used on the public landing page
   REACT_APP_STUDENT_REVIEWS_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/e/.../pub?output=csv
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

### Historical partnership consent and receipts (superseded)

The public `/partnerships` page preserves the current institutional/referral wording and loads the versioned existing terms from the Admin Firebase backend. Applicants can download an unsigned sample, consent, type their electronic signature and save a receipt immediately bearing the authorised Falowen director signature. Signing and partnership approval are separate. Completed PDFs are private; downloading uses a random receipt capability in a POST body, never an email-only lookup or token in a URL. Referral partners provide Ghana payout details with separate consent; full account numbers are encrypted server-side and omitted from PDFs. Learner invitations and signup attribution retain the existing same-email flow.

The new public `/api/referrals/agreement-terms`, `/agreement-sample`, `/payout-banks`, `/apply-signed` and `/agreement-copy` endpoints proxy to the existing Admin API. Deploy that backend first. It needs the private director signature installed by the owner (or authorised private Drive access), the existing Paystack secret and email configuration. Automatic commissions are disabled until explicitly enabled and tested: only approved partners with verified payout accounts can earn 10% of a referred learner's first verified tuition payment. Signup alone, later instalments, renewals and institutional sponsorship earn nothing; refunds cancel commission. Merchant transfer settings, available balance and provider confirmations govern payout completion. The Admin repository owns the signing/PDF storage, commission ledger, transfer/refund handling and owner review interface; see its `docs/organisation-enrolment.md` for setup and release checks.

### Organisation partner programme

`/partnerships` now has one organisation-only programme. An agency signs the agreement, downloads its signed receipt and continues to `/organisation-enrolment` to add students. The signed contact details and agreement reference prefill the list form through session storage. Admin verifies the referenced agreement/email, reviews the list and creates one group Paystack invoice with the agreed partner share deducted. The organisation keeps that share and pays Falowen the net tuition; no bank details, split or separate payout are needed. After verified payment, Falowen completes student enrolment. Clients paying themselves use normal signup at full tuition and earn no commission. Old referral links offer normal signup without claiming attribution. New referral application/claim writes are closed in the Admin backend; old signed records remain available for audit. Deploy the matching Admin API update before this public page; verify signing, prefill, list approval and the net invoice end to end.

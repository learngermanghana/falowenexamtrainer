# Falowen Exam Coach

Falowen Exam Coach is a two-part application that helps learners practice spoken German exam tasks. The backend (Express + OpenAI) evaluates answers and stores lightweight history, while the frontend (React) guides users through placement and speaking practice.

## Repository structure
- `functions/functionz/` – Express backend with routes for speaking analysis, placement, and task scheduling.
- `web/` – React frontend that records audio/text answers and calls the backend.
- `api/`, `vercel.json` – Deployment helpers for serverless environments (the API entry re-exports the Express app from `functions/functionz/app.js`).

## Prerequisites
- Node.js 18+ and npm
- An OpenAI API key with access to the `gpt-4o-mini` family

## Configuration
Create a `.env` file in the repository root for the backend:

```
OPENAI_API_KEY=your-key-here
# Optional overrides
PORT=5000
```

Create a `.env` file inside `web/` for the frontend (optional when using the default localhost backend):

```
REACT_APP_BACKEND_URL=http://localhost:5000
```

## Configure Firebase for auth + Firestore
The React app reads/writes student data from Firestore and relies on Firebase Authentication for login, email verification, and
password resets. To set it up:

1. In the Firebase Console, create a **Web App** and copy the config values into `web/.env` (see `web/README.md` for the full
   list). Set `REACT_APP_AUTH_CONTINUE_URL` to the host you want verification/reset links to return to.
2. Under **Authentication → Sign-in method**, enable **Email/Password**. (Optional) Customize the verification and reset email
   templates to mention your app host.
3. Under **Firestore Database**, create a database (production mode for real users). The app stores student profiles and
   placement history here.
4. (Optional) Under **Cloud Messaging**, create a Web Push certificate key and set `REACT_APP_FIREBASE_VAPID_KEY` to enable
   browser notifications.
5. For server-side features (Paystack webhook, Sheets sync), deploy the Cloud Functions as described below so they can access
   the same project resources.

### Check whether a student is verified
- In the Firebase Console, open **Authentication → Users**. The **Email verified** column shows `true` for verified students
  and `false` for accounts that have not clicked the verification link yet.
- If someone signed up before you finished configuring verification emails, their account remains listed with `Email verified`
  set to `false`; they can log in and request a new verification email (or you can click the triple-dot menu in the Users table
  to **Send verification email** from the console). No data is lost—the flag flips to `true` as soon as they verify.

## Automate Firebase signups to Google Sheets
If your new signup flow writes student records to Firestore, you can mirror those
rows into the approval spreadsheet with the helper script at
`functionz/googleSheetsSync.js`:

1. Create a Google Cloud service account with "Google Sheets API" access and a
   Firebase Admin SDK key. Download the JSON key file and either point
   `GOOGLE_SERVICE_ACCOUNT_FILE` to it or base64-encode it into
   `GOOGLE_SERVICE_ACCOUNT_KEY`.
2. Share the destination sheet (e.g., your approval sheet) with the service
   account email. Set `GOOGLE_SHEETS_ID` to the sheet ID (the long string in the
   sheet URL) and optionally `GOOGLE_SHEETS_RANGE` to change the tab/range
   (default: `Signups!A:E`).
3. Ensure each Firestore signup document contains `firstName`, `lastName`,
   `email`, `level`, `createdAt`, and a boolean `syncedToSheets: false` field so
   the script can find unsent entries. The script marks `syncedToSheets` true
   and adds a `syncedAt` timestamp after a successful append.
4. Run the sync from the repository root:
   ```
   GOOGLE_SHEETS_ID="<target_sheet_id>" \
   GOOGLE_SERVICE_ACCOUNT_FILE=./service-account.json \
   node functionz/googleSheetsSync.js
   ```

You can schedule this script (e.g., with cron) or wrap it in a Cloud Function
for near-real-time mirroring between Firebase and Google Sheets.

## Deploy the Cloud Functions (Firestore trigger + Paystack webhook)
The Firebase Functions bundle exposes two entry points:

- `api`: an Express app that now includes the Paystack webhook at
  `/paystack/webhook`
- `onStudentCreated`: a Firestore trigger that mirrors new student docs to the
  Students Google Sheet

To deploy them:

1. Install the Firebase CLI if needed: `npm install -g firebase-tools`.
2. Authenticate and pick your project: `firebase login` then
   `firebase use <your-project-id>`.
3. From the repository root, enter the functions directory:
   ```
   cd functions
   ```
4. Set the required secrets (for both the API and the sheet sync):
   ```
   firebase functions:secrets:set GOOGLE_SERVICE_ACCOUNT_JSON_B64   # base64 of your service-account JSON
   firebase functions:secrets:set STUDENTS_SHEET_ID                 # sheet ID from the URL
   firebase functions:secrets:set STUDENTS_SHEET_TAB                # optional; defaults to "students"
   firebase functions:secrets:set PAYSTACK_SECRET                   # your Paystack secret key for webhook verification
   ```
5. Deploy the functions (both the API + webhook and the Firestore trigger):
   ```
   firebase deploy --only functions:api,functions:onStudentCreated
   ```
6. Confirm the deployment in the Firebase console or with
   `firebase functions:list`, and watch logs while testing:
   ```
   firebase functions:log --only onStudentCreated
   firebase functions:log --only api
   ```

### Point Paystack to the webhook
After deploying, configure the webhook URL in your Paystack dashboard to point
to the HTTPS endpoint (replace `<project>` with your Firebase project ID):

```
https://europe-west1-<project>.cloudfunctions.net/api/paystack/webhook
```

Include the student code (preferred) or email in your Paystack transaction
metadata (e.g., `studentCode: "ABC123"`). The webhook will verify the
`PAYSTACK_SECRET`, add the new payment to the student's totals, update the
Firestore document, and upsert the row in the Students sheet.

### Configure level-specific tuition fees
- Update `web/src/data/levelFees.js` to set the GH₵ tuition amount for each CEFR
  level (A1, A2, B1, B2, etc.). The signup form reads these values to set each
  student's `tuitionFee`, `balanceDue`, and `paymentStatus`.
- Make sure your Paystack payment pages/links for each level charge the same
  amounts so webhook callbacks reconcile correctly with the stored tuition.

## Legacy student login (pre-Firebase accounts)
For historic student rows that only stored an email, student code, and a
bcrypt-hashed password in Firestore, the backend exposes a `/legacy/login`
endpoint. It validates the supplied password against the stored hash and
returns the student record without the password.

Example request (from the repository root while the backend is running):

```
curl -X POST http://localhost:5000/api/legacy/login \
  -H "Content-Type: application/json" \
  -d '{"email":"moxflex@live.com","password":"<plaintext password>"}'
```

You can also pass `studentCode` instead of `email` when the document ID is
known:

```
{
  "studentCode": "ABC123",
  "password": "<plaintext password>"
}
```

On success, the response includes the `id` (doc ID) and all student fields
except `password`, allowing the React app to display the legacy profile data.

## Install dependencies
From the repository root, install backend dependencies:

```
npm install
```

Then install frontend dependencies:

```
cd web
npm install
```

## Run locally
1. **Start the backend** (from the repository root):
   ```
   npm start
   ```
   The API listens on `http://localhost:5000` by default and stores user history under `functions/functionz/data/`.

2. **Start the frontend** (new terminal):
   ```
   cd web
   npm start
   ```
   The React dev server runs on `http://localhost:3000` and proxies requests to the backend URL set by `REACT_APP_BACKEND_URL`.

## Build for local static hosting
To produce a production build of the frontend that can be hosted from disk or any static server:

```
cd web
npm run build
```

The optimized static files are written to `web/build/`. You can serve that folder locally with a static file server (for example, `npx serve build`) while keeping the backend running.

## Troubleshooting
- Ensure `OPENAI_API_KEY` is set before starting the backend; requests will fail without it.
- Audio uploads are limited to 25 MB and stored under `functionz/uploads/` when running locally.

## Deploying to Vercel
- The repository includes a `vercel.json` that builds the React app from `web/` and deploys the Express API from `api/`.
- When running on Vercel, the backend writes user history to `/tmp/falowen-exam-coach/` to comply with the platform's read-only filesystem.
- The frontend calls the API on the same origin by default in production; set `REACT_APP_BACKEND_URL` only when pointing to a different API URL.
- Make sure `OPENAI_API_KEY` is configured as a Vercel environment variable before deploying.

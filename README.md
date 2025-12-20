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

## Deploy the Firestore trigger that writes to the Students sheet
The Cloud Function `onStudentCreated` (in `functions/index.js`) listens to
`students/{studentCode}` and mirrors each new document to your Students Google
Sheet. To deploy it:

1. Install the Firebase CLI if needed: `npm install -g firebase-tools`.
2. Authenticate and pick your project: `firebase login` then
   `firebase use <your-project-id>`.
3. From the repository root, enter the functions directory:
   ```
   cd functions
   ```
4. Set the required secrets so the function can reach your sheet.
   The CLI will prompt you to paste each value (no quotes needed):
   ```
   firebase functions:secrets:set GOOGLE_SERVICE_ACCOUNT_JSON_B64   # paste the full base64 of your service-account JSON
   firebase functions:secrets:set STUDENTS_SHEET_ID                 # paste the sheet ID from the URL
   firebase functions:secrets:set STUDENTS_SHEET_TAB                # optional; defaults to "students"
   ```
   If you prefer not to base64-encode the key, you can set
   `GOOGLE_SERVICE_ACCOUNT_JSON` directly with the raw JSON instead of
   `GOOGLE_SERVICE_ACCOUNT_JSON_B64`.
5. Deploy just the trigger (or include `api` if needed):
   ```
   firebase deploy --only functions:onStudentCreated
   ```
6. Confirm the deployment in the Firebase console or with
   `firebase functions:list`, and watch logs with
   `firebase functions:log --only onStudentCreated` when testing a signup.

### Fixing "Not in a Firebase app directory" errors
The Firebase CLI looks for a `firebase.json` file to know where your
functions source lives. This repository now includes a minimal
`firebase.json` at the root that points to the `functions/` folder. If you
see `Error: Not in a Firebase app directory (could not locate
firebase.json)`, make sure you run Firebase commands from the repository
root (`/workspace/falowenexamtrainer`), or re-create the config with:

```
cat > firebase.json <<'EOF'
{
  "functions": {
    "source": "functions"
  }
}
EOF
```

After that, rerun `firebase use <project-id>` and the deploy command.

### Using Vercel environment variables
- Vercel environment variables only apply to the frontend/API deployed on
  Vercel. The Firestore trigger runs in Google Cloud Functions and needs its
  own secrets via `firebase functions:secrets:set` (above).
- To keep values in sync, add the same entries in Vercel for reference:
  ```
  vercel env add GOOGLE_SERVICE_ACCOUNT_JSON_B64
  vercel env add STUDENTS_SHEET_ID
  vercel env add STUDENTS_SHEET_TAB   # optional
  ```
  Use the same base64-encoded key and sheet ID you supplied to Firebase.

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

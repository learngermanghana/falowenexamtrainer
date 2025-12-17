# Falowen Exam Coach

Falowen Exam Coach is a two-part application that helps learners practice spoken German exam tasks. The backend (Express + OpenAI) evaluates answers and stores lightweight history, while the frontend (React) guides users through placement and speaking practice.

## Repository structure
- `functionz/` – Express backend with routes for speaking analysis, placement, and task scheduling.
- `web/` – React frontend that records audio/text answers and calls the backend.
- `api/`, `vercel.json` – Deployment helpers for serverless environments.

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
   The API listens on `http://localhost:5000` by default and stores user history under `functionz/data/`.

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

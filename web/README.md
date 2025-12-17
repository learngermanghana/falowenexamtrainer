# Falowen Exam Coach – Frontend

This React app guides learners through recording or typing answers for speaking practice and connects to the Express backend in the repository root.

## Setup
1. Install dependencies (from the repo root):
   ```
   cd web
   npm install
   ```
2. Optionally set a custom backend URL in `web/.env`:
   ```
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```

## Development
Start the dev server from inside `web/`:
```
npm start
```
The app runs at `http://localhost:3000` and uses the backend URL from `REACT_APP_BACKEND_URL` (defaults to `http://localhost:5000`).

## Production build
To generate static assets for hosting from disk or any static server:
```
npm run build
```
The build output is written to `web/build/`.

## Billing configuration (Paystack)

Save Paystack plan codes, exam prep price, and course level pricing in `src/data/paystackPlans.js`. This keeps
Paystack-specific values in one place so components like the plan page and access context can import them without
hardcoding dashboard values in multiple files. Update the placeholder plan codes with the values generated in your
Paystack dashboard (Subscriptions → Plans).

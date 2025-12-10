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

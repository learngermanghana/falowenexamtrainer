# Building a Goethe Exam Preparation Recorder Page (Falowen Stack)

This guide shows how to build an in-app Goethe speaking prep page equivalent to the Apps Script flow you shared, but using this repository's React + Firebase Functions architecture.

## 1) Target experience

The page should let the student:

1. authenticate with their Falowen account,
2. verify student code,
3. pick level (A1/A2/...)
4. pick Teil/task prompt,
5. record audio,
6. submit and receive:
   - transcript,
   - scores (pronunciation, grammar, content, fluency),
   - task-structure flags,
   - English feedback,
   - German improved version,
7. optionally open 3 AI partner lines for role-play.

## 2) Architecture mapping (Apps Script -> this repo)

- **Apps Script `validateCode` + sheets lookup**
  -> Firebase Function endpoint backed by Google Sheets service helpers (or Firestore cache).
- **Apps Script `getLevels`, `getQuestions`**
  -> Firebase Function endpoint reading `Exams_list` sheet.
- **Apps Script `getPartnerScript`**
  -> Firebase Function endpoint using OpenAI Responses API.
- **Apps Script `evaluateAudio`**
  -> Firebase Function endpoint handling multipart audio upload, OpenAI transcription + marking, then persisting result.
- **Apps Script Drive storage**
  -> Firebase Storage bucket (preferred) with signed URL, instead of public Drive links.

## 3) Backend endpoints to add

Create routes under `functions/functionz/routes/` and wire from `functions/functionz/server.js`.

### `POST /api/goethe/validate-code`
Request:

```json
{ "code": "STU-123" }
```

Response:

```json
{ "ok": true, "code": "STU-123", "name": "Student Name", "level": "A1", "levelAccess": ["A1", "A2"] }
```

### `GET /api/goethe/levels`
Returns distinct levels from `Exams_list`.

### `GET /api/goethe/questions?level=A1`
Returns rows:

```json
[
  {
    "id": "12",
    "level": "A1",
    "part": "Teil 2 — Ask & Answer (German)",
    "prompt": "Familie",
    "keyword": "Eltern"
  }
]
```

### `POST /api/goethe/partner-script`
Request:

```json
{ "level": "A1", "questionId": "12" }
```

Response:

```json
{ "lines": ["Wie heißt du?", "Wo wohnst du?", "Wie alt bist du?"] }
```

### `POST /api/goethe/evaluate-audio`
Use multipart form-data:
- `audio` (blob/webm|wav|mp3|m4a)
- `code`
- `level`
- `questionId`

Response (normalized):

```json
{
  "scores": { "pronunciation": 3.5, "grammar": 3.0, "content": 4.0, "fluency": 3.5 },
  "total": 14.0,
  "feedback_text": "- ...",
  "normalized_transcript": "...",
  "ask_info_present": true,
  "give_info_present": true,
  "request_present": false,
  "reaction_present": true,
  "audioFileUrl": "https://..."
}
```

## 4) Core backend implementation notes

1. Reuse central OpenAI client patterns from `functions/functionz/openaiClient.js` for:
   - Responses API (marking + partner lines),
   - Audio transcription endpoint.
2. Enforce German transcription (`language: de`) and retry once when transcript appears English-heavy.
3. Rebuild your `_buildMarkingPrompt_` logic as a dedicated utility module (for testability).
4. Clamp score fields to 0..5, recompute total server-side.
5. Persist attempt metadata:
   - uid/studentCode/level/questionId
   - transcript + normalized transcript
   - model versions
   - timestamps + storage path.

## 5) Front-end page (React)

Implement a page component (e.g. `web/src/components/GoetheRecorderPage.js`) with this state machine:

- `idle` -> `validating` -> `ready` -> `recording` -> `uploading` -> `scored`.

UI sections:

1. **Identity card** (student code prefilled from profile, editable fallback).
2. **Task selection** (level dropdown, question dropdown with Teil labels).
3. **Recorder controls**
   - start/pause/stop,
   - timer + size guard,
   - audio preview playback.
4. **AI tools**
   - “Generate partner lines” button.
5. **Results panel**
   - score chips,
   - feedback bullets,
   - normalized transcript,
   - improved German response.

Accessibility essentials:
- keyboard-operable recording controls,
- aria-live region for scoring state,
- explicit mic permission error text.

## 6) Security and privacy

- Keep `OPENAI_API_KEY` only in backend env vars/secrets.
- Do not expose raw keys to web client.
- Store audio in private Firebase Storage paths per user; return short-lived signed URLs.
- Add rate limits per uid/IP on evaluate endpoint.
- Log minimal PII; avoid full transcript in high-verbosity logs.

## 7) Data source compatibility (Google Sheets)

To keep parity with current operations, support these columns:

- **students**: `StudentCode`, `Name`, `Level`, `LevelAccess`
- **Exams_list**: `Level`, `Teil`, `Topic/Prompt`, `Keyword/Subtopic`

Normalize headers case-insensitively and support aliases exactly as in your script.

## 8) Testing checklist

Backend:
- code validation happy/invalid paths,
- level/question extraction,
- transcript retry path,
- marking JSON parse fallback,
- score normalization.

Frontend:
- render + happy path submission,
- microphone denied path,
- partner lines render,
- score display formatting.

## 9) Rollout plan

1. Ship backend endpoints behind feature flag.
2. Ship page to internal users only.
3. Validate A1/A2 scoring consistency with manual tutor review sample.
4. Enable for all German learners.
5. Decommission Apps Script link once adoption is stable.

## 10) Practical shortcut

If you want minimal migration effort first:

- Keep existing Google Sheets as source of truth,
- Move only OpenAI + audio handling into Firebase Functions,
- Keep current Speech Trainer page but switch button to new in-app page when stable.

# Falowen Live Speak — free private voice test (no payment)

## Scope
This version is for testing a natural German AI speaking partner before deciding if an optional paid add-on is worth offering. **No Paystack purchase, checkout, subscription, or payment entitlement is implemented for Live Speak.** The normal tuition routes are unchanged.

- Two **free** five-minute sessions for each signed-in student, available for seven days from activation. Credits are issued once per Firebase user.
- Up to ten AI turns in each five-minute session, including the initial spoken greeting.
- Students record short (2–20 second) German answers; the server first transcribes **without giving corrections**. The browser shows what it heard, lets students play their original local recording and review/edit or record again, then a separately authenticated confirmation triggers at most one correction and an audible follow-up. The recordings stay local/transient.
- A1–C2 supported, with native-standard-German speech instruction. This is *turn-by-turn*, not a simultaneous or interruptible realtime voice call.
- The page is reachable at `/campus/live-speak` by signed-in learners, but only signed-in students can activate the pilot. It is deliberately not advertised on the main homepage or billing page.
- Goethe Free Sprechen Chat and existing Speaking Trainer are unchanged.

## Direct-link pilot access and emergency shutdown

The voice beta is not advertised on the homepage or billing screens. After the **frontend and Firebase API** are deployed, signed-in Falowen students can visit `https://www.falowen.app/campus/live-speak` when given the link.

- `LIVE_SPEAK_ENABLED` defaults to enabled for this tightly capped direct-link pilot. Set **`LIVE_SPEAK_ENABLED=false`** in the Firebase runtime to stop new claims, sessions, and AI voice requests.
- `LIVE_SPEAK_MONTHLY_TURN_CAP=40` is the default ceiling: **40 reserved provider-operation units across all students per calendar month**. An AI greeting reserves 1; every student recording reserves 2 (transcription plus the potential confirmed tutor reply). Unconfirmed/retried recordings still count toward the cap. Configurable 1–500. This cap is not a dollar-denominated budget.
- The server requires a valid Firebase ID token and matching student profile; only two five-minute sessions per account, maximum ten turns per session.
- `OPENAI_API_KEY` must be present in Firebase Functions. Defaults: **`gpt-4o-transcribe`** (upgraded accuracy, German language + German-context prompt, log probabilities for uncertainty), `gpt-6-luna` for tutor dialogue and `gpt-4o-mini-tts` (voice `marin`). Model overrides supported via the `LIVE_SPEAK_*_MODEL` variables.
- **The secret link is not an access-control mechanism.** If shared publicly, other signed-in students could use limited sessions until the global monthly cap is reached. Do not rely on link obscurity to limit access.
- **Limited Goethe AI examiner tryout (new):** A learner without usable original pilot sessions may start at most **one extra Goethe exam session per calendar month** if the shared test reserve allows it. This calls the real German examiner (OpenAI speech, transcription and feedback) and is **not** local-only recording. The tryout is bound to the authenticated student UID, cannot be claimed a second time in the same month, and does not recharge the original two pilot credits.
- The tryout is governed by a hard-coded **12 additional reserved provider-operation units per calendar month across all learners**, above the existing configured global cap. At least 10 units must be available before another tryout starts, so the small shared reserve can fill quickly. This is **not** a dollar-denominated budget; provider billing still applies. Once the tryout is unavailable, the UI falls back to on-device recording only. No new payment, cloud service or external provider is introduced.
- Monitor actual OpenAI billing; the attempted-turn cap is not a dollar-denominated budget.

## Server-enforced controls
Firestore collections are server-owned (`liveSpeakPilotCredits`, `liveSpeakSessions`, `liveSpeakUsage`). Student writes to these collections must remain denied by rules.
- `POST /live-speak/pilot/claim`: once-only two-session grant for signed-in student, within global attempted-turn budget.
- `POST /live-speak/session/start`: one credit consumed atomically for a five-minute session; re-entry while a session is live resumes without another charge.
- `POST /live-speak/session/turn`: validates ownership, expiry, up to ten turns, one in-flight request per student, byte limit (350 KB), audio MIME, and global monthly reserved-operation budget. Greeting returns natural speech; student audio returns an **unconfirmed** transcript and one-time confirmation ID **without tutor judgment**.
- `POST /live-speak/session/confirm`: accepts one learner-reviewed transcript only after a server-stored pending recording; prevents forged/replayed confirmation. Then generates the corrected German reply and spoken voice. The session must still be live.
- `POST /live-speak/session/end`: terminates the active session.
- `GET /live-speak/status`: shows private tester access and server-side credits. Users not on the allowlist receive no entitlement information.
- Transcripts and generated audio are sent to the student's browser for the conversation and **not persisted** to learning records. Do not persist raw recordings.

## Acceptance checks
1. Merge only after relevant frontend and backend checks pass.
2. Deploy both the frontend and Firebase API. Merging the website alone does not update Firebase Functions.
3. Test microphone permissions, natural voice playback, accuracy of German transcription (including accented speech), listening back to the recorded clip, transcript correction/retry, tutor feedback and latency on mobile. Compare old and new recordings where the student reports a mismatch.
4. Track actual AI spending; the global cap should stop processing on exhaustion.
5. Consider paid packages only after a successful voice-quality and cost pilot.

Automated tests cannot prove that an actual device microphone or real AI pronunciation works correctly.

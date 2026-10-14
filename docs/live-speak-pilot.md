# Falowen Live Speak — free private voice test (no payment)

## Scope
This version is for testing a natural German AI speaking partner before deciding if an optional paid add-on is worth offering. **No Paystack purchase, checkout, subscription, or payment entitlement is implemented for Live Speak.** The normal tuition routes are unchanged.

- Two **free** five-minute sessions for each approved tester, available for seven days from activation. Credits are issued once per Firebase user.
- Up to ten AI turns in each five-minute session, including the initial spoken greeting.
- Students record short (2–20 second) German answers; the server transcribes, gently corrects at most one important grammar/vocabulary mistake, asks a follow-up question, and generates an audible German AI reply.
- A1–C2 supported, with native-standard-German speech instruction. This is *turn-by-turn*, not a simultaneous or interruptible realtime voice call.
- The page is reachable at `/campus/live-speak` by signed-in learners, but only approved testers can activate the pilot. It is deliberately not advertised on the main homepage or billing page.
- Goethe Free Sprechen Chat and existing Speaking Trainer are unchanged.

## Server activation — deliberate opt-in only

All AI voice operations are **off by default**. Never set the enable flag before checking usage controls and confirming a test account.

```sh
LIVE_SPEAK_ENABLED=true
LIVE_SPEAK_TESTER_UIDS=<comma-separated Firebase Authentication UIDs of approved testers>
LIVE_SPEAK_MONTHLY_TURN_CAP=40
```

- Both `LIVE_SPEAK_ENABLED=true` and inclusion of the authenticated Firebase UID in `LIVE_SPEAK_TESTER_UIDS` are required for claim/start/turn.
- The default allowlist is empty. A missing or false flag leaves the feature off, regardless of browser requests.
- The default monthly cap is **40 attempted AI turns** across all testers; the config accepts only integer caps of 1–500. One full test session consumes up to ten provider turns.
- `OPENAI_API_KEY` stays server-side. Defaults: `gpt-4o-mini-transcribe` for German speech input, `gpt-4o-mini` for the tutor reply, `gpt-4o-mini-tts` and voice `marin` for natural speech. Configurable via `LIVE_SPEAK_TRANSCRIBE_MODEL`, `LIVE_SPEAK_CHAT_MODEL`, `LIVE_SPEAK_TTS_MODEL`, `LIVE_SPEAK_TTS_VOICE`.
- The attempted-turn ceiling **is not a USD spending limit**. Track actual OpenAI usage and set a separate provider spending alert. A failed provider call may still cost money and still counts against the turn ceiling.
- Do not add a WebSocket server, background task, new cloud services, Paystack API credential, or a billing system.

## Server-enforced controls
Firestore collections are server-owned (`liveSpeakPilotCredits`, `liveSpeakSessions`, `liveSpeakUsage`). Student writes to these collections must remain denied by rules.
- `POST /live-speak/pilot/claim`: once-only two-session grant for approved tester, within global attempted-turn budget.
- `POST /live-speak/session/start`: one credit consumed atomically for a five-minute session; re-entry while a session is live resumes without another charge.
- `POST /live-speak/session/turn`: validates ownership, expiry, up to ten turns, one in-flight request per student, byte limit (350 KB), audio MIME, and global monthly attempted-turn budget.
- `POST /live-speak/session/end`: terminates the active session.
- `GET /live-speak/status`: shows private tester access and server-side credits. Users not on the allowlist receive no entitlement information.
- Transcripts and generated audio are sent to the student's browser for the conversation and **not persisted** to learning records. Do not persist raw recordings.

## Acceptance checklist before offering any paid package
1. CI passes, including voice-gating and server runtime tests. Verify the existing normal tuition Paystack path is unchanged.
2. Deploy backend and frontend with `LIVE_SPEAK_ENABLED` omitted/false; confirm all users see an inactive private pilot and no purchase control.
3. Add **one approved tester UID** to server allowlist, choose a low attempted-turn cap and turn on the feature for that limited environment.
4. On an actual mobile phone (iOS Safari and Android Chrome), test mic permission, a spoken greeting, student German recording, accurate transcript, correction, audible natural German reply, and follow-up; verify auto-play fallback button.
5. Record end-to-end latency and exact transcription/chat/TTS charges. Test slow or interrupted mobile networks and provider failures. Confirm global cap stops calls.
6. Only after voice quality, performance and observed cost are acceptable should we design a separate optional GH₵40 speaking payment flow.

**No claim is made here that real OpenAI voice has been played or an authenticated student live session has completed.** Those manual tests require the approved account and active backend environment.

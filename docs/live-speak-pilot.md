# Falowen Live Speak Basic — controlled pilot

## Product
- Optional voice-practice add-on; Goethe Free Sprechen Chat, Speaking Trainer, course tuition and contract dates are unchanged.
- GH₵40 per **8 sessions**, each at most **5 minutes and 10 metered turns** (opening + learner replies).
- One-off Paystack payment (no recurring payment or stored card authorization). Package expires after 30 days; remaining credits do not roll over indefinitely.
- Trial: **two five-minute sessions over 7 days**; trial allocation is optional and **off by default**.
- Corrections: one important mistake at most per turn, followed by a topic-appropriate question. No pronunciation score claimed.
- Voice: OpenAI natural German TTS; transcription and conversation are model-backed. This is a turn-taking conversation with short processing pauses, **not a continuous WebRTC call**.

## Safe environment activation (do not enable in production before quality and cost review)
The code ships **disabled**. A production operator explicitly sets:

```
LIVE_SPEAK_ENABLED=true
LIVE_SPEAK_MONTHLY_TURN_CAP=800
LIVE_SPEAK_TRIAL_ENABLED=false
```

- `OPENAI_API_KEY` and `PAYSTACK_SECRET` use existing server-side environment secrets. **Never** put them in `REACT_APP_...` or send them to the browser.
- Optional provider controls: `LIVE_SPEAK_CHAT_MODEL` (default `gpt-4o-mini`), `LIVE_SPEAK_TRANSCRIBE_MODEL` (default `gpt-4o-mini-transcribe`), `LIVE_SPEAK_TTS_MODEL` (default `gpt-4o-mini-tts`), `LIVE_SPEAK_TTS_VOICE` (default `marin`).
- Global quota is measured in attempted AI turns; **not** a guaranteed USD limit. Start with fewer pilot users and check OpenAI spend daily. `800` turns is the conservative emergency ceiling, not a promise of unlimited spending or a cost estimate.
- `LIVE_SPEAK_ENABLED` also controls checkout and AI calls. A student can view the disabled/pilot page without payment.
- Do not switch on the optional trial until the two free sessions have a measured cost. Manual pilot approvals can be handled by server-side entitlement setup, not by editable student-profile fields.

## Payment contract
1. Only an authenticated Falowen student can request checkout. Price, currency, callback URL, package size and fee policy are chosen by the server; the browser cannot submit a price.
2. Checkout uses existing Paystack account; created reference is saved in `liveSpeakPaymentIntents` and never stored as tuition balance.
3. A signed Paystack `charge.success` webhook or Paystack server-side transaction verification is required before the purchase is granted.
4. Exact reference, email, GHS currency, charged pesewas and successful status must match the intent.
5. Firestore transaction makes delivery idempotent. Multiple genuinely paid packages add sessions instead of discarding them.
6. These purchases do not change `students.paymentStatus`, contract extension, course level or any tuition ledger.

## Metering and privacy
- Collections are server-owned: `liveSpeakPaymentIntents`, `liveSpeakSubscriptions`, `liveSpeakSessions`, `liveSpeakUsage`.
- Session starts deduct one credit **server-side** and limits the authenticated student to one active session; a refresh may resume a still-running session on the server.
- Each voice turn is capped at 350 KB input and the session at ten attempted AI turns. The page limits recordings to 20 seconds; the server also enforces bytes/turn count and the five-minute deadline.
- Concurrent turns are blocked. Attempted provider calls remain metered on failure to stop malicious infinite retries; allow staff review/credit adjustments after provider outages.
- The server returns transient audio and transcript for the student's browser. It does **not** write voice recordings or transcripts into student results or persistent storage.
- Do not add a new cloud service, long-lived WebSocket proxy, background job or recurring billing worker.

## Required before broad launch
- Run authenticated end-to-end checkout and webhook replay tests in Paystack sandbox/test mode, including wrong amount, wrong email, duplicate callback and payment failure.
- Listen to real native German audio on Android/iPhone/desktop across A1–C2, and verify microphone permissions and browser autoplay restrictions.
- Measure transcription, chat and TTS cost per 5-minute session on real student use. Adjust turn cap, permitted pilot users and price as needed.
- Check actual Vercel function duration and OpenAI error behavior during poor mobile connections. Review the commercial-use requirements of the hosting plan.
- Confirm that trial/purchased entitlements are not client writable in Firestore rules, and that account-deletion processes cover these new records.
- Activate only after those checks, with a low global turn cap and budget alert.

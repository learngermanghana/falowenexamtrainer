# Music publication, lyrics, translation and timing

Reviewed: 2026-11-01.

## The actual song and its metadata
1. Owner-approved MP3s in `music/<level>/day-XX/` are discoverable through the existing public music-library API. Private Hören audio lives elsewhere and must stay private.
2. Song discovery/playback is **not** approval of displayed lyrics. Audio may be listen-only.
3. Main sources: `web/public/music/approved-recording-lyrics.json` (approved recording text), `timings.json` (legacy recording-specific timings), `studio-drafts.json` (explicitly unverified draft), `english-translations.json` (line-by-line English tied to exact MP3 object key and matching German text).
4. A verified recording pack and a studio draft can have different words. Never silently substitute one for the other; old translations must not attach to a changed MP3.

## Syncing existing Falowen MP3s
The original B1 Days 24/25 were synced using multilingual Whisper word timestamps, not equal spacing by song duration. The reusable local tool is `scripts/align_falowen_music.py`. It fetches existing public MP3s and produces review reports by default. There is no need to upload audio to an AI chat again. Teacher listening review and exact fingerprint checks are needed before approving new cues. See [recording timing guide](../music-recording-timings.md).

GitHub Actions can run a bounded CPU-only scan for candidate reports. Do not copy review-only reports into approved packs without checking transcript, chorus repetitions, acoustic match, start/end times, and the MP3 fingerprint.

`timingStatus=estimated` is not the same as manually verified audio. Follow-lyrics highlighting and English text must continue to label estimates/drafts clearly.

## Student experience
- A1 English toggle defaults on when a matching published translation exists; A2/B1 defaults off. German remains primary.
- Translation does not invoke a paid model during playback.
- Music is optional/ungraded in workbooks. Lyric display must not affect timers, answers, marks or Submit.
- Background playback, next song and shuffle are separate media/OS behaviors and require player regression testing.

See [music publishing](../music-publishing.md) and [public music architecture](../public-falowen-music.md). These older files contain dated examples; current code and the precise track key take precedence.

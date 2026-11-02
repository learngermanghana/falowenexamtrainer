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

## Live library audit — 2 November 2026

A read-only audit of `/api/music-library` and each returned track's
`/api/music-lyrics` response found 65 discoverable course recordings:
16 with complete cues, 8 with published German lyrics but no cues, and
41 without a published recording transcript. The last group uses 40 course
drafts where resolvable; A1 Day 16 has two candidate drafts and no unambiguous
fallback. These counts exclude the two separately catalogued motivation songs.

All 26 bundled recording packs already have matching English. Separately
labelled English now covers all 40 resolvable live course drafts (39 additions),
bound to the observed MP3 key, level/day, assignment, draft title and every
displayed German line. This does not approve the drafts as recording text or
give them line timing. Changes to the German draft must invalidate its English.

The eight untimed published packs still need real-audio alignment and listening
review: A1 Days 2, 3, 4, 21; A2 Days 8, 17, 23, 24. Keep them untimed until that
work is completed; scrolling a page by duration does not synchronize lyrics.
The remaining estimated packs also need listening review before exact timing
can be claimed. Audio downloads were unavailable in the audit environment,
so no cue boundaries, MP3 fingerprints or lyric approval states were changed.

Validation: translation contracts and the public-player DOM matrix check
English visibility, unchanged draft labels and the absence of fabricated
click-to-seek cues for untimed drafts. They do not verify acoustic alignment.

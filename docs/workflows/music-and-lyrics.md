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

## Follow behaviour — 2 November 2026

Follow now uses only complete, text-matched cue intervals. Untimed lyrics stay
at the listener's manual reading position; the duration-based approximate page
scroll has been removed. The control is disabled with “Line highlighting
unavailable” until matching timestamps are published. Timed recordings retain
per-line highlighting, seeking, instrumental gaps and repeat behaviour.
B1 Day 2 `Freundschaft am Fluss.mp3` currently has no published recording lyric
pack: removing page scroll does not supply its missing acoustic alignment.

## Full-library acoustic timing — 2 November 2026

The one-time six-shard CPU batch in PR 3328 transcribed all 48 remaining
untimed public course MP3s with Whisper small German word timestamps. Its
review artifacts retain the raw words, recording SHA-256, duration and match
results. There are no paid AI requests or playback-time transcription jobs.

`estimated-timings.json` is separate from approved recording text and the
original songwriting drafts. Twenty-three recordings pass the unchanged
70% overall / 45% weakest-line text-match gates. Twenty-five use separately
labelled **automatic transcript drafts**, grouped directly from the recognizer's
positive-duration word windows; unrelated saved words are never assigned
invented times. Automatic words may contain recognition errors and need teacher
listening review. Their original lyric files and translations remain intact;
old English translations are not attached to different automatic German words.

The lyrics API preserves reviewed sidecar and already-timed pack precedence,
validates fingerprints and cue boundaries, and exposes estimate/draft metadata.
An untimed sidecar only reuses estimates when its German lines match exactly.
Automatic transcript text and time windows are validated against their stored
word evidence. Unverified transcript drafts do not authorize recording quizzes.

All 65 currently discovered course recordings now have complete cue packs
(the existing 17 plus 48 new estimates). `class-timings.json` also supplies
word-derived transcript drafts for the two catalogued motivation recordings,
bound to their exact catalog ID and public audio URL. `timing-coverage.json`
records the 67-song audit scope. New or replaced MP3s require a new acoustic
run; the saved fingerprint is not a live per-listen audio checksum.

The player highlights a single active line, leaves instrumental gaps clear,
and labels estimates and automatic transcripts. It never returns to scrolling
lyrics by track-duration percentage. All generated wording/timings remain
unverified until listening review; this is timing coverage, not certification.

## Admin catalog access — 2 November 2026

The public music-library endpoint uses credential-free `Access-Control-Allow-Origin: *`
for its public-song catalog. Its CORS header is identical for all callers, so shared
CDN responses work for Music and Admin without an origin-specific cached header. This lets Admin Lyrics Video Studio
select published recordings and request their existing recording-specific lyrics
and cues. It does not change private audio discovery or approve estimated timing.

## Path-based video translations — 2 November 2026

The music-lyrics API includes `englishTranslation` when the shared translation
registry contains the exact MP3 object key and every returned German sung line
matches in order. It contains `source` and `{de,en}` lines. Course-draft English
remains labeled and is only attached to matching reference text, never to a
different automatic transcript. Display titles do not identify translations.
The Admin video exporter consumes this metadata; no playback-time AI call is
added. Missing translations stay unavailable and can be entered manually.

Published video exports request `download=1` on the existing public music audio
API. It streams only the validated public music track, with a 40 MB limit and
30-second upstream timeout, so the browser need not read a signed R2 redirect.
Normal audio playback still redirects. Uploaded local audio remains local.
Export network failures now identify the MP3 download stage.

## Public music sharing and art — 3 November 2026

The public player offers platform choices and native device sharing, with a copyable song URL. `/song/<track-id>` serves recording-specific social preview metadata and the same listening room. The artwork manifest and credited local photography cover all 67 audited releases, with a default for new public recordings. These display changes do not approve lyrics, cues, translations or audio, and do not change assessment or music discovery. See [public music architecture](../public-falowen-music.md) for source ownership and checks.

## Private B1 Day 26 classroom audio — 4 November 2026

The Admin travel-problems listening activity uses the teacher-uploaded
`a2/day-26/reiseprobleme-und-losungen.mp3` object. Despite the storage prefix,
the exact allowlist triple is B1, day 26 and that key. The existing staff-only
classroom signer serves it on demand; anonymous/student requests, other levels,
days and objects remain rejected. It is not a public music recording and does
not change the graded workbook Hören. Admin owns the five supplied classroom
questions (B, A, C, A, B) in `b1Day26Listening.js`.

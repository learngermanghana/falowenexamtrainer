# Recording-specific lyric timings — 28 October 2026

The seven published lesson MP3s now have 140 timed lyric lines in `web/public/music/timings.json`. Timings were derived locally from the actual public recordings using a multilingual Whisper small model, word timestamps and sequence matching against the saved Falowen lyrics. A weaker CTC alignment run was rejected. No model, audio, paid API call or alignment task runs on Vercel or Firebase.

| Recording | Timed lines |
| --- | ---: |
| A1 Day 4 — Welche Nummer hast du? | 36 |
| A1 Day 22 — Mein Kopf tut weh | 17 |
| A2 Day 18 — Die Karte funktioniert nicht | 19 |
| A2 Day 19 — Lieber online oder im Laden? | 17 |
| A2 Day 20 — Höflich reklamieren | 17 |
| B1 Day 24 — Weniger kaufen | 17 |
| B1 Day 25 — Als Kunde habe ich auch Rechte | 17 |

`start` and `end` are seconds on the exact MP3 playback clock. End times clear highlights during instrumental breaks. Most recordings begin singing around 9–12 seconds; B1 Day 24 begins at 1.16 seconds. No lyric is highlighted before its first vocal. Sung letter-name lines on A1 Day 4 were matched to their observed vocal windows rather than spaced evenly.

The saved dictionary is retained unchanged. Recording-specific lyrics include the extra repeated “Wir finden gemeinsam eine Lösung” and “Ich bedanke mich für die Hilfe” on A2 Day 18 and the repeated “die richtige Wahl” on A2 Day 19. The unrecorded final “Bei Falowen lerne ich: Gute Besserung!” line is absent from the A1 Day 22 recording pack. Source-songbook lyrics and recording lyrics are intentionally separate.

The music-only metadata endpoint serves a validated built-in pack first, avoiding an extra R2 fetch for these recordings. For other music keys it retains the existing reviewed `.lyrics.json` sidecar flow. Admin renders the published recording lyrics and keeps local edits only if they match that recording text. Public quizzes remain hidden when their saved lyric pack differs from the final recording lyrics.

Automatic alignment can be refined using the existing Admin timing controls. Replacing an MP3 at the same key requires re-aligning its timings; the exact object key identifies a recording, not an immutable content checksum.

## A1 Day 14 follow and questions — 29 October 2026

`music/a1/day-14/Einsteigen – Wir fahren los.mp3` now has 44 recording-specific lyric cues. These were aligned locally against the final public MP3 with Whisper small word timestamps and sequence matching, preserving repeated choruses. The recording pack omits unsung dialogue speaker labels; the original songwriting draft remains unchanged. Two grounded questions ask where they change trains (Hannover) and where they want to arrive (Berlin), with a speaking transfer task.

The public app resolves recording metadata by exact MP3 key, including discovered IDs. It builds literal-evidence questions when no matching saved lesson exists, and hides the questions continuation when no question set is available. Follow is disabled and unchecked without a complete matching cue set. A manual catalog refresh also refreshes the current song's lyrics.

DOM interaction tests exercise the real app for A1, A2, B1 and Day 14: highlighted line, container scrolling, follow off/on, click-to-seek, repeat to intro, question navigation and correct-answer feedback. They mock only media playback, network and layout. They verify cue-driven UI behavior, not acoustic alignment accuracy. The shared music API remains the timing source for teacher slides and course book.

## A1 Day 13 timestamps — 29 October 2026

The currently published `music/a1/day-13/Zwei Tees, vier Euro.mp3` receives 17 line cues from its own MP3, not the earlier guessed lowercase filename. First vocal: 18.48 s; last line ends 130.74 s. Instrumental gaps remain unhighlighted (including the long break before the outro). The complete original 17-line text matches this recording pack; no songbook rewrite is required. Public questions check half past two and the seven-euro total. The same API pack is loaded by the discovery-based Day 13 presenter.

The DOM test matrix now explicitly includes Day 13. Built-in API tests validate every cue, exact recording identity and instrumental gaps, without an R2 metadata fetch.

## Repeatable alignment for newly uploaded A1–B1 songs

The original B1 Day 24 and Day 25 packs were produced on a local computer
using multilingual Whisper **small** word timestamps and sequence-matching
against the real MP3, without the teacher uploading those MP3s to chat.
Previously, there was no checked-in command to repeat that work for new R2 songs.

`scripts/align_falowen_music.py` now reproduces that workflow **offline**:

1. From a developer machine / ChatGPT Work computer with web access, install
   `python -m pip install faster-whisper`. You need local CPU and ffmpeg/PyAV
   support; the model downloads once on first use and is cached.
2. Run, for example:
   `python scripts/align_falowen_music.py --level B1 --day 4 --include-drafts`
   or `python scripts/align_falowen_music.py --all --include-drafts --limit 60`.
   It reads the existing **public** `/api/music-library`, fetches approved
   public audio through `/api/music?track=<id>` and follows the signed R2
   redirect. Neither storage credentials nor new user audio uploads are needed.
3. It transcribes the audio in German with word timestamps, aligns every sung
   lyric line in order including repeated choruses, estimates the vocal end so
   instrumental gaps are not highlighted, and refuses weak matches or stale
   SHA-256 fingerprints. It writes review reports under
   `/tmp/falowen-music-timing-review`. This is the default; **nothing is
   published or uploaded automatically**.
4. Listen to each proposed start/end against the actual recording; fix incorrect
   words, missing or repeated lyrics, and timestamp boundaries. Then, for an
   owner-approved exact recording only, run:
   `python scripts/align_falowen_music.py --apply-report /tmp/falowen-music-timing-review/TRACK.json --reviewed`
   and review the diff of `web/public/music/approved-recording-lyrics.json`
   in a PR before merging/deploying.
5. Studio draft lyrics (including the currently unverified B1 Day 4
   `Ort zum Leben`) can be **inspected** with `--include-drafts`, but these
   reports are review-only and cannot be published as approved lyrics.
   Correct the transcript and obtain owner approval first.

The script preserves the existing recording-specific built-in timing packs
unless given `--force`. It does **not** launch models in students' browsers,
on Vercel, Firebase, R2 or on a timer; no paid AI API requests and no
recurring student playback costs are introduced. CPU time and the model's
one-time download are borne by whichever machine runs this command. Never
treat automated singing transcription as teacher-certified without listening.

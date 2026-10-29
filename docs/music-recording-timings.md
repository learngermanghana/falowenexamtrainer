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

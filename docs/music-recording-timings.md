# Recording-specific lyric timings — 28 October 2026

The five published lesson MP3s now have 106 timed lyric lines in `web/public/music/timings.json`. Timings were derived locally from the actual public recordings using a multilingual Whisper small model, word timestamps and sequence matching against the saved Falowen lyrics. A weaker CTC alignment run was rejected. No model, audio, paid API call or alignment task runs on Vercel or Firebase.

| Recording | Timed lines |
| --- | ---: |
| A1 Day 4 — Welche Nummer hast du? | 36 |
| A1 Day 22 — Mein Kopf tut weh | 17 |
| A2 Day 18 — Die Karte funktioniert nicht | 19 |
| A2 Day 19 — Lieber online oder im Laden? | 17 |
| A2 Day 20 — Höflich reklamieren | 17 |

`start` and `end` are seconds on the exact MP3 playback clock. End times clear highlights during instrumental breaks. The recordings begin singing around 9–12 seconds; no lyric is highlighted during the instrumental introduction. Sung letter-name lines on A1 Day 4 were matched to their observed vocal windows rather than spaced evenly.

The saved dictionary is retained unchanged. Recording-specific lyrics include the extra repeated “Wir finden gemeinsam eine Lösung” and “Ich bedanke mich für die Hilfe” on A2 Day 18 and the repeated “die richtige Wahl” on A2 Day 19. The unrecorded final “Bei Falowen lerne ich: Gute Besserung!” line is absent from the A1 Day 22 recording pack. Source-songbook lyrics and recording lyrics are intentionally separate.

The music-only metadata endpoint serves a validated built-in pack first, avoiding an extra R2 fetch for these recordings. For other music keys it retains the existing reviewed `.lyrics.json` sidecar flow. Admin renders the published recording lyrics and keeps local edits only if they match that recording text. Public quizzes remain hidden when their saved lyric pack differs from the final recording lyrics.

Automatic alignment can be refined using the existing Admin timing controls. Replacing an MP3 at the same key requires re-aligning its timings; the exact object key identifies a recording, not an immutable content checksum.

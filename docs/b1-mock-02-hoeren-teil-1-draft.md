# B1 Mock 2 — Hören Teil 1 (draft only)

Source: teacher-supplied `falowen-b1-hoeren-teil-1-reisen-und-termine.txt` (23 October 2026).

## Publication status

**Teacher-review draft only**. This file is not imported into the live Exams Room; it does not authorize R2 signed URLs or scoring. The existing `b1-final-01` exam remains unchanged.

- Canonical R2 key: `b1/mock-hoeren/mock-02/teil-1.mp3`
- Ten scored tasks in five Richtig/Falsch + multiple-choice pairs.
- Audio preview, playback, repetition and answer-key verification pending.
- Teil 2, 3 and 4 user-supplied recording keys are `b1/mock-hoeren/mock-02/teil-2.mp3`, `teil-3.mp3` and `teil-4.mp3` respectively. They are not released by this PR.

## Audio mismatch that must be resolved

The user-provided script states: `Zu jedem Text lösen Sie eine Aufgabe. Wählen Sie: Ist die Aussage Richtig oder Falsch?` while the Goethe B1 Hören Teil 1 format has **two tasks for each of five texts** and **each text plays twice**. The MP3 is already uploaded, but its spoken introduction and repeat behavior have **not** been verified. Update/regenerate the audio if necessary; do not unlock the draft for students prematurely.

Original script also contains `Samstagnehmen` (likely missing a space); the example narrator says the example is Falsch without explaining the second example question.

## Review workflow

Open the adjacent JSON draft, compare all ten questions and each quoted evidence fragment against the recording, correct the MP3 if needed, and obtain staff approval. Then wire all four Hören Teile into a **separate** B1 Mock 2 runtime with verified server-side keys, Firestore release manifest, and tested student/Admin score sync before publishing.

Do not copy the answer-bearing JSON into a publicly served asset or expose the key to the browser until the verified scoring integration is in place.

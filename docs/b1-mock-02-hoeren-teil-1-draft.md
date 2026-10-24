# B1 Mock 2 — Hören Teil 1 (draft only)

Source: teacher-supplied `falowen-b1-hoeren-teil-1-reisen-und-termine.txt` (23 October 2026).

## Publication status

**Teacher-review draft only**. This file is not imported into the live Exams Room; it does not authorize R2 signed URLs or scoring. The existing `b1-final-01` exam remains unchanged.

- Canonical R2 key: `b1/mock-hoeren/mock-02/teil-1.mp3`
- Ten scored tasks in five Richtig/Falsch + multiple-choice pairs.
- Attached MP3 was checked for duration (333.624 seconds, 96 kbps) and waveform repetition; protected R2 playback and teacher-reviewed answer accuracy are still pending.
- Teil 2, 3 and 4 user-supplied recording keys are `b1/mock-hoeren/mock-02/teil-2.mp3`, `teil-3.mp3` and `teil-4.mp3` respectively. They are not released by this PR.

## Audio mismatch that must be resolved

The user-provided script states: `Zu jedem Text lösen Sie eine Aufgabe. Wählen Sie: Ist die Aussage Richtig oder Falsch?` while the Goethe B1 Hören Teil 1 format has **two tasks for each of five texts** and **each text plays twice**. The teacher then supplied the MP3 and its complete repeated transcript. Audio analysis confirms two full identical passes (second begins around 169.78 seconds; Pearson correlation about 0.9997 across the overlapping recording). This provides two plays total, so **do not replay the entire MP3 twice** in Falowen. However the spoken introduction still says only one Richtig/Falsch question per text, and the example mentions only that the first sample is false. Update/regenerate the *spoken introduction and example* if using ten questions; do not unlock the draft for students prematurely.

The supplied MP3 transcript says `Samstag nehmen` correctly (the earlier written script joined these words), so there is no observed content correction needed for that phrase. The example narrator says the example is Falsch without explaining the multiple-choice sample question.

## Review workflow

Open the adjacent JSON draft, compare all ten questions and each quoted evidence fragment against the recording, correct the MP3 if needed, and obtain staff approval. Then wire all four Hören Teile into a **separate** B1 Mock 2 runtime with verified server-side keys, Firestore release manifest, and tested student/Admin score sync before publishing.

Do not copy the answer-bearing JSON into a publicly served asset or expose the key to the browser until the verified scoring integration is in place.

## Uploaded MP3 QA (23 October 2026)

- User-provided MP3 filename: `teil-1(1).mp3`; encoded at 96 kbps; duration 5:33.624.
- The entire set of introduction, example, and Text 1–5 plays again from approximately 2:49.78. Acoustic correlation across the two passes is approximately 0.9997.
- The teacher-provided transcript matches the five subjects used by all ten draft questions. Evidence strings are exact excerpts of the previously provided script, which is consistent with the new transcript.
- Spoken instruction conflicts with the intended Goethe B1 task format: one Richtig/Falsch task versus one Richtig/Falsch **and** one multiple-choice question per text. The official model uses two questions for each of five texts.
- Do **not** mark `audioAccessVerified`, publish a `publishedMockHoerenAudio` manifest, or release B1 Mock 2 on these checks alone: the actual R2-hosted asset, corrected spoken instructions, and authenticated route/scoring are not yet verified.

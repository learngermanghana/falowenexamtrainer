# B1 Mock 3 · Hören release checklist

**Source:** teacher-uploaded `Falowen-B1-Mock-03.zip` dated 24 October 2026. This is original Goethe-style practice, **not** official Goethe-Institut material.

## Staged now
- Four separate MP3s, 96 kbps, about 6:04, 1:23, 3:26 and 6:32 (approximately 17:24 total).
- Thirty questions, divided 10 / 5 / 7 / 8. Correct answers are stored only in the functions backend.
- Student-scoped progress key `falowen:b1-mock-03:hoeren:<uid>:v1`.
- Separate authenticated question and scoring endpoints, Firestore collection `b1Mock3HoerenResults`, and `/campus/course/b1-mock-3-hoeren`.
- Practice-only, catalog-hidden preview. Not a verified four-module mock.

## Teacher QA required before release (blocking)
1. **Teil 1:** The spoken instructions say *one Richtig/Falsch statement per short text*, but the question file contains **two questions per text** (Richtig/Falsch plus a/b/c). Re-record the instruction or get teacher approval of an explicit on-screen clarification.
2. **Teil 3:** The recording labels Anna's Thursday departure as *Beispiel Nummer 0*, but supplied **scored question 16** tests that example. The recording's *Nummer 5* about the replacement pizzeria is not tested. Align the seven recorded numbering cues to scored questions before release. **Do not silently replace the teacher's answer key.**
3. **Teil 4:** The discussion introduces speaker C as Claudia Weber and D as Thomas Klein, but later changes which voice appears to discuss travelling vs. staying at home. Re-record or reassign consistent voices and review questions 23–30.

## Cloudflare R2 upload
Upload exactly four files to bucket `falowen-course-audio` at:
- `b1/mock-hoeren/mock-03/teil-1.mp3` (4,365,216 bytes)
- `b1/mock-hoeren/mock-03/teil-2.mp3` (993,600 bytes)
- `b1/mock-hoeren/mock-03/teil-3.mp3` (2,466,432 bytes)
- `b1/mock-hoeren/mock-03/teil-4.mp3` (4,703,616 bytes)

The original ZIP contains files in `Teil-N/`; those are **not** the R2 object keys. Verify the exact files and signed playback; then publish `publishedMockHoerenAudio/b1-mock-03` with `status: "published"`, `level:"B1"`, `mockId:"mock-03"` and `parts` mapping from `teil-1` through `teil-4` to the exact keys.

Only after teacher approval and verified upload/backend deployment set `B1_MOCK3_HOEREN_RELEASED=true` and make the catalog item visible. Without that flag, its question and scoring endpoints return 404; without the published manifest, protected MP3 playback returns 404.

## Future full mock work
Obtain unique Mock 3 Lesen (30 questions and private key), Schreiben (3 tasks and rubric) and Sprechen (3 interactive tasks with A2/B1 LiveSpeak examiner). Build an attempt-bound four-module /100 score, verify autosave, expiry, backend receipts, result/Sheet/Admin sync and retake behavior. Do not label this Hören-only work a full mock, or reuse Mock 1/2 answers.

## Repository safety
This branch is based on last intact production commit `9aae23bab29bc6122885fd72784c53871b3ef0b8` to avoid accidentally building on the current stripped-down main branch. The PR base is a recovery-safe anchor. **Do not merge or deploy until main is repaired and this PR is retargeted to the restored main.**

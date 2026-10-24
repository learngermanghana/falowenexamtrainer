# B1 Mock 3 · Hören release checklist

**Source:** teacher-uploaded `Falowen-B1-Mock-03.zip` dated 24 October 2026. This is original Goethe-style practice, **not** official Goethe-Institut material.

## Staged now
- Four separate MP3s, 96 kbps, about 6:04, 1:23, 3:26 and 6:32 (approximately 17:24 total).
- 24 October 2026: Teacher screenshot confirms all four `teil-1.mp3` to `teil-4.mp3` objects visible in Cloudflare R2 at the correct `b1/mock-hoeren/mock-03/` prefix. **Playback, signed URLs and content QA are still unverified.**
- Thirty questions, divided 10 / 5 / 7 / 8. Correct answers are stored only in the functions backend.
- Student-scoped progress key `falowen:b1-mock-03:hoeren:<uid>:v1`.
- Separate authenticated question and scoring endpoints, Firestore collection `b1Mock3HoerenResults`, and `/campus/course/b1-mock-3-hoeren`.
- Practice-only, catalog-hidden preview. Not a verified four-module mock.

## Teacher QA required before release (blocking)
1. **Teil 1:** The spoken instructions say *one Richtig/Falsch statement per short text*, but the question file contains **two questions per text** (Richtig/Falsch plus a/b/c). Re-record the instruction or get teacher approval of an explicit on-screen clarification.
2. **Teil 3 — resolved in code:** Beispiel Nummer 0 is unscored, and the seven questions now follow recordings Nummer 1–7 (weather, chain, hotel, fish restaurant, pizzeria, oversleeping, Travemünde). Their server-only keys were updated against the provided recording. Verify with the teacher during final playback QA.
3. **Teil 4:** The discussion introduces speaker C as Claudia Weber and D as Thomas Klein, but later changes which voice appears to discuss travelling vs. staying at home. Re-record or reassign consistent voices and review questions 23–30.

## Cloudflare R2 upload
Upload exactly four files to bucket `falowen-course-audio` at:
- `b1/mock-hoeren/mock-03/teil-1.mp3` (4,365,216 bytes)
- `b1/mock-hoeren/mock-03/teil-2.mp3` (993,600 bytes)
- `b1/mock-hoeren/mock-03/teil-3.mp3` (2,466,432 bytes)
- `b1/mock-hoeren/mock-03/teil-4.mp3` (4,703,616 bytes)

The original ZIP contains files in `Teil-N/`; those are **not** the R2 object keys. Verify the exact files and signed playback; then publish `publishedMockHoerenAudio/b1-mock-03` with `status: "published"`, `level:"B1"`, `mockId:"mock-03"` and `parts` mapping from `teil-1` through `teil-4` to the exact keys.

Only after teacher approval and verified upload/backend deployment set `B1_MOCK3_HOEREN_RELEASED=true` and make the catalog item visible. Without that flag, its question and scoring endpoints return 404; without the published manifest, protected MP3 playback returns 404.

## Lesen and Sprechen draft additions (24 October 2026)

- Lesen now has **five parts and 30 questions (6 / 6 / 7 / 7 / 4)**, a 65-minute timer and server-owned answers. The full Menden Carsharing Text 1 for Teil 2 was reconstructed to match the teacher's rationales and **explicitly approved by the teacher**; questions 7–9 remain B/B/C. Its quiz and routes are hidden by `B1_MOCK3_LESEN_RELEASED` (off by default).
- Lesen Teil 4 contains only six numbered comments plus the supplied Niko example. The example has provisionally become question 20, giving seven scored tasks; this editorial choice still needs approval.
- Sprechen now has original planning (international language evening), two presentation choices (teenager part-time jobs, sport in clubs vs solo), and partner presentation feedback (digital/printed books). It reuses the A2/B1 LiveSpeak examiner, but has its own attempt IDs, private Firestore receipts and 9+10+6 point verification. Hidden by `B1_MOCK3_SPEAKING_RELEASED` (off by default).
- The Hören-only, Lesen-only, and Sprechen-only drafts do **not** yet produce a mock-wide four-section result or release any grades in production.

## Future full mock work
Obtain unique Mock 3 Lesen (30 questions and private key), Schreiben (3 tasks and rubric) and Sprechen (3 interactive tasks with A2/B1 LiveSpeak examiner). Build an attempt-bound four-module /100 score, verify autosave, expiry, backend receipts, result/Sheet/Admin sync and retake behavior. Do not label this Hören-only work a full mock, or reuse Mock 1/2 answers.

## Repository safety
This branch is based on last intact production commit `9aae23bab29bc6122885fd72784c53871b3ef0b8` to avoid accidentally building on the current stripped-down main branch. The PR base is a recovery-safe anchor. **Do not merge or deploy until main is repaired and this PR is retargeted to the restored main.**

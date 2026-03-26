# A1 Course Components Content Audit & Improvement Suggestions

## Scope checked
- A1 lesson structure and links in `web/src/data/courseSchedule.js` (Day 0–25).
- A1 workbook/grammar route coverage in `web/src/App.js`.
- Representative A1 workbook component patterns (static vs interactive) in `web/src/components/`.

## What is already working well
- The A1 track covers a broad beginner journey (greetings, numbers, cases, time, directions, health, letter writing, exam prep) with a clear day-by-day path.
- Many A1 lessons already have in-app pages and dedicated routes, which is a strong base for consistency and scale.
- At least some A1 lessons already provide instant-feedback interaction (for example, modal verbs practice with answer checking), which is excellent for self-study.

## Content/UX gaps found

### 1) Resource format is still mixed (in-app vs Google Drive)
Several A1 lessons still point to Google Drive materials instead of in-app learning components (e.g., Day 8 workbook, Day 9 grammarbook, Day 11 workbook, Day 18 chapter 12.1/12.2 workbooks). This creates an uneven learner experience and makes progress tracking harder.

### 2) Some lessons have missing video metadata
A1 entries include empty video/youtube fields in places where a lesson still expects learners to continue through content (notably Day 16 chapter 10 and Day 18 chapter 12.2). Learners may perceive these as broken or incomplete.

### 3) Assessment experience is inconsistent across A1 components
Some workbooks are mostly static “read and submit elsewhere” pages, while others include direct answer checking and immediate feedback. This inconsistency can reduce learner confidence and increases dependence on tutor marking for basic reinforcement.

### 4) Many practical chapters are non-assignment (good for flexibility, but low visibility)
Multiple A1 days are marked `assignment: false` (e.g., Days 5, 6, 13, 14, 15, 19, 23, 24). That supports low-pressure practice, but these chapters can become invisible in progress analytics unless lightweight completion tracking is added.

## Recommended additions (prioritized)

### Priority 1 — Standardize lesson delivery (highest impact)
1. Convert remaining Google Drive A1 workbooks/grammar notes into in-app components.
2. Add a “resource health check” script/validation so empty `video`/`youtube_link` cannot be shipped in schedule data.
3. For each A1 day, enforce a minimum lesson package:
   - 1 short explainer/video
   - 1 in-app practice block
   - 1 self-check quiz or rubric

### Priority 2 — Add micro-assessment to every A1 workbook
1. Add 5–10 auto-check items per day (MCQ, reorder, fill-in) with immediate feedback.
2. Provide answer explanations (why correct/incorrect), not only answer reveal.
3. Include one “common mistakes” card per lesson (e.g., `kein` vs `nicht`, word order with modal verbs).

### Priority 3 — Improve exam alignment (Goethe A1)
1. Add end-of-week mini mock tasks mapped to Lesen/Hören/Schreiben/Sprechen.
2. Add speaking prompt timers + model responses for Teil 2/Teil 3.
3. Add letter-writing checklist scoring (salutation, purpose, required points, closing) before submission.

### Priority 4 — Track practical progress without adding tutor load
1. Introduce “self-marked completion” for non-assignment days (checkbox + confidence rating).
2. Add mastery tags per skill (e.g., Greetings, Time, Cases, Modal verbs) and surface weak-skill recommendations.
3. Award completion badges for practical clusters to keep motivation high.

## Suggested rollout plan
- **Week 1:** Fix missing/empty video metadata + identify all A1 Google Drive resources still in use.
- **Week 2–3:** Migrate the top 5 most-used external A1 resources into in-app components.
- **Week 3–4:** Add auto-check micro-quizzes to the most static A1 workbook pages.
- **Week 5+:** Add weekly Goethe A1 mini mocks and speaking timer workflow.

## Success metrics to track
- % of A1 lessons fully in-app (target: 100%).
- % of A1 lessons with instant-feedback checks (target: 100%).
- Average learner completion rate for non-assignment practical days (target: +25% uplift).
- Assignment quality improvements (fewer repeated foundational errors in tutor feedback).

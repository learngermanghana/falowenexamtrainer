# Workbook Page Implementation Prompt Template

Use this prompt when requesting a new workbook page implementation.

---

Use `web/src/components/A2Day2SmallTalkWorkbookPage.js` as the exact template and interaction model.

## Goal

Create a new in-app workbook page for `[LEVEL]` Day `[N]` `“[TOPIC]”` with the same UI/UX pattern.

## Deliverables

1. New component file:
   - `web/src/components/[NewWorkbookComponentName].js`

2. New route:
   - `/campus/course/[new-workbook-route-slug]` in `web/src/App.js`

3. Schedule wiring:
   - Update matching day in `web/src/data/courseSchedule.js`
   - Set `workbook_link` to `/campus/course/[new-workbook-route-slug]`
   - Update `topic`, `goal`, `instruction`, `grammar_topic`, `video`, `youtube_link` as provided below.

## UI/UX contract (must match existing workbook style)

- 4 tabs exactly:
  - `Teil 1 · Sprechen (Group Practice No assignment)`
  - `Teil 2 · Schreiben`
  - `Teil 3 · Lesen`
  - `Teil 4 · Hören`

- Reuse question-card rendering for Lesen/Hören:
  - Question stem + A/B/C/D options on separate lines

- Include teacher mode checkbox with optional transcript reveal in Teil 4.
- Include `I prepared this part.` checkbox in each tab.
- Include one Unsplash image at top of each tab.
- Include a speaking self-practice confidence block in Teil 1 with this link:
  - `https://script.google.com/macros/s/AKfycbzMIhHuWKqM2ODaOCgtS7uZCikiZJRBhpqv2p6OyBmK1yAVba8HlmVC1zgTcGWSTfrsHA/exec`

- In Teil 2, include writing-practice guidance before submission with this link:
  - `https://www.falowen.app/campus/writing`
  - State that learners can use the Ideas Generator for support.

- In Teil 4, keep a recommended video link and also make the video previewable directly on-page (embedded player).
- Keep clear instruction that students submit answers in submission area, not directly on-page.
- Keep language polished and consistent (teacher-ready).

## Content to inject (do not summarize, keep meaning intact)

`[PASTE NEW DAY CONTENT HERE, segmented as Teil 1/2/3/4]`

## Required media inputs (must be provided in the request)

- `[UNSPLASH_IMAGE_T1]` for Teil 1 header image
- `[UNSPLASH_IMAGE_T2]` for Teil 2 header image
- `[UNSPLASH_IMAGE_T3]` for Teil 3 header image
- `[UNSPLASH_IMAGE_T4]` for Teil 4 header image

Use direct Unsplash image URLs in the same style used by existing pages (for example: `https://images.unsplash.com/...?...`).


## Implementation constraints

- Keep code style consistent with existing page (`styles` from `../styles`).
- Do not remove or alter existing routes except adding the new one.
- Do not change unrelated schedule entries.
- Preserve accessibility:
  - meaningful alt text,
  - external links use `target="_blank" rel="noreferrer"`,
  - lazy-load tab images.

## After implementation

- Show changed files.
- Run available checks.
- Commit with a clear message.
- Draft PR summary + testing notes.

# UI Review: `/campus/course/modal-verbs-day-14-3-6`

Date: 2026-03-05
Reviewer: Codex agent

## What was checked
- Opened the production page in Chromium using Playwright at desktop viewport (1440x2200).
- Waited for network idle and captured a full-page screenshot.
- Queried `document.images` to verify image elements loaded correctly.

## Findings
1. **No broken image rendering detected**: the page renders cleanly with text cards, CTA blocks, footer, and spacing intact.
2. **No `<img>` elements found on this page**: `document.images` returned an empty array.
   - If this is expected (text-first landing layout), rendering is fine.
   - If course media is expected, image components may not be wired into this route.
3. **No failed network requests** were reported during the check.

## Suggested updates
1. **Add visual context to improve trust/conversion**
   - Add at least one hero image or learner success photo near the top fold.
   - Include tutor/classroom thumbnails in the “Tägliche Praxis / Tutoriertes Feedback” section.
2. **Improve page scannability**
   - Increase contrast and size of section subtitles in the lighter cards.
   - Reduce density in testimonial cards on desktop by increasing card spacing.
3. **Strengthen CTA hierarchy**
   - Keep one primary CTA style globally (currently several button styles compete).
   - Repeat the main CTA after testimonials with a short proof point line.
4. **Internationalization polish**
   - Ensure language switch labels and mixed EN/DE copy are consistently localized per selected language.
5. **Performance and accessibility enhancements**
   - If images are added, use responsive formats (`srcset`, WebP/AVIF) and lazy-load below the fold.
   - Add explicit alt text and verify keyboard focus order for all CTAs.

## Evidence
- Screenshot artifact: `browser:/tmp/codex_browser_invocations/ca0fb2c9054d8cf6/artifacts/artifacts/modal-verbs-day14.png`

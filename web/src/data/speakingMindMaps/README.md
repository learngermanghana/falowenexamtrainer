# Speaking mind-map registry

Use the shared `SpeakingMindMap` component for workbook speaking preparation instead of duplicating branch cards in page components.

## Adding a lesson configuration

1. Add or reuse a registry module under `src/data/speakingMindMaps/`.
2. Set `level`, `day`, `lessonId`, `title`, `centralQuestion`, `targetDurationSeconds`, `branches`, and `speakingRoute`.
3. Keep every `lessonId` unique inside the level registry and every branch `id` unique inside a lesson.
4. Give every branch non-empty `keywords`, `guidingQuestion`, `sentenceStarter`, and `modelSentence`.
5. Use the level-appropriate branch `type` values from `branchTypesByLevel` in `index.js`:
   - B1: opinion, reason, example, advantage, disadvantage, conclusion
   - B2: position, argument, evidence, example, consequence, counterargument, response
   - C1: thesis, context, evidence, evaluation, objection, qualification, conclusion
6. Render it with `<SpeakingMindMap config={...} />` on the workbook speaking tab.
7. Add or update tests so `validateSpeakingMindMapConfig` covers the new lesson.

A2 remains backward compatible: existing A2 pages can continue importing `getA2SpeakingMindMap(day)` from `speakingMindMaps/a2`.

## A2 individual presentations

`src/data/a2PresentationCards.js` owns the original classroom practice prompts,
four keywords, sentence starters and model sentences for Days 1–28. The A2
mind-map registry derives its displayed task and help from these cards; do not
add local conversation overrides. Small Talk uses curriculum Day 1, even though
its public route contains `a2-day-2-small-talk-workbook`.

These cards practise Goethe A2 Sprechen Teil 2 (talking about yourself with four
keywords), not a B1 formal presentation. The restaurant role-play on Day 8 is
an additional dialogue activity. Day 22 keeps its existing speaking mock and
selected questions from `speakingDictionary.js`; the unused Day 22 mind map is
not a replacement for that assessed assignment.

After changes, run the learner assessment registry check and sync the static
Admin snapshot with `scripts/syncA2WorkbookPresentations.mjs` in falowenadmin.
No runtime request is needed. Reference: https://bfu.goethe.de/a2_mod_2MX5/sprechen.php

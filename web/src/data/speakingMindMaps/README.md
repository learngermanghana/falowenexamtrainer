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

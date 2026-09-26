# B1 Days 1–28 audit baseline

This document records the current B1 workbook architecture before the next standardization pass.

## What the automated audit protects

The CI audit checks:

- all 28 B1 teaching days remain routed to a workbook;
- all 28 B1 assignments exist in `functions/data/answerKeyManifest.json`;
- detectable workbook assignment IDs match their manifest assignment IDs;
- every B1 assignment has Lesen answers;
- no new custom, legacy/V2, DOM-patched or placeholder workbook is introduced beyond the recorded baseline;
- day-specific grammar-note coverage does not regress;
- answer-sheet links do not disappear from additional B1 assignments.

The purpose of the baseline is to let us standardize B1 incrementally without allowing the current architecture to drift further.

## Current migration debt

### Workbook architecture

The following live B1 days are still outside the shared `B1StandardWorkbookPage` architecture:

**1, 2, 3, 4, 5, 6, 7, 8, 11, 19, 20, 22**

The most obvious legacy/V2 proxy days are:

**1, 3, 6, 22**

Day 21 already uses the shared workbook but still relies on DOM mutation/layout logic to inject a writing video and hide Teil 4.

### Incomplete material

Day 23 still has a planned Hören placeholder rather than finished listening material.

### Grammar

Day-specific B1 deep-grammar pages currently exist for Days 1–23.

Days **24–28** fall back to the general B1 topic introduction rather than a dedicated deep-grammar page. These should be completed during the B1 grammar pass, with concise English support added where it improves comprehension.

### Answer infrastructure

All 28 B1 assignments exist in the answer manifest.

`B1-3.9` is currently the only B1 assignment without `answer_url` and `sheet_url`.

### Assessment shape

The current B1 assessment shapes are not yet normalized:

- most early/middle Lesen tasks have 7 questions;
- some late Lesen tasks have 5 or 6;
- some Hören tasks are submitted, some are self-check, and some have no manifest answers;
- Day 7 currently has a 10-answer Hören block.

The audit records these shapes but does not redesign them. The next B1 implementation pass should centralize and normalize these deliberately rather than changing them accidentally.

## Recommended migration order

1. Move the four legacy/V2 proxy days (1, 3, 6, 22) onto the shared shell.
2. Move the remaining custom days (2, 4, 5, 7, 8, 11, 19, 20) onto the shared shell.
3. Replace Day 21 DOM patches with declarative shared-shell options.
4. Finish Day 23 Hören.
5. Add dedicated Grammar support for Days 24–28.
6. Centralize B1 Schreiben, Lesen and Hören sources and tighten answer-key synchronization.

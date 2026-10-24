# Source-owned workbook migration

Falowen workbook behaviour must live in React components and data modules. Build, start, and test commands may validate source files, but they must not rewrite application source.

## Completed migration: course media and A2 speaking foundation

The former `sync:course-media` chain ran five mutating scripts. Their final behaviour now lives permanently in:

- `web/src/components/A2StandardTabbedWorkbookPage.js`
- `web/src/data/speakingMindMaps/a2/`
- `web/src/data/lessonVideoDictionary.js`
- `web/src/data/a1TeacherVideoResources.js`
- `web/src/data/b2C1LessonMediaOverrides.js`
- the affected workbook and writing-support components

The build command now runs `scripts/auditCourseMediaAndSpeaking.mjs`. This command is read-only. It verifies required source configuration and rejects obsolete configuration without changing files.

Removed mutating scripts:

- `patchRequestedCourseMedia.mjs`
- `patchA1Day10PossessivePatterns.mjs`
- `patchA2StandardSpeakingMindMap.mjs`
- `patchA2Day2PersonDescriptionPrompt.mjs`
- `patchRequestedTeacherVideosAug6.mjs`

## Migration rules

1. Add final behaviour directly to a shared component or data module.
2. Add a read-only audit or regression test for the behaviour.
3. Run the audit during build and CI.
4. Remove the corresponding mutating script from package commands.
5. Delete the script only after every final value has been verified in source.
6. Never use a patch script to overwrite a newer canonical value.

## Remaining phases

### Phase 2: A2 workbook navigation and submission

Replace these mutators with permanent shared navigation and submission components:

- `patchA2LegacyPortalSafety.mjs`
- `patchA2ReactOwnedDomCleanupSafety.mjs`
- `patchA2FallbackWorkbookSafety.mjs`
- `patchWorkbookSubmissionAutoSelection.mjs`

Target: one A2 workbook shell for Days 1–30 with route-locked submission context and native Grammar → Teil 1–4 → Ref → Submit navigation.

### Phase 3: A1 workbook shell

Move all A1 tutor-marked days to `A1TutorMarkedWorkbookShell`, then retire A1 navigation and Day 19/20 patch scripts.

### Phase 4: B2 and C1 lesson data

Move B2 Days 9–12 and C1 opinion/writing content into reusable lesson-data schemas. Replace content patch chains with schema validation.

### Phase 5: platform behaviours

Move signup recovery, audio reliability, feedback presentation, resubmission review, and live-class identity changes into their owning services/components. Keep integration tests, but remove source mutation during start, build, and test.

## Definition of done

The migration is complete when `prestart`, `prebuild`, and `pretest` contain only:

- read-only audits,
- data generation from an authoritative external source,
- tests,
- and the normal application command.

They must not edit tracked React, JavaScript, CSS, test, or configuration files.

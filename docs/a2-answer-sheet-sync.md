# A2 answer-sheet sync

A2 answer keys now have one Google-side source of truth.

## Sources

1. Falowen lesson content
   - A2 workbook pages under `web/src/components/`
2. GitHub answer manifest
   - `functions/data/answerKeyManifest.json`
3. Master Google Sheet
   - spreadsheet title: `answers`
   - spreadsheet id: `1CtNlidMfmE836NBh5FmEF5tls9sLmMmkkhewMTQjkBo`
   - tab: `Sheet1`
   - A2 assignments currently occupy rows 20–47

## Individual answer sheets

Each A2 assignment's individual `Key` sheet now reads its assignment name and answer row directly from the master `answers` spreadsheet with `IMPORTRANGE`.

That means individual answer links are no longer maintained independently. Updating the matching A2 row in the master sheet automatically propagates to the individual answer link.

## Required workflow for A2 Lesen changes

When an A2 Lesen text/question changes:

1. Update the Falowen lesson.
2. Update `functions/data/answerKeyManifest.json`.
3. Update the matching row in the master `answers` Google Sheet.
4. Verify the individual `Key` sheet resolves the new values.

The GitHub workflow `A2 Lesen answer sync` checks the Falowen lesson against the manifest on every relevant pull request. The private Google master sheet is verified through the connected Google Drive workflow rather than unauthenticated GitHub Actions.

# One-shot answer key import (single command)

If you already have one big JSON object of all assignments (like the one you pasted), you can import everything in **one run**.

## 1) Save your JSON into a file
Create:
- `functions/data/answerKeyManifest.json`

Use `functions/data/answerKeyManifest.example.json` as shape reference.

## 2) Run one command
```bash
cd functions
npm run import:answer-keys -- --file ./data/answerKeyManifest.json --version 1 --includeAnswers true
```

## What the script does
For each entry:
- Reads `assignment_id` (fallbacks to title key).
- Normalizes to uppercase assignment key.
- If `answers` exists and `--includeAnswers=true`, uploads `answers` JSON to Cloud Storage at:
  - `answer-keys/{ASSIGNMENT_KEY}/v{VERSION}.json`
- Upserts Firestore docs:
  - `answerKeyRegistry/{ASSIGNMENT_KEY}` (active pointer)
  - `answerKeyRegistryVersions/{ASSIGNMENT_KEY__vN}` (history)

## Why this helps
You do **not** need to run one assignment at a time anymore.
You can keep one manifest in repo and import all in one shot.

# Answer-key storage pattern (recommended)

Use **Cloud Storage for the actual answer dictionary** and keep **Firestore as a registry of metadata/pointers**.

## Why
- Avoid bloating Firestore docs with large answer maps.
- Prevent accidental propagation of full answers through client payloads.
- Support versioning and safe rollback.

## Firestore collections

### `answerKeyRegistry/{ASSIGNMENT_KEY}`
Active pointer per assignment.

Suggested fields:
- `assignmentKey` (string, uppercase canonical key, e.g. `A1-DAY-1`)
- `answerUrl` (string, usually `gs://...`)
- `format` (string: `json`, `csv`, ...)
- `version` (number)
- `checksum` (string, sha256)
- `isActive` (boolean)
- `updatedAt` (server timestamp)

### `answerKeyRegistryVersions/{ASSIGNMENT_KEY__vN}`
Append-only history per version.

Suggested fields:
- `assignmentKey`
- `answerUrl`
- `format`
- `version`
- `checksum`
- `createdAt` (server timestamp)

## Cloud Storage path
- `answer-keys/{ASSIGNMENT_KEY}/v{VERSION}.json`

## Script in this repo
Use the helper script to upload a dictionary and upsert registry metadata:

```bash
cd functions
npm run upsert:answer-key -- \
  --assignmentKey A1-DAY-1 \
  --file ../answer-keys/a1-day-1.json \
  --version 1 \
  --format json \
  --bucket your-project.appspot.com
```

This script:
1. Uploads file content to Cloud Storage.
2. Computes `sha256` checksum.
3. Updates active metadata in `answerKeyRegistry`.
4. Adds/updates a version record in `answerKeyRegistryVersions`.

## Client usage
Clients should read only metadata (`assignmentKey`, `answerUrl`, `version`, etc.), not inline dictionaries. Full answer content should be fetched in controlled backend/admin flows.


If you get a "Bucket name not specified" error, pass `--bucket` explicitly (or set `ANSWER_KEY_BUCKET`).

# Falowen mock Hören audio: stable paths

## Convention for **new** recordings

Use **Hören** only in German UI labels and lesson text. Use lowercase ASCII **`hoeren`** for new API slugs, IDs, source names and Cloudflare R2 folders.

- Bucket: `falowen-course-audio`
- New mock Hören object key: `<level>/mock-hoeren/mock-XX/teil-N.mp3`
- Example: `a1/mock-hoeren/mock-04/teil-1.mp3`
- Example: `a2/mock-hoeren/mock-03/teil-4.mp3`
- Example: `b1/mock-hoeren/mock-02/teil-2.mp3`
- Example: `b2/mock-hoeren/mock-02/teil-3.mp3`

Use `buildMockHoerenObjectKey({ level, mockId, part })` from
`functions/functionz/mockHoerenObjectKeys.js` to construct these paths. The
builder validates supported levels, zero-padded mock IDs and part numbers and
always emits MP3. For future mock upload features, save the resulting object
key in that mock's audio manifest and use the existing authenticated
`/course-media/<level>/mock-audio-url` signer. **Do not infer keys at playback
time when a manifest already stores an exact object key.**

## Existing paths that must continue working

These objects are already referenced in lessons or exams. Their exact path and
case must remain unchanged; Cloudflare R2 keys are case sensitive.

| Recording | Existing key example | Plan |
|---|---|---|
| A1 Mock 1 | `a1/mock-hoeren/mock-01/teil-1.wav` | Keep |
| A2 Mock 2 | `a2/mock-horen-2/teil-1.mp3` | Keep |
| B1 Mock 1 | `b1/mock-hoeren-1/teil-1.mp3` | Keep |
| B2 Mock 1 | `b2/mock-hoeren-1/teil-1.mp3` | Keep |
| A1 exam sample 2 | `a1/horen-part-2/teil-1.mp3` | Keep (separate sample type) |
| C1 exam sample | `c1/exam-horen-1/teil-1.mp3` | Keep (separate sample type) |
| B1 speaking sample | `b1/mock-hoeren-1/sprechen-teil-1.mp3` | Keep (not a new listening part) |

The R2 signed-URL validators explicitly accept both these legacy object names
and the canonical *new* names. **Supporting a canonical key does not migrate,
copy, rename or create that object in R2**. New code must upload to the
canonical key before referring to it.

## Rules for future upgrades

1. Keep the existing exam/lesson IDs, student answers, result storage and
   playback limits unchanged.
2. Use `hoeren` for machine slugs, `Hören` for student display.
3. Use `mock-01`, `mock-02`, ... and `teil-1.mp3`, etc. for future audio.
4. Maintain exact object-key checks with protected signed GET links. Never
   auto-deaccent, lowercase or rewrite an existing key at request time.
5. Keep existing A1/A2/B1/B2 listening mock paths plus A1/C1 sample paths as
   compatibility fixtures in `mockHoerenObjectKeys.test.js`.
6. A1 currently supports parts 1–3 and A2/B1/B2 parts 1–4. For other levels
   or formats, implement their protected endpoints and tests first.
7. Publishing standalone Course Book studio exercises is a separate workflow:
   `<level>/studio/<assignment-id>/<uuid>.mp3` and must not be renamed
   or mixed into mock-exam folders.

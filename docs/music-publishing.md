# Publishing approved music to music.falowen.app

**An MP3 uploaded to Cloudflare R2 is not automatically published.** This is intentional: `falowen-course-audio` also contains private course Hören recordings. The public library must never list arbitrary objects from the bucket.

## Current architecture

1. A teacher uploads and listens to a final, approved MP3 under `falowen-course-audio/music/<level>/day-XX/<filename>.mp3`. The **exact key including the filename** is required.
2. The approved song is registered in `web/public/music/catalog.json` with `approved: true` and `audioUrl: https://www.falowen.app/api/music?track=<id>`. The catalogue is the **single publication allowlist**. Only keys under `music/<level>/day-XX/` are accepted by the API. The private R2 bucket remains private.
3. The learner site is built and deployed to `www.falowen.app` / `music.falowen.app`. The public `/api/music?track=<id>` API signs a short-lived (15-minute) R2 GET URL for each approved track, with no public object listing or user-supplied R2 keys.
4. If matching final-audio-approved learning assets are available in `web/public/music/learning.json`, the song detail page also shows complete lyrics, vocabulary, listening questions and speaking practice. Otherwise, **the song is listen-only**, with no invented learning content.
5. The song's shareable static page is `web/public/music/songs/<id>.html`, with its own title and social previews. The library fetches the catalogue once per page visit. It does not scan R2, run a background job, or call AI.

## Single-command manual registration

Prepare a temporary JSON input outside the repository (sample below). **Never enter R2 credentials, bucket tokens, S3 credentials or private URLs.** The `objectKey` is a *path inside* the existing bucket, not a Cloudflare dashboard URL.

```json
{
  "id": "a2-day-19-shopping",
  "title": "Approved A2 Day 19 song title",
  "level": "A2",
  "day": 19,
  "assignmentKey": "A2-7.19",
  "topic": "Einkaufen: wo und wie",
  "genre": "Bossa Pop",
  "objectKey": "music/a2/day-19/EXACT-APPROVED-FILENAME.mp3",
  "attendance": true,
  "slides": false
}
```

**This is a template, not a published entry.** Replace the placeholder title and `EXACT-APPROVED-FILENAME.mp3` with the verified final MP3 data before publishing. Filenames must use lowercase letters, digits and hyphens.

After confirming the object exists in Cloudflare R2, listening through the complete audio, checking the commercial rights, and approving the final lyrics:

```bash
node scripts/publishApprovedMusic.mjs --file /path/to/approved-track.json
node scripts/publishApprovedMusic.mjs --file /path/to/approved-track.json --apply --audio-reviewed
node --test tests/music-learning-room.test.mjs
```

The first command is a dry run. The second makes the catalog entry and creates the shareable song-detail HTML file; review both changes in a PR. It does **not** generate, download or upload any MP3s; it also does not deploy or change bucket permissions. Only merge and release after review. Existing songs are rejected on duplicate IDs/keys.

## Why A2 Day 19 is currently missing

The Cloudflare URL ending `?prefix=music%2Fa2%2Fday-19%2F` points to an R2 **folder prefix**, not a public song URL or an exact object key. As of the 28 October catalogue, the approved lesson tracks are **A1 Day 4, A1 Day 22, A2 Day 18**. A2 Day 19 has not been registered as a public music track, so it is not in the music site or the signed playback API.

The separate A2 Day 19 classroom Hören recording `a2/day-19/einkaufen-wo-und-wie.mp3` is **not** the song. Do not publish it as music. Preserve existing private Hören access.

## Music questions and student experience

The three initial learning packs are copies of teacher-approved original Falowen song lyrics and reviewed questions from the Admin songbook. All questions are ungraded practice. If an uploaded MP3 has different lyrics, **listen and update the learning pack before enabling questions**. A newly registered song without a matching reviewed pack is playable, but has no quiz or lyrics until explicitly reviewed.

The platform remains on the existing learner Vercel deployment with the original signed R2 flow. Do not enable the bucket's public access, create another music-generation call, or introduce Firestore reads, background scans or scheduled publishing.

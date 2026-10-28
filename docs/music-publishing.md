# Publishing approved music to music.falowen.app

**NEW: Approved songs uploaded to the dedicated `music/` folder automatically appear on the website after a refresh.** The public site shows all 28 days for each A1–C2 level. An empty day says "No song yet" until it has a recording.

**Important privacy rule:** Uploading a file under `music/<level>/day-XX/` now counts as **approving it for public listening**. Never upload private Hören conversations, unreviewed audio, copyrighted content without rights, or student recordings into `music/`. The separate private course audio areas (`a1/`, `a2/`, `b1/`, etc.) remain inaccessible to public music discovery.

## Automatic upload-to-website flow

1. In the private Cloudflare R2 bucket **falowen-course-audio**, upload a reviewed MP3 to a music-only folder with this exact convention: `music/a2/day-19/lieber-online-oder-im-laden.mp3` (replace level/day and filename appropriately). Use the exact lowercase level/day folders and an `.mp3` file. Song filenames may contain letters, digits, spaces, underscores, hyphens or parentheses; the server handles these safely.
2. Open **https://music.falowen.app/**, select the A2 level, and find **Day 19**. The website performs a **single on-demand `ListObjectsV2` request** scoped to the `music/` prefix. The server returns only files matching strict `music/(a1|a2|b1|b2|c1|c2)/day-01..28/*.mp3` patterns.
3. The day changes from **"No song yet"** to the new track, using the filename as its initial title. Its Play button uses a short-lived R2 signed GET URL created server-side; the private R2 credentials never reach the browser.
4. If it is not visible immediately, press **Refresh songs**. The listing is cached around 45 seconds to limit R2 requests. No cron job, Firestore database, or scheduled scanner is needed.
5. Existing manually approved catalog songs still appear with their curated titles, genres and linked lyrics/questions. An automatic discovery of the same R2 object is deduplicated. **New files remain listen-only until their lyrics/quiz are reviewed and added separately.**
6. The R2 API token configured on the learner Vercel project must permit **listing objects** under `music/`. If it does not, the page displays a discovery warning and preserves existing approved songs. Do not loosen public bucket permissions.

### A2 Day 19

Your Cloudflare dashboard link `?prefix=music%2Fa2%2Fday-19%2F` shows the directory only. A file like `music/a2/day-19/lieber-online-oder-im-laden.mp3` (illustrative filename) will be picked up automatically; the actual file name was not visible from the shared link. **The Hören conversation** `a2/day-19/einkaufen-wo-und-wie.mp3` **must remain private** and is never listed as music.

## Manual curation is now optional

For better display titles, search metadata, curated audio/lyrics alignment, and permanent per-song SEO pages, you may still register a reviewed MP3 in `web/public/music/catalog.json` using the helper below. This is **not required to make a newly uploaded song playable**.

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

**This optional metadata template is not a published entry.** Replace the placeholder title and `EXACT-APPROVED-FILENAME.mp3` with the verified final MP3 data before publishing. Filenames must use lowercase letters, digits and hyphens.

After confirming the object exists in Cloudflare R2, listening through the complete audio, checking the commercial rights, and approving the final lyrics:

```bash
node scripts/publishApprovedMusic.mjs --file /path/to/approved-track.json
node scripts/publishApprovedMusic.mjs --file /path/to/approved-track.json --apply --audio-reviewed
node --test tests/music-learning-room.test.mjs
```

The first command is a dry run. The second adds optional curated metadata and a dedicated SEO share page; review both changes in a PR. It does **not** generate, download or upload any MP3s; it also does not deploy or change bucket permissions. Only merge and release after review. Existing songs are rejected on duplicate IDs/keys.

## Why A2 Day 19 is currently missing

The Cloudflare URL ending `?prefix=music%2Fa2%2Fday-19%2F` points to an R2 **folder prefix**, not a public song URL or an exact object key. As of the 28 October catalogue, the approved lesson tracks are **A1 Day 4, A1 Day 22, A2 Day 18**. A2 Day 19 has not been registered as a public music track, so it is not in the music site or the signed playback API.

The separate A2 Day 19 classroom Hören recording `a2/day-19/einkaufen-wo-und-wie.mp3` is **not** the song. Do not publish it as music. Preserve existing private Hören access.

## Music questions and student experience

The three initial learning packs are copies of teacher-approved original Falowen song lyrics and reviewed questions from the Admin songbook. All questions are ungraded practice. If an uploaded MP3 has different lyrics, **listen and update the learning pack before enabling questions**. A newly registered song without a matching reviewed pack is playable, but has no quiz or lyrics until explicitly reviewed.

The platform remains on the existing learner Vercel deployment with the original signed R2 flow plus on-demand music-only discovery. Do not enable the bucket's public access, create another music-generation call, or introduce Firestore reads, background scans or scheduled publishing.

## Timed lyric highlighting (Admin slides and public Music)

Timings use the actual MP3 playback clock; pause, seek, repeat and speed changes stay aligned. No timing is estimated from song duration and no AI request is made.

1. Open the lesson song in Admin slides, choose **Liedtext**, then expand **Lehrkraft · Zeitmarken für beide Musikplayer**.
2. Play the final recording. Press **Zeilenanfang markieren** at the beginning of each sung line, including every repeated chorus. Undo the last mark if needed. Local edits are saved on this device.
3. Once every line is marked, test the highlighting and export **Zeitmarken für Cloudflare**. Keep the generated filename: e.g. `lieber-online-oder-im-laden.lyrics.json`.
4. Upload that JSON beside its MP3 in the existing public-release folder: `music/a2/day-19/`. This publishes the reviewed lyrics/timings to listeners. Keep the MP3 in place. The JSON contains its exact `objectKey`, the final `lyrics` and ordered `cues: [{start: 4.2, text: "..."}]` in seconds.
5. Reload the song after the short metadata cache (up to 60 seconds). Both Admin and public Music read the same file. The public Lyrics tab can be available without a quiz; existing quizzes are hidden if the published lyrics differ from their reviewed learning pack.

The read-only `/api/music-lyrics` endpoint is confined to music MP3 sibling files. It rejects private course audio paths, mismatched recordings, incomplete/unordered line timings, and oversized files. A missing timing file leaves existing plain lyrics/audio available. No new Firestore storage, background jobs or bucket permission changes are required. Admin's complete local timing edits take priority until removed/updated on that device.

The seven recordings listed in `docs/music-recording-timings.md` already have built-in recording-specific timings. They need no manual marking or R2 timing-file upload. Built-in timings take precedence for those exact MP3 keys. New recordings can still use the manual sidecar workflow.

## Shuffle playback

The player offers a saved **Shuffle** setting. It shuffles the selected song list without duplicates, keeps the current song playing, and reshuffles when that list is exhausted. Enabling Shuffle clears Repeat song so the player can advance; previous/next controls remain available. Turning Shuffle off restores the selected list’s normal order.

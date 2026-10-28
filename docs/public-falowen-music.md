# Falowen Music public library

The public site **https://music.falowen.app/** is served by the existing Falowen learner Vercel project, via the host-specific root route in the root `vercel.json`. This is **not** a Cloudflare R2 bucket endpoint or a new Vercel project. The public site is static and needs no login, Firestore rules, Firebase function, new background scan or paid music generation.

## Where songs come from

- `web/public/music/catalog.json` is the approved public song list. Every song needs a real, publicly accessible HTTPS MP3 in `audioUrl`.
- The two initial general songs are existing MP3 files in the Admin site's `public/` folder; no MP3s are copied into the learner repository.
- For a new day song, add the MP3 to `web/public/music/a1/day-22/zoom-01.mp3` (GitHub/Vercel, small libraries) **or** upload to a dedicated **public** Cloudflare R2 music bucket under a separate media hostname (recommended for larger libraries). Never expose private Hören audio or private R2 S3 credentials.
- Then add a catalog row such as:

```json
{
  "id": "a1-day22-gesundheit",
  "title": "Mein Kopf tut weh",
  "level": "A1",
  "day": 22,
  "assignmentKey": "A1-14.1",
  "topic": "Gesundheit und Körperteile",
  "type": "Story song",
  "language": "German + English",
  "audioUrl": "https://music.falowen.app/music/a1/day-22/zoom-01.mp3",
  "attendance": true,
  "coursebook": true
}
```

The example is **not published** until the MP3 exists and the catalog entry is committed. Do not add a fake or missing URL.

## How the three surfaces share the song

1. Public music library: `https://music.falowen.app/?level=A1&day=22`; song-specific share links use `?track=a1-day22-gesundheit`.
2. Coursebook: `FalowenLessonMusic` reads the same public catalog once per mounted lesson and shows the player **only** for a matching approved level/day/assignment. A1 Chapter 14.1 is wired up; other lessons can reuse the component. `https://music.falowen.app/music/embed.html?level=A1&day=22` is an optional standalone iframe player for other lesson editors.
3. Admin attendance: the waiting room can fetch this same catalog and select `attendance: true` songs matching the session level/day. When none is published, retain the existing general playlist.

## Cloudflare and domain safety

`music.falowen.app` is already attached to the **falowenexamtrainer** Vercel project. Keep it pointing to the learner website. If you want to store MP3s in R2, use a **separate** public media domain (for example `audio.falowen.app`) or an existing public R2 music URL for the `audioUrl` field. One hostname cannot simultaneously point directly to a raw R2 bucket and to a Vercel website without an explicit routing/proxy layer. Do not move the domain to R2.

Use the Music Studio in Falowen Admin to generate a track; listen and approve the mix and outro, then download and publish its MP3. Uploading a file or editing the catalog is deliberate: no automatic publishing, no unreviewed songs, no additional generation costs.

## Private R2 teacher-approved playback (A1 Day 22 / A2 Day 18)
Two explicit course-song objects in the existing **private** falowen-course-audio bucket have been approved for public music playback: `music/a1/day-22/mein-kopf-tut-weh.mp3` and `music/a2/die-karte-funktioniert-nicht.mp3`. They are never served by a Cloudflare dashboard URL and no bucket-wide public access is enabled. The catalog's `audioUrl` points to `https://www.falowen.app/api/music?track=<id>`, a low-cost on-demand Vercel route which permits **only the two exact IDs** and redirects to a fresh 15-minute R2 GET signature using existing server-side credentials. The only additional API call is when someone plays the song. Private Hören is not available through this route.

Their public catalog metadata enables the Falowen Music site, A1/A2 lesson music and Admin attendance/slides to refer to one canonical track. A1 Day 22 uses track `a1-day-22-health`; A2 Day 18 uses `a2-day-18-bank`. An uploaded MP3 cannot be verified from the Cloudflare dashboard link alone; test real browser playback after deployment. Final 302 redirects must use **plain HTML media** (no `crossOrigin=anonymous` for the private R2 endpoint), as R2 media may not send cross-origin Web Audio CORS headers. No YouTube video is required for these two lessons. Future music days remain unlisted until their audio and lesson approval are complete.

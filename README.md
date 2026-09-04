# Falowen Language Hub.
Falowen Exam Coach is a two-part application that helps learners practice spoken German exam tasks. The backend (Express + OpenAI) evaluates answers and stores lightweight history, while the frontend (React) guides users through placement and speaking practice.

## Repository structure
- `functions/functionz/` – Express backend with routes for speaking analysis, placement, and task scheduling.
- `web/` – React frontend that records audio/text answers and calls the backend.
- `api/`, `vercel.json` – Deployment helpers for serverless environments (the API entry re-exports the Express app from `functions/functionz/app.js`).

## A1 tutor-marked workbook standard
All in-app A1 tutor-marked / submission-required workbook pages must use the shared shell:

```
web/src/components/A1TutorMarkedWorkbookShell.js
```

Rules:

- A1 tutor-marked workbooks may include an in-workbook **Grammar** tab before the assignment content when the chapter already has in-app grammar notes.
- The assignment and submission flow must stay inside the workbook: **Grammar** (when available), **Overview/Assignment**, lesson-specific **Teil** tabs, and **Submit**.
- Do not use the A2/B1 `WorkbookTabNav` or the A2/B1 `Teil 1`, `Teil 2`, `Teil 3`, `Teil 4`, `Ref`, `Submit` tab structure for A1.
- Do not send students to the generic `/campus/course?submitWork=1` page from A1 tutor-marked workbooks.
- The Submit tab must render `AssignmentSubmissionPage` inside the workbook page.
- The submit form must be locked with `submissionContext` using the correct `level`, `day`, and canonical `assignmentKey`.
- Use `getInlineCourseAssignments(level, day)` and the workbook chapter to resolve the correct assignment key. Keep a safe `fallbackAssignmentKey` such as `A1-0.1`, `A1-4`, or `A1-8`.
- Practice-only A1 workbooks are not tutor-marked and do not need this shell unless they later become submission-required.

A1 tutor-marked assignment chapter keys:

```
0.1, 0.2, 1.1, 1.2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12.1, 12.2, 13, 14
```

In code and submissions, these are stored as canonical assignment IDs with the level prefix. Examples: `0.1` becomes `A1-0.1`, `12.2` becomes `A1-12.2`, and `14` becomes `A1-14`.

Example:

```jsx
<A1TutorMarkedWorkbookShell
  day={1}
  chapter="0.1"
  fallbackAssignmentKey="0.1"
  title="A1 · Day 1 Workbook · Greetings"
  subtitle="Chapter 0.1 · Tutor-marked assignment"
  submitTitle="Submit A1 · Day 1 · Chapter 0.1"
>
  <section>Assignment content here</section>
</A1TutorMarkedWorkbookShell>
```

## A2/B1 workbook tab standard
The default in-app A2/B1 workbook sequence is:

**Grammar → Teil 1 → Teil 2 → Teil 3 → Teil 4 → Ref → Submit**

Rules:

- Grammar notes are first-class workbook content for A2/B1 and should open from the **Grammar** tab instead of being restored as a separate grammar supporting-material card.
- The **Goethe Free Chat / AI speaking coach belongs only to Teil 1 · Sprechen**. It must never be visible while the **Grammar** tab or a dedicated A2/B1 grammar-notes view is active. `web/public/course-speaking-chat-cleanup.js` is the cross-layout safety guard for legacy workbooks whose old Teil 1 DOM can remain mounted behind a Grammar portal.
- `web/src/components/A2B1WorkbookGrammarNotes.js` is the source of truth for which A2/B1 day owns which grammar-notes component.
- Newer shared workbook pages should use `A2_B1_WORKBOOK_TABS_WITH_GRAMMAR` and render `A2B1GrammarNotesTab` for the Grammar section.
- Older A2/B1 workbook pages that still pass `STANDARD_WORKBOOK_TABS` rely on `WorkbookTabNav` to add the Grammar tab from the workbook's `A2 Day N` / `B1 Day N` aria label. Do not replace this with a separate hand-built grammar link.
- `A2LegacyStandardWorkbookNavigationImpl` owns Grammar as portal content on restored legacy A2 routes and must keep `renderLegacyGrammarPanel={false}` so the Grammar notes are rendered once, not twice.
- Intentional lesson-specific exceptions must remain intact. For example, a workbook that genuinely has no Teil 4 must not have Teil 4 reintroduced just to match the default sequence.
- When changing a legacy Teil 4 Hören YouTube resource, update both the external YouTube link and the embedded player URL, then keep a regression assertion for the requested video ID.
- Keep `web/src/components/A2B1LegacyGrammarTabRegression.test.js` passing. It protects the seven-tab order, the no-double-Grammar behavior, the legacy A2 adapter, and requested legacy Hören media.

## Prerequisites
- Node.js 18+ and npm
- An OpenAI API key with access to the `gpt-4o-mini` family

## Configuration
Create a `.env` file in the repository root for the backend:

```
OPENAI_API_KEY=your-key-here
# Optional overrides
PORT=5000
```

Create a `.env` file inside `web/` for the frontend (optional when using the default localhost backend):

```
REACT_APP_BACKEND_URL=http://localhost:5000
```

## Course media: AI video, teacher lecture video, and Falowen Radio
The Course Book lesson page can show three different media types. They must be configured in the correct file so the app knows what label and button to show.

### 1. AI grammar video
Use this for AI-generated grammar explanations or AI revision videos.

Main file:

```
web/src/data/lessonVideoDictionary.js
```

The app recognizes an AI video when the lesson has one of these fields:

```js
ai_grammar_video
aiGrammarVideo
ai_grammar_video_url
aiGrammarVideoUrl
ai_video
aiVideo
```

Example:

```js
A2: {
  7: {
    ai_grammar_video: "https://youtu.be/VIDEO_ID",
  },
},
```

Or as a full resource:

```js
A2: {
  16: {
    videoResources: [
      {
        key: "a2-day16-ai-grammar-video",
        chapter: "6.16",
        title: "AI grammar video",
        description: "Step-by-step grammar explanation for revision and self-study.",
        url: "https://youtu.be/VIDEO_ID",
      },
    ],
  },
},
```

In the Course Book UI, this appears as **AI Grammar Explainer** with a **Watch AI video** button.

### 2. Teacher lecture video / tutor lecture video
Use this only for real teacher/tutor lecture recordings.

#### A1
A1 remains separate because some A1 days can have more than one teacher video for the same day/chapter:

```
web/src/data/a1TeacherVideoResources.js
```

Example:

```js
[2, "0.2", "German Alphabet", "https://youtu.be/VIDEO_ID"]
```

#### A2, B1, B2 and C1
All teacher lectures for A2 through C1 now use one registry:

```
web/src/data/teacherLectureVideoResources.js
```

The file already contains **Day 1–28 for A2, B1, B2 and C1**. The chapter values are already filled in. In normal use, do not rebuild the dictionary and do not change the chapter. Find the level and day, then paste the YouTube link into `tutor_lecture_video`.

Blank slot:

```js
8: [{ chapter: "3.8", tutor_lecture_video: "" }],
```

After adding the teacher lecture:

```js
8: [{ chapter: "3.8", tutor_lecture_video: "https://youtu.be/VIDEO_ID" }],
```

Current B1 Day 8 / Chapter 3.8 example:

```js
B1: {
  8: [{
    chapter: "3.8",
    topic: "B1 Day 8",
    tutor_lecture_video: "https://youtu.be/GuQcUitfvQA",
  }],
},
```

Current A2 Day 14 / Chapter 5.14 example:

```js
A2: {
  14: [{
    chapter: "5.14",
    topic: "Beruf und Karriere",
    tutor_lecture_video: "https://youtu.be/hGK64aXtARk",
  }],
},
```

`topic` is optional. The only field you normally need to edit is `tutor_lecture_video`.

Rules:

- Empty `tutor_lecture_video: ""` slots are ignored and do **not** create empty cards for students.
- Adding a teacher lecture does **not** replace the AI video; both can appear for the same lesson.
- A2, B1, B2 and C1 all use `teacherLectureVideoResources.js` for new teacher lectures.
- A1 continues to use `a1TeacherVideoResources.js`.
- Do not put teacher lecture links in `ai_grammar_video`.
- Do not change the prepared day/chapter mapping unless the curriculum itself changes.

In the Course Book UI, a configured tutor recording appears as **Teacher Lecture** with a **Watch teacher video** button.

### 3. Falowen Radio
Use this for the radio/listening intro shown with the `?radio=done` flow and course radio lessons.

Main files:

```
web/src/data/lessonRadioDictionary.js
web/src/data/additionalA2RadioEntries.js
```

A2 extra radio entries are easiest to update in:

```
web/src/data/additionalA2RadioEntries.js
```

Example:

```js
7: {
  key: "a2-day7-eine-wohnung-suchen-falowen-radio",
  title: "Eine Wohnung suchen (Übung) 3.7",
  youtubeId: "VIDEO_ID",
  duration: "",
  instruction:
    "Höre einfach zu und stimme dich auf das Thema Wohnung suchen ein. Danach gehst du weiter zu Teil 1.",
},
```

Use only the YouTube ID for `youtubeId`, not the full URL. For example:

```
https://youtu.be/P1so4g9y3Ao  ->  P1so4g9y3Ao
```

### How the app decides what to show
The media flow is handled mainly by:

```
web/src/data/lessonModel.js
web/src/data/lessonVideoDictionary.js
web/src/data/teacherLectureVideoResources.js
web/src/data/lessonRadioDictionary.js
web/src/data/additionalA2RadioEntries.js
web/src/components/CourseLessonPageLegacy.js
```

The logic is:

1. `lessonModel.js` normalizes the lesson and collects media resources.
2. `lessonVideoDictionary.js` separates AI grammar videos from teacher lecture videos.
3. `teacherLectureVideoResources.js` provides the A2, B1, B2 and C1 teacher-video registry.
4. `a1TeacherVideoResources.js` provides the A1 teacher lecture videos.
5. `lessonRadioDictionary.js` and `additionalA2RadioEntries.js` provide Falowen Radio.
6. `CourseLessonPageLegacy.js` renders the cards in the Lesson resources box.

### Quick checklist when adding media
- Add AI videos to `lessonVideoDictionary.js` using `ai_grammar_video` or a resource titled `AI grammar video`.
- Add A1 teacher videos to `a1TeacherVideoResources.js`.
- Add A2/B1/B2/C1 teacher videos by pasting the URL into the prepared day slot in `teacherLectureVideoResources.js`.
- Add Falowen Radio videos to `lessonRadioDictionary.js` or `additionalA2RadioEntries.js`.
- Do not put a teacher lecture link in `ai_grammar_video`.
- Do not put a Falowen Radio link in the AI video or teacher lecture files.

## Configure Firebase for auth + Firestore
The React app reads/writes student data from Firestore and relies on Firebase Authentication for login, email verification, and
password resets. To set it up:

1. In the Firebase Console, create a **Web App** and copy the config values into `web/.env` (see `web/README.md` for the full
   list). Set `REACT_APP_AUTH_CONTINUE_URL` to the host you want verification/reset links to return to.
2. Under **Authentication → Sign-in method**, enable **Email/Password**. (Optional) Customize the verification and reset email
   templates to mention your app host.
3. Under **Firestore Database**, create a database (production mode for real users). The app stores student profiles and
   placement history here.
4. (Optional) Under **Cloud Messaging**, create a Web Push certificate key and set `REACT_APP_FIREBASE_VAPID_KEY` to enable
   browser notifications.

### Firestore data used by the app
Client-side data access currently centers around these collections and subcollections:

- `students` documents store the core student profile plus billing/contract fields created during signup (name, class, level,
  studentCode, tuitionFee, balanceDue, paymentStatus, contract dates, etc.).【F:web/src/components/SignUpPage.js†L301-L346】
- `students/{studentId}/notifications` stores per-student notifications read and acknowledged inside the notification drawer.【F:web/src/services/notificationService.js†L199-L277】
- `loginSessions` captures login events with user agent, locale, and provider metadata to support audits.【F:web/src/context/AuthContext.js†L216-L251】
- `writingProgress` holds ongoing writing drafts and syncs with local storage as a fallback cache.【F:web/src/services/writingProgressService.js†L1-L77】
- `scores` provides result history and summaries used for assignments and score views.【F:web/src/services/resultsService.js†L36-L175】
- `attendance/{className}/sessions` stores attendance session data used to build student attendance summaries.【F:web/src/services/attendanceService.js†L116-L141】
- `class_board/{level}/classes/{className}/posts` and `class_board/.../presence` hold class discussion posts and presence data.【F:web/src/components/ClassDiscussionPage.js†L22-L27】

### Check whether a student is verified
- In the Firebase Console, open **Authentication → Users**. The **Email verified** column shows `true` for verified students
  and `false` for accounts that have not clicked the verification link yet.
- If someone signed up before you finished configuring verification emails, their account remains listed with `Email verified`
  set to `false`; they can log in and request a new verification email (or you can click the triple-dot menu in the Users table
  to **Send verification email** from the console). No data is lost—the flag flips to `true` as soon as they verify.

## Export Firestore records to Google Sheets
The checked-in Google Sheets integration is a standalone batch script:

```
functions/functionz/googleSheetsSync.js
```

It is **not** called automatically by the signup flow, and this repository does not currently include a Sheets-to-Firestore push API. Install the Functions dependencies before running it:

```bash
npm --prefix functions install
```

Required variables:

- `GOOGLE_SHEETS_ID` — destination spreadsheet ID.
- `GOOGLE_SHEETS_RANGE` — destination tab/range, for example `students!A:Z`.

Authentication can use one of the credential forms implemented by the script:

- `GOOGLE_SERVICE_ACCOUNT_FILE` or `GOOGLE_APPLICATION_CREDENTIALS` pointing to a service-account JSON file.
- `GOOGLE_SERVICE_ACCOUNT_JSON` or `FIREBASE_SERVICE_ACCOUNT_JSON` containing the JSON directly.
- `GOOGLE_SERVICE_ACCOUNT_JSON_B64` or `FIREBASE_SERVICE_ACCOUNT_JSON_B64` containing base64-encoded JSON.
- Application Default Credentials when running in a Google environment with access to the Sheets API.

Share the destination spreadsheet with the service account when using service-account credentials, and make sure the Google Sheets API is enabled for that project.

Useful optional variables supported by the script include `FIRESTORE_COLLECTION` (default `students`), `SYNC_FIELD` (default `syncedToSheets`), `SYNC_ALL`, `SCAN_LIMIT`, `SHEETS_BATCH_SIZE`, `DEDUPE`, and `DEDUPE_COLUMN`.

The script reads the worksheet header row and maps values by Firestore field name. Unless `SYNC_ALL=1` is set, it reads documents where the sync field is `false`. After a successful append it sets that sync field to `true`. For the `students` collection, deduplication is enabled by default and normally uses column `B` for the student code.

Example from the repository root:

```bash
GOOGLE_SHEETS_ID="<target_sheet_id>" \
GOOGLE_SHEETS_RANGE="students!A:Z" \
GOOGLE_SERVICE_ACCOUNT_FILE="./service-account.json" \
node functions/functionz/googleSheetsSync.js
```

Run or schedule this script separately when a batch export is required; do not document it as a realtime signup hook unless such a hook is actually added to the codebase.

### Deploying the Firestore rules

The repo ships with a `firestore.rules` file. Deploy it so the client can read the data written by the functions:

```bash
firebase deploy --only firestore:rules
```

### Google sign-in

The web app supports Google authentication through `GoogleAuthProvider`. If you enable the provider in the Firebase console, add your web app domains under **Authentication → Settings → Authorized domains** so the popup can complete successfully.

## Deploy to Vercel

The repository includes `vercel.json` so Vercel can build the frontend in `web/` and serve it from the project root. `vercel.json` rewrites all routes to `index.html` for client-side routing; no extra configuration is needed.
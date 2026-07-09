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

- A1 tutor-marked workbooks have only two visible workbook tabs: **Assignment** and **Submit**.
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

A1 teacher videos are managed here:

```
web/src/data/a1TeacherVideoResources.js
```

A1 already has teacher lecture videos configured by day and chapter. Example format:

```js
[2, "0.2", "German Alphabet", "https://youtu.be/VIDEO_ID"]
```

For future A2 or B1 teacher lecture videos, use this simple config file:

```
web/src/data/teacherLectureVideoResources.js
```

Add new A2/B1 teacher lecture videos like this:

```js
const TEACHER_LECTURE_VIDEO_ENTRIES = {
  A2: {
    16: [
      {
        chapter: "6.16",
        topic: "Wohlbefinden und Entspannung",
        url: "https://youtu.be/VIDEO_ID",
      },
    ],
  },
  B1: {
    8: [
      {
        chapter: "3.8",
        topic: "Alles für die Gesundheit",
        url: "https://youtu.be/VIDEO_ID",
      },
    ],
  },
};
```

Rules:

- A1 teacher lecture videos show when an A1 teacher video link exists.
- A2 teacher lecture videos show only when that day is added to `teacherLectureVideoResources.js`.
- B1 teacher lecture videos show only when that day is added to `teacherLectureVideoResources.js`.
- If no teacher lecture video exists for an A2/B1 day, the app does not show an empty teacher video card.

In the Course Book UI, this appears as **Teacher Lecture** with a **Watch teacher video** button.

### 3. Falowen Radio
Use this for the radio/listening intro shown with the `?radio=done` flow and A2/B1 radio lessons.

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
3. `teacherLectureVideoResources.js` controls which A2/B1 teacher videos are allowed to show.
4. `a1TeacherVideoResources.js` provides the A1 teacher lecture videos.
5. `lessonRadioDictionary.js` and `additionalA2RadioEntries.js` provide Falowen Radio.
6. `CourseLessonPageLegacy.js` renders the cards in the Lesson resources box.

### Quick checklist when adding media
- Add AI videos to `lessonVideoDictionary.js` using `ai_grammar_video` or a resource titled `AI grammar video`.
- Add A1 teacher videos to `a1TeacherVideoResources.js`.
- Add A2/B1 teacher videos to `teacherLectureVideoResources.js`.
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
5. For server-side features (Paystack webhook, Sheets sync), deploy the Cloud Functions as described below so they can access
   the same project resources.

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

## Automate Firebase signups to Google Sheets
If your new signup flow writes student records to Firestore, you can mirror those
rows into the approval spreadsheet with the helper script at
`functionz/googleSheetsSync.js`:

1. Create a Google Cloud service account with "Google Sheets API" access and a
   Firebase Admin SDK key. Download the JSON key file and either point
   `GOOGLE_SERVICE_ACCOUNT_FILE` to it or base64-encode it into
   `GOOGLE_SERVICE_ACCOUNT_KEY`.
2. Share the destination sheet (e.g., your approval sheet) with the service
   account email. Set `GOOGLE_SHEETS_ID` to the sheet ID (the long string in the
   sheet URL) and optionally `GOOGLE_SHEETS_RANGE` to change the tab/range
   (default: `Signups!A:E`).
3. Ensure each Firestore signup document contains `firstName`, `lastName`,
   `email`, `level`, `createdAt`, and a boolean `syncedToSheets: false` field so
   the script can find unsent entries. The script marks `syncedToSheets` true
   and adds a `syncedAt` timestamp after a successful append.
4. Run the sync from the repository root:
   ```
   GOOGLE_SHEETS_ID="<target_sheet_id>" \
   GOOGLE_SERVICE_ACCOUNT_FILE=./service-account.json \
   node functionz/googleSheetsSync.js
   ```

You can schedule this script (e.g., with cron) or wrap it in a Cloud Function
for near-real-time mirroring between Firebase and Google Sheets.

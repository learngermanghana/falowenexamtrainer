# Falowen architecture and ownership

**Reviewed:** 2026-11-01.

## Two repositories, several experiences

| Surface | Source / deployment responsibility |
| --- | --- |
| Learner campus `www.falowen.app` | This repo: React in `web/src/`, Vercel routing in `vercel.json` and `api/`, Express/Firebase integrations in `functions/functionz/` |
| Public Music `music.falowen.app` | The learner repo's `web/public/music/` static player and existing music library / signed R2 audio APIs; **not** a standalone public R2 bucket |
| AI-facing public help | `web/public/llms.txt`, `falowen-help.md`, `falowen-navigation.json` and the generated course map |
| Learning Companion MCP | Student-scoped read-only endpoint; [plugin reference](mcp-plugin-reference.md) |
| Tutor/Admin `admin.falowen.app` | Separate **falowenadmin** React/Vite + Firebase Functions repo; do not edit it by changing learner docs alone |
| Media and classes | Signed R2 object access, Firestore, Firebase Auth, class/cohort data with server-side identity checks |

## Boundaries

- Public songs and published course media have distinct paths and approval rules. Never list or expose private Hören MP3s as public music.
- Student progress, assignment submissions, billing and teacher marks are not derivable from public lesson documents. Read them only through authenticated server/API or properly scoped MCP.
- Admin's marking worker may produce scores but is subject to server-owned answer-key versions, confidence and manual-review gates. Read [teaching and marking policy](teaching-and-marking-rules.md).
- Deployment is multi-surface: merging to learner `main` is not a Firebase Functions deployment, an Admin deployment, or public plugin publication.
- No per-listen AI transcription/translation, live background sync or unrestricted Firestore listener should be introduced just for display. Prefer static approved packs and on-demand bounded requests.

## Changes across repos

A contract change involving both learner assignment submission and Admin marking needs separate PRs plus shared payload/version tests. The two repos deploy independently; confirm each side's release status. See [source-of-truth map](content-source-of-truth.md).

## Public landing-page questions

`VisitorQuestionHelper` adds a floating, browser-local enquiry panel to public marketing,
placement, books, class, review, music and exam-practice pages. The route
allowlist in `publicVisitorPaths.js` excludes learner campus and protected exams.
Static public HTML (including the Exams subdomain and class brochures) receives
the same helper from the Vite `publicVisitorHelper` build plugin; React routes
use `PublicVisitorQuestionHelper`, while the homepage retains its existing mount.
Exam/book price questions link to their respective pricing pages instead of
returning course tuition.
`web/src/data/visitorQuestions.js` owns its question patterns and approved answers;
fees reuse `levelFees.js`, location reuses `publicAcademyProfile.json`, and class
questions load the existing public class catalog on demand. No AI request,
background polling, database write or persistent chat history is introduced.
Unknown questions and unconfirmed class/fee details offer the existing admissions
WhatsApp contact with the visitor's question prefilled; the visitor chooses to send.

Admissions answers confirmed on 2026-11-04 cover hybrid attendance, recorded
lectures, a 10-week course, and a six-month total contract. Three months of free
catch-up for travel/illness are within that contract, not an extension after it.
Late entry requires fewer than four completed sessions and recorded catch-up;
the team confirms the session count. Tuition includes app access and digital
books; physical books are requested through `/books`. Official exam registration
is separate: academy-provided A1 guidance is GHS 3,000, while A2–C2 link to
Goethe Ghana for current fees without an unverified price ceiling.

Each level takes 10 weeks and is paid for separately. Learners may continue to
their preferred target level (for example B1/B2), use mock samples along the
way, and sit the official exam for that target level rather than every level.
This describes the academy's learning pathway, not a waiver of a receiving
organisation's certificate requirements. Official exam registration remains separate.

Further admissions policies confirmed on 2026-11-04: minimum age 16 with
vocational/secondary education; JHS applicants need team assessment of eligibility
and ability to use the app. A1 needs no prior German. Students need a suitable
phone/computer and internet, and may choose online, in-person or recorded
attendance each day. Exam registration assistance is guided through Falowen.
Academy documents include a Falowen certificate, transcript, attendance certificate
and class participation certificate, which do not replace Goethe certification;
visa acceptance is not guaranteed. A GHS 2,000 course deposit gives one month's
access; the GHS 1,000 balance after one month unlocks the full six-month period.
GHS 3,000 upfront gives full six-month access. Amounts reuse level fee settings.
Course tuition has no refunds, with a seven-day trial offered before payment;
book, subscription and third-party exam refund terms are referred to the team.

The public `/help` page also renders the approved visitor FAQs.
`publicAdmissionsFaqs.js` derives its entries from the same question dictionary;
`generatePublicHelp.mjs` produces no-JavaScript Help HTML, matching FAQPage JSON-LD
and a generated admissions section in the existing `falowen-help.md`. Indexing
metadata, the Help sitemap entry and llms discovery point to that canonical page.
Confirmed support answers include teacher questions outside class, 24-hour Study
Buddy AI, timetable transfers/pauses within six months, enrolment from abroad and
Exams Room readiness practice with timers and an AI examiner. They do not promise
a passing score or an official qualification.

## App speaking assessments — 4 November 2026

A2 Day 22 (`A2-8.22`) and B1 Day 23 (`B1-7.23`) are app assessments with
no live class. Their timetable slots and canonical assignment IDs stay intact;
subsequent lessons must not move to a different date or day. Learners complete
the existing three-part AI speaking mock; its cloud progress and final result
remain authoritative. Opening the page does not count as submission.
Admin excludes these IDs from live attendance analytics and completion attendance,
live reminder emails, attendance confirmations and automatic check-in opening.
The attendance page links to the learner task instead of present/absent controls.
Existing session metadata is identified by assignment IDs even before repair.
No new background requests or assessment scoring changes are introduced.


## Organisation class selection and price links — 5 November 2026

The public organisation enrolment form loads the public class catalogue when opened and keeps a manual refresh button for retries. Class choices are filtered by each student's selected level. The dropdown explains loading, missing level and no matching classes rather than showing an empty selectable list. The duration/access clause in the agreement UI and the enrolment introduction link to https://www.falowen.app/classes for upcoming classes and current prices. Existing signed agreement snapshots and PDFs are unchanged. Class selection remains a request subject to Falowen confirmation.

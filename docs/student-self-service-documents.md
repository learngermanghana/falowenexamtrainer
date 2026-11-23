# Student Account: on-demand academic documents

## Entry point
The learner opens **Account → Documents**, selects German A1, A2 or B1, and
chooses **Download transcript PDF** or **Check & download certificate**.

- Transcript: available when the canonical Scores sheet contains at least one
  verified result for the selected level; unfinished items remain visible.
- Certificate: still requires the existing Apps Script award policy and signed
  PDF generator. A1 requires 18 current tutor-marked workbooks and the official
  Day 23 Final Mock, all passing at 60 or above; practice attempts do not qualify.
  A2/B1 retain the existing final-completion rules.
- Kiswahili templates are **not** issued by the German document route.
- Downloads do not mark an award as issued, update assessment scores, or send
  email. The existing graduation email worker remains the source of automatic
  delivery.

## Learner email verification and document access

To protect academic records, **the learner must verify the email linked to
their Firebase account before either PDF download is enabled**. The verification
link is free of SMS; no phone verification or SMS code is required.

1. **New learner:** After a successful email/password signup and student-profile
   save, Falowen automatically requests a verification email to the registered
   address. If sending fails or is rate-limited, **signup still succeeds**;
   students can request the link again under **Account → Documents**.
2. **Existing unverified learner:** Sign in with the original Falowen account,
   then open **Account → Documents**. The panel shows **Verify your account
   email** with the account email address. **Download transcript PDF** and
   **Check & download certificate** are disabled until verification succeeds.
3. **Resend:** Click **Send verification email**, then check the inbox and spam
   folder for the verification link. This may be throttled by Firebase if used
   repeatedly; wait and retry rather than creating another student account.
4. **Complete verification:** Open the link in the email. Return to the
   **Account → Documents** panel in the signed-in account and click **I've
   verified my email — check again**. The app reloads the Firebase user,
   forces a fresh ID token and confirms that `emailVerified` is true before
   enabling document actions. If the page says the email remains unverified,
   finish the link first and check again.
5. **Download only if eligible:** After verification, choose a German A1, A2
   or B1 level and request the applicable transcript or certificate. Email
   verification **unlocks the request**, not the award: eligibility and score
   rules still apply, and the API requires the Firebase `email_verified` claim.

A previously enrolled learner who has not verified their email can still sign
in; their **document downloads** remain locked until the verification succeeds.
Verification is not a password reset, does not alter scores or attendance, and
does not automatically issue a certificate. Students who do not receive the
email after checking spam can use the resend button or contact Falowen support.

## Security
The student-facing API route is `POST /api/students/me/documents/:kind`. It:
1. Authenticates the Firebase ID token and requires a verified email.
2. Resolves the signed-in student's account in Firestore.
3. Binds the student code to the authenticated email, rejecting missing or
   mismatched identities; neither email nor student code is accepted from the
   browser request body.
4. Applies a daily 8-request limit.
5. Calls the trusted Announcements Apps Script on the server with its existing
   private webhook token. The token never appears in a browser bundle.
6. Returns only this student's verified PDF with `Cache-Control: no-store`;
   it does not save raw PDF bytes or private data to logs.

## Required separate Apps Script deployment

**GitHub/Vercel deployment alone is insufficient.** Replace the **complete**
bound Announcements + Certificates Apps Script with the supplied handoff
`Falowen_Announcements_Student_Self_Service_20261122.gs`, keeping the existing
Script Properties, menus, signature file and triggers. Review and deploy a **new
web app version**; do not replace the 4,000-line production project with a short
example.

The handoff script adds `exportStudentDocumentFromScores`, which is accepted
only after `doPost` verifies the existing webhook token. It generates transcripts
using `generateScoreTranscriptPdf_` and verified certificates using the
existing `exportVerifiedCertificateFromScores_` gate, fresh Students/Scores CSVs
and `generateCertificatePdf_`. It also avoids showing the current A2 class
on a previously earned A1 certificate.

Configure these **server-side only** environment variables on the learner
site's `falowenexamtrainer` Vercel project (not `REACT_APP_*`):
- `ANNOUNCEMENT_WEBHOOK_URL` — actual deployed Announcements Apps Script /exec URL
- `ANNOUNCEMENT_WEBHOOK_TOKEN` — the same private token in the Apps Script
  Script Properties

Do not commit, print, or paste these secrets into GitHub, a browser or a support
chat. Rebuild/redeploy the learner site after updating its server configuration.

## Release verification
1. Check a real student with a verified login and scores: transcript downloads.
2. Check a completed A1 student: 19/19 and official final mock, correct level
   and class, Director signature present, correct PDF filename.
3. Check an incomplete A1 student: the certificate is denied, even with a
   passing practice attempt.
4. Check another student code passed in the browser body: the server ignores it.
5. Check a new unverified signup: a verification email is requested after
   profile creation; a mail delivery failure does not roll back signup.
6. Check an existing unverified login: both download buttons are disabled, the
   resend control sends a link, and an unverified API request is denied.
7. Click the verification link and **I've verified my email — check again**:
   a user reload and fresh Firebase token enable document actions without
   relaxing the existing transcript/certificate eligibility rules.
8. Check Swahili-only students: no falsely labelled German certificate.
9. Check production logs and that no PDF body, private token, or student scores
   are logged.

No manual score override, class-name substitution, or eligibility bypass occurs
from clicking a download button.

## Enrollment and payment documents

Account → Documents also offers the enrollment letter, payment agreement, latest
available issued receipt and issued residence-permit support letter. These use
the registration sheet, independent of the German academic level selector.
Organisation-managed financial documents remain with Falowen Admin.

Deploy the updated bound Student Docs Apps Script as a web app running as its
owner. Configure the production Vercel server variables
`STUDENT_DOCS_WEBHOOK_URL` (its deployed /exec URL) and
`STUDENT_DOCS_WEBHOOK_TOKEN` (the value of that script’s
`ANNOUNCEMENT_WEBHOOK_TOKEN` Script Property). Redeploy Vercel after saving.
The existing Announcements deployment continues to serve academic documents.

The Student Docs email templates link learners to Account → Documents. Receipt
and residence downloads return matching issued attachments from the sending
mailbox. If an original is unavailable, the learner can contact Falowen.

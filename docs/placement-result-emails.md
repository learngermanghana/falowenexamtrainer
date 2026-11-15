# German placement result emails

The public placement test requires an email before starting its 20-minute timer. First name and consent to future class announcements are optional. The server saves the start in the encrypted PlacementAttempts sheet and gives the browser an opaque ticket. The browser can resume without saving the plain email locally.

On submission or timeout, the learner sees their result immediately. The API grades the answers and uses the ticket to queue one transactional result for the original address. New attempts use the Announcement workbook's existing Outbox and delivery cycle. Each Placement Results row records the email, score, level, separate class-email preference and current delivery status and timestamp. Admissions should filter the preference to TRUE for class-opening emails. Old anonymous sessions can finish and use the original optional contact form.

Set PLACEMENT_ANNOUNCEMENT_SHEET_ID on the Campus server and give the existing Sheets service account editor access to that private workbook. The API checks Drive permissions before writing and requires restricted access (only named users and groups). For Sheets-only projects where Drive metadata returns HTTP 403, the operator may set PLACEMENT_VERIFIED_PRIVATE_SHEET_ID to the same workbook ID after verifying its permissions. Recheck sharing whenever the workbook permissions change. A successful Drive response showing public access always blocks queueing. It must contain the existing Falowen Outbox and a Placement Results tab with these columns in order: Attempt ID, Completed at, First name, Email, Score / 30, Recommended level, Class emails opted in, Email status, Sent at. Keep the Attempt ID header unchanged. A per-attempt named range and atomic batch prevent duplicate queue entries. If delivery cannot be queued, the result stays visible and the learner can retry. The existing sheet cycle retries queued mail subject to its quota.

Legacy post-result contact submissions still use the optional standalone Apps Script mailer (PLACEMENT_MAILER_URL and PLACEMENT_MAILER_TOKEN). Historical attempts without an address cannot receive email.

## Public visitor enquiries

Before deploying the public question helper's enquiry reporting:

1. Use the same restricted Announcement workbook configured in `PLACEMENT_ANNOUNCEMENT_SHEET_ID`. Verify that only approved named users and groups have access and that the existing Sheets service account is an editor. Everyone with workbook access can see the contact details.
2. Set `PLACEMENT_VERIFIED_PRIVATE_SHEET_ID` to that same workbook ID in the Campus server environment. The visitor endpoint requires this match even when Drive verification is available for placement results. Recheck sharing whenever workbook permissions change.
3. Create a tab named exactly `Visitor Enquiries`. Give row 1 these headers in columns A–F, in order: `Date and time (UTC)`, `Event`, `Source`, `Email`, `Phone`, `Enquiry ID`. Keep the first header unchanged because the retry check uses it.
4. After deployment, open the helper and ask a question, then submit a follow-up request with an address or number you control. Verify rows for `helper_opened`, `question_asked`, and `contact_submitted` in the tab. Repeat the open and question on the music site and check for source `music`. Remove test data after verification.

The first two events record only a UTC timestamp, event type and source (`landing`, `music`, `exams` or `public`). Count those rows by event and source to measure usage. They are event counts rather than unique visitor counts. A visitor can actively submit an email, a phone or WhatsApp number, or both to request an admissions reply before typing a question. Only that action creates a contact row with an enquiry ID used to prevent duplicate writes on retry. Question text is never written to the sheet. Use contact rows for admissions follow-up about the enquiry. The form does not subscribe visitors to class announcements or send automated messages.

A missing tab or mismatched workbook setting prevents writes. The helper still answers questions and lets visitors proceed without sharing contact details. Anonymous events are best effort and failed writes are absent from the report. A failed contact write shows the visitor a retry message.

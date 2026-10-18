# Falowen placement result emails (no AI and no new paid sender)

## Current behavior
Public test \`start\` and \`complete\` events are stored as encrypted records in the existing PlacementAttempts Google Sheet.
A separate, optional contact form saves \`name\`, \`email\`, \`phone\`, consent, and sends a best-effort lead to the existing admissions Apps Script. The browser cannot verify that lead request.
The old Admin "Email learner" link only opens a plain-text mail draft. It does not send any email.

## What this change adds
When a learner has **completed** a graded test and submits the optional name, valid email, and consent form, the private placement API verifies the saved completed result and generates a branded A1/A2/B1 result email. It does not use OpenAI, timer polling, a new database or background jobs.

If the mailer is configured, the API sends the message to one dedicated Apps Script Web App running as the Falowen Gmail account. That script sends HTML and a plain-text fallback with \`MailApp\`, uses a per-attempt locked property to deduplicate retries, and returns delivery status. The API records an encrypted \`email_sent\` event so Admin can show confirmed sends. A Vercel or script failure does not roll back the already saved result/contact.

If the mailer is **not configured**, nothing is emailed. Results and contacts continue saving; users see an honest "automatic email not active" status, and staff retain their manual draft option. Phone-only contacts do not receive an email.

## One-time setup (required before emailing)
1. In the Falowen Gmail account that should send the messages, create a **new**, standalone project in [Google Apps Script](https://script.google.com/). Do not replace the existing admissions Leads web app or overwrite its \`doPost\`.
2. Copy \`apps-script/placement-results-mailer.gs\` into that project.
3. Under Project Settings → Script Properties, add \`PLACEMENT_MAILER_TOKEN\` with a long randomly generated secret (at least 32 bytes). Never commit it.
4. Run a temporary authorization helper or \`MailApp.getRemainingDailyQuota()\` from the script editor to approve MailApp sending permissions for the deploying account.
5. Deploy → New deployment → Web App → Execute as **Me**; Who has access → **Anyone** (server requests are authenticated with the shared secret). Copy the HTTPS \`/exec\` URL.
6. In the **Falowen frontend/server Vercel project** (not Falowen Admin or Sedifex), add \`PLACEMENT_MAILER_URL\` and \`PLACEMENT_MAILER_TOKEN\` with the same secret. Redeploy the intended Falowen project only.
7. Take a test on staging, opt in with an email you own, submit the post-result form. Confirm exactly one message, its A1/A2/B1 breakdown, and the Admin "Result email sent" timestamp. Retry the form and verify no second email.
8. Check Google Apps Script executions/quota and Falowen API logs after launch.

## Safety and cost
- No automatic email to unconsented, unfinished or phone-only attempts.
- Users cannot supply scores in a contact request; grades are retrieved from the encrypted Sheet.
- Neither a missing mailer nor a mail error changes a saved score.
- One mailer request only after contact capture, not on every question, timer tick, or staff dashboard refresh.
- Google documents consumer Apps Script quotas of 100 email recipients per day and Workspace quotas of 1,500/day (limits can change).
- An \`email_sent\` Sheet event plus Apps Script attempt deduplication prevents typical repeat sends. If a script sends successfully but both the API receipt append and script deduplication storage fail, the system may not fully detect delivery; do not claim exactly-once guarantee under all infrastructure failures.
- Anonymous test attempts remain intentional. To receive mail, visitors must save contact details after completion.

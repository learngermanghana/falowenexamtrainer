# Falowen sign-up duplicate-review checks

This change checks primary phone, Gmail mailbox aliases, and the combination of
full name + emergency phone **before** creating Firebase Authentication accounts.

- Repeated primary numbers (including Ghana 0xx vs +233xx) require an admissions review.
- Same Gmail inbox under a dot/plus alias requires review.
- Same full name plus emergency contact requires review.
- A shared emergency number **alone** never blocks registration.
- A shared name **alone** never blocks registration.
- Confirmed students enrolling in German and Kiswahili must use the existing
  additional-course flow rather than creating a new student identity.
- Neither match details nor student records are sent back to the applicant.
- A lookup failure or rate limit stops the signup; it is never interpreted as "clear."

The public endpoint is rate limited per application instance and returns only
generic guidance. This is abuse resistance, **not** a substitute for centralized
rate limiting or verification of phone ownership. Do not use it to reveal whether
a specific person or number has an account.

## Historical student data

Existing historical records need normalised identity fields to catch spaced phone
formats and Gmail aliases consistently. The following one-time script reads only
the students collection; it prints aggregate counts, never PII:

```sh
cd functions
node scripts/backfillSignupIdentity.js
node scripts/backfillSignupIdentity.js --apply
```

**Review the dry-run counts and use an authorized deployment environment before
running --apply.** It updates identity fields only; it does not merge students,
change payments, restart trials, or delete records. Investigate collisions in the
authorized Admin workspace rather than exposing match identities to applicants.

## Limitations / follow-up

This is a server-backed pre-registration check, not a fully atomic uniqueness
guarantee. Two concurrent signups can pass before either profile is saved,
and direct SDK writes not using this flow are not subject to this API check.
A later phase should move student account finalization to a trusted transactional
backend with verified primary phone ownership and an owner-only admissions
override. Profile phone/email edits should refresh the identity snapshots; the
backend compares current raw fields first to prevent stale snapshot false blocks.
The existing Firebase Auth email/password recovery remains unchanged.

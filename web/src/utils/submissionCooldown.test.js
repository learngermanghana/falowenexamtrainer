import { resolveSubmissionCooldownDeadline, SUBMISSION_COOLDOWN_MS } from "./submissionCooldown";

test("normal submissions expire ten minutes after submission, not after opening the page", () => {
  const now = 1_000_000;
  const deadline = resolveSubmissionCooldownDeadline({ submittedAtMs: now - 4 * 60 * 1000, now, assignmentKey: "A2-4.11", deadlines: new Map() });
  expect(deadline - now).toBe(6 * 60 * 1000);
});

test("a future timestamp cannot produce a 66-minute cooldown or restart on refresh", () => {
  const now = 1_000_000;
  const deadlines = new Map();
  const submittedAtMs = now + (56 * 60 + 17) * 1000;
  const args = { submittedAtMs, assignmentKey: "B1-6.18", deadlines };
  const deadline = resolveSubmissionCooldownDeadline({ ...args, now });
  expect(deadline - now).toBe(SUBMISSION_COOLDOWN_MS);
  expect(resolveSubmissionCooldownDeadline({ ...args, now: now + 60_000 }) - (now + 60_000)).toBe(9 * 60 * 1000);
  expect(resolveSubmissionCooldownDeadline({ ...args, now: deadline })).toBe(deadline);
});

test("new attempts have their own deadline and another assignment does not restart a wait", () => {
  const deadlines = new Map();
  const now = 1_000_000;
  const deadline = resolveSubmissionCooldownDeadline({ submittedAtMs: now, now, assignmentKey: "A1-9", deadlines });
  resolveSubmissionCooldownDeadline({ submittedAtMs: now, now: now + 1000, assignmentKey: "A2-8.21", deadlines });
  expect(resolveSubmissionCooldownDeadline({ submittedAtMs: now, now: now + 2000, assignmentKey: "A1-9", deadlines })).toBe(deadline);
  expect(resolveSubmissionCooldownDeadline({ submittedAtMs: now + 3000, now: now + 3000, assignmentKey: "A1-9", deadlines })).toBe(deadline + 3000);
});

test("old attempts are already expired and missing timestamps have no cooldown", () => {
  const now = 1_000_000;
  const args = { assignmentKey: "A1-9", deadlines: new Map(), now };
  expect(resolveSubmissionCooldownDeadline({ ...args, submittedAtMs: now - SUBMISSION_COOLDOWN_MS - 1 })).toBeLessThan(now);
  expect(resolveSubmissionCooldownDeadline({ ...args, submittedAtMs: NaN })).toBeNull();
});

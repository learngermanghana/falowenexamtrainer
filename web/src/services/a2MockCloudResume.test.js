import { startA2MockAttempt } from "./a2FinalMockService";
import { resumeA2MockSections } from "./a2MockCloudResume";

jest.mock("./a2FinalMockService", () => ({ startA2MockAttempt: jest.fn() }));
const keys = { lesen: "reading", hoeren: "listening", schreiben: "writing", sprechen: "speaking" };
const request = { keys, idToken: "test-token", mockId: "a2-mock-03" };
const submission = { startedAt: 10, submittedAt: 20, sms: "Hallo", email: "Guten Tag" };

beforeEach(() => localStorage.clear());

test("a fresh device opens the unfinished speaking part with submitted writing and verified receipts", async () => {
  const receipt = { sessionId: "part-one", assessment: { score: 6, maxScore: 8 } };
  startA2MockAttempt.mockResolvedValueOnce({
    resumed: true, attemptId: "attempt-3", attemptNumber: 1, firstAttempt: true,
    state: { stage: "sprechen", attemptStartedAtMs: 1, lesenCompletedAt: 2,
      hoerenCompletedAt: 3, schreibenSubmission: submission },
    examinerParts: { "1": receipt },
  });

  await expect(resumeA2MockSections(request)).resolves.toMatchObject({
    stage: "sprechen", startedAt: 1, attemptInfo: { attemptId: "attempt-3" },
  });
  expect(startA2MockAttempt).toHaveBeenCalledWith({
    idToken: "test-token", mockId: "a2-mock-03", resumeOnly: true,
  });
  expect(JSON.parse(localStorage.getItem(keys.schreiben))).toEqual(submission);
  expect(JSON.parse(localStorage.getItem(keys.sprechen))).toEqual({ _examinerParts: { "1": receipt } });
});

test("resume does not replace an existing local writing draft or partially restore other sections", async () => {
  localStorage.setItem(keys.schreiben, JSON.stringify({ sms: "Local draft" }));
  startA2MockAttempt.mockResolvedValueOnce({
    resumed: true, attemptId: "attempt-3",
    state: { stage: "sprechen", schreibenSubmission: submission },
  });
  await expect(resumeA2MockSections(request)).rejects.toThrow("This device already has answers");
  expect(localStorage.getItem(keys.lesen)).toBeNull();
  expect(JSON.parse(localStorage.getItem(keys.schreiben))).toEqual({ sms: "Local draft" });
});

"use strict";

const {
  oauthParameters, safeStudentAccess, scoreRowsForStudent,
  summarizeStudentAssignments, constants,
} = require("../chatgptCompanion");

const validRequest = {
  response_type: "code",
  client_id: constants.CLIENT_ID,
  redirect_uri: constants.CALLBACK,
  code_challenge: "a".repeat(43),
  code_challenge_method: "S256",
  scope: "falowen:read",
  resource: constants.RESOURCE,
  state: "state-token",
};

describe("Falowen ChatGPT authorization", () => {
  test("accepts exact ChatGPT public client and S256 PKCE", () => {
    expect(oauthParameters(validRequest)).toMatchObject({ client_id: constants.CLIENT_ID });
  });

  test.each([
    { client_id: "https://attacker.example/client.json" },
    { redirect_uri: "https://attacker.example/callback" },
    { redirect_uri: "https://chatgpt.com.evil.example/connector_platform_oauth_redirect" },
    { code_challenge_method: "plain" },
    { code_challenge: "short" },
    { scope: "profile" },
    { resource: "https://attacker.example/mcp" },
    { state: "" },
  ])("rejects modified parameters: %j", (change) => {
    expect(oauthParameters({ ...validRequest, ...change })).toBeNull();
  });

  test("never allows admin, exam-only or expired trial accounts", () => {
    expect(safeStudentAccess({ role: "admin", level: "A2" })).toBe(false);
    expect(safeStudentAccess({ role: "student", accountType: "exam_only" })).toBe(false);
    expect(safeStudentAccess({ role: "student", trialStatus: "expired", paymentStatus: "pending" })).toBe(false);
    expect(safeStudentAccess({ role: "student", trialStatus: "active" })).toBe(true);
  });
});

describe("Falowen ChatGPT read-only records", () => {
  const student = { id: "AB123", data: { studentCode: "AB123", level: "A2", name: "Test Learner" } };

  test("normalizes only score fields needed by the student", () => {
    const rows = scoreRowsForStudent([
      { studentcode: "AB123", name: "Test Learner", level: "A2", assignment_id: "A2-1.2", score: "75", comments: "Gut", date: "2026-10-31", secret: "never" },
      { level: "B1", score: 100, assignment_id: "B1-4.5" },
    ], "A2");
    expect(rows).toEqual([{
      assignmentId: "A2-1.2", assignment: "", score: 75, feedback: "Gut", date: "2026-10-31",
    }]);
  });

  test("distinguishes no grade from a confirmed unsubmitted assignment", () => {
    const progress = summarizeStudentAssignments(student, []);
    expect(progress.level).toBe("A2");
    expect(progress.totalTutorAssignments).toBeGreaterThan(0);
    expect(progress.noGradeRecorded).toBe(progress.totalTutorAssignments);
    expect(progress.clarification).toMatch(/does not prove/);
    expect(progress.assignments[0].submissionUrl).toContain("/campus/course/lesson/A2/");
  });

  test("reports a score when a canonical tutor assignment has been marked", () => {
    const original = summarizeStudentAssignments(student, []);
    const first = original.assignments[0];
    const progress = summarizeStudentAssignments(student, [
      { level: "A2", assignment_id: first.assignmentId, score: 92, comments: "Weiter so" },
    ]);
    expect(progress.assignments[0].status).toBe("passed");
    expect(progress.assignments[0].bestRecordedScore).toBe(92);
    expect(progress.passed).toBe(1);
  });
});

"use strict";

const fs = require("fs");
const path = require("path");
const {
  oauthParameters, safeStudentAccess, scoreRowsForStudent,
  summarizeStudentAssignments, lessonContentResponse, constants,
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

  test("B2 self-study student sees 28 lesson days, not missing grades", () => {
    const b2 = { id: "B2-001", data: { studentCode: "B2-001", level: "B2", name: "B2 Learner" } };
    const result = summarizeStudentAssignments(b2, []);
    expect(result.level).toBe("B2");
    expect(result.courseMode).toBe("self_study");
    expect(result.totalSelfStudyLessons).toBe(28);
    expect(result.totalTutorAssignments).toBe(0);
    expect(result.completedCount).toBeNull();
    expect(result.completionAvailable).toBe(false);
    expect(result.assignments[0]).toMatchObject({
      day: 1, status: "self_study", completionVerified: false,
      lessonUrl: expect.stringContaining("/campus/course/lesson/B2/1"),
    });
    expect(result.assignments[0].title).toMatch(/Umweltschutz/);
    expect(result.assignments.every((row) => !("bestRecordedScore" in row))).toBe(true);
  });

  test("C1 self-study is recognised and C2 is not incorrectly relabelled A1", () => {
    const c1 = summarizeStudentAssignments({ id: "C1", data: { level: "C1" } }, []);
    expect(c1.level).toBe("C1");
    expect(c1.courseMode).toBe("self_study");
    expect(c1.totalSelfStudyLessons).toBeGreaterThan(0);
    const c2 = summarizeStudentAssignments({ id: "C2", data: { level: "C2" } }, []);
    expect(c2.level).toBe("C2");
    expect(c2.totalTutorAssignments).toBe(0);
    expect(c2.clarification).toMatch(/not yet available/);
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

describe("ChatGPT OAuth static discovery", () => {
  test("the Vercel well-known discovery documents match the backend issuer and resource", () => {
    const root = path.resolve(__dirname, "../../..");
    const load = (name) => JSON.parse(fs.readFileSync(path.join(root, "web/public/.well-known", name), "utf8"));
    const server = load("oauth-authorization-server/api/chatgpt");
    const protectedResource = load("oauth-protected-resource/api/chatgpt/mcp");
    expect(server.issuer).toBe(constants.ISSUER);
    expect(server.authorization_endpoint).toBe(constants.ISSUER + "/authorize");
    expect(server.token_endpoint).toBe(constants.ISSUER + "/token");
    expect(server.client_id_metadata_document_supported).toBe(true);
    expect(protectedResource.resource).toBe(constants.RESOURCE);
    expect(protectedResource.authorization_servers).toEqual([constants.ISSUER]);
  });
});


describe("Canonical B2 Course Book material in ChatGPT", () => {
  test("B2 day 1 contains the actual reading text, vocabulary, grammar exercise and review", () => {
    const overview = lessonContentResponse("B2", 1, "overview");
    expect(overview.available).toBe(true);
    expect(overview.readingTitle).toBe("Müll vermeiden statt nur besser entsorgen");
    expect(overview.grammarExercise).toMatch(/drei Sätzen/);
    expect(overview.skillFocus).toBe("lesen");
    expect(overview.availableSections).toContain("reading");

    const vocabulary = lessonContentResponse("B2", 1, "vocabulary");
    expect(vocabulary.material).toEqual(expect.arrayContaining([
      expect.objectContaining({ expression: "Abfall vermeiden", meaning: "to prevent waste" }),
    ]));
    const grammar = lessonContentResponse("B2", 1, "grammar");
    expect(grammar.material.introduction).toMatch(/Stoffbeutel/);
    expect(grammar.material.sections[0].title).toMatch(/indem/);
    const reading = lessonContentResponse("B2", 1, "reading");
    expect(reading.material.paragraphs[0]).toMatch(/Papiertonne/);
    expect(reading.material.questions.length).toBeGreaterThan(2);
    const review = lessonContentResponse("B2", 1, "review");
    expect(review.material.length).toBeGreaterThan(1);
  });

  test("publishes 28 real B2 lessons; avoids inventing unavailable sections", () => {
    for (let day = 1; day <= 28; day += 1) {
      expect(lessonContentResponse("B2", day, "overview").available).toBe(true);
    }
    expect(lessonContentResponse("B2", 1, "writing").available).toBe(false);
    expect(lessonContentResponse("B2", 4, "writing").material.instructions.length).toBe(4);
    expect(lessonContentResponse("B2", 2, "listening").material.audioAvailableInCampus).toBe(true);
    expect(lessonContentResponse("C1", 1, "reading").available).toBe(false);
  });

  test("never exports graded answers, model solutions, teacher feedback or audio transcript", () => {
    const root = path.resolve(__dirname, "../../..");
    const raw = fs.readFileSync(path.join(root, "functions/data/chatgptLessonContent.generated.json"), "utf8");
    for (const forbidden of ['"answerIndex"', '"answer"', '"sampleAnswer"', '"sample"',
      '"starterTemplate"', '"transcript"', '"correctOption"', '"teacherNotes"']) {
      expect(raw).not.toContain(forbidden);
    }
    const reading = lessonContentResponse("B2", 1, "reading");
    expect(reading.material.questions[0]).toHaveProperty("options");
    expect(reading.material.questions[0]).not.toHaveProperty("answerIndex");
    expect(reading.material.questions[0]).not.toHaveProperty("explanation");
    expect(lessonContentResponse("B2", 2, "listening").material).not.toHaveProperty("transcript");
  });
});

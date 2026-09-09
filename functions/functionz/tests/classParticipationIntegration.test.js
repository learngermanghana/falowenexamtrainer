const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../../..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

describe("Class Participation integration", () => {
  test("student API is token-authenticated and never exposes presenter absence", () => {
    const route = read("functions/functionz/routes/classParticipation.js");
    expect(route).toContain("verifyIdToken");
    expect(route).toContain('loadRows(db, "studentUid", user.uid)');
    expect(route).toContain('loadRows(db, "studentEmailNormalized", email)');
    expect(route).not.toContain("presenterAbsent");
    expect(route).not.toContain("studentEmail:");
    expect(route).not.toContain("studentName:");
  });

  test("student API returns only learning-result question evidence", () => {
    const route = read("functions/functionz/routes/classParticipation.js");
    expect(route).toContain("safeQuestionResponses");
    expect(route).toContain('response?.result === "correct" || response?.result === "needs_review"');
    expect(route).toContain("questionResponses: safeQuestionResponses(data.questionResponses)");
    expect(route).not.toContain('result === "presenter_absent"');
  });

  test("Vercel API exposes only the authenticated student participation endpoint", () => {
    const api = read("api/index.js");
    expect(api).toContain('classParticipationMeHandler');
    expect(api).toContain('req.url === "/class-participation/me"');
  });

  test("student dashboard card is wired through the normal build patch", () => {
    const patch = read("scripts/patchClassParticipationCard.mjs");
    const hook = read("scripts/patchCourseCompletionSnapshotPersistence.mjs");
    const card = read("web/src/components/ClassParticipationCard.js");
    const service = read("web/src/services/classParticipationService.js");

    expect(patch).toContain('<ClassParticipationCard />');
    expect(hook).toContain('await import("./patchClassParticipationCard.mjs")');
    expect(card).toContain("Class Participation");
    expect(card).toContain("Your latest class question");
    expect(card).toContain("Needs review");
    expect(card).toContain("does not change your course grade or official attendance");
    expect(service).toContain('Authorization: `Bearer ${token}`');
    expect(service).toContain("questionResponses");
    expect(service).not.toContain("presenterAbsent");
  });
});

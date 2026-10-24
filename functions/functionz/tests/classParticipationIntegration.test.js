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

  test("student API returns only learning-result question evidence and recap guidance", () => {
    const route = read("functions/functionz/routes/classParticipation.js");
    expect(route).toContain("safeQuestionResponses");
    expect(route).toContain('response?.result === "correct" || response?.result === "needs_review"');
    expect(route).toContain("const questionResponses = safeQuestionResponses(data.questionResponses)");
    expect(route).toContain("conceptLabel: clean(response.conceptLabel)");
    expect(route).toContain("reviewConcepts");
    expect(route).toContain("focusConcept");
    expect(route).toContain("reviewRecommendation");
    expect(route).not.toContain('result === "presenter_absent"');
  });

  test("student API exposes canonical recap identity without conflating lesson and marking dates", () => {
    const route = read("functions/functionz/routes/classParticipation.js");
    expect(route).toContain("classSessionId: clean(data.classSessionId)");
    expect(route).toContain("sessionId: clean(data.sessionId)");
    expect(route).toContain("revision: revisionNumber(data.revision)");
    expect(route).toContain("sessionDate: toDateOnly(data.sessionDate)");
    expect(route).toContain("markedDate: toDateOnly(data.markedDate)");
    expect(route).toContain("updatedAt: toIso(data.updatedAt)");
    expect(route).not.toContain("sessionDate: toDateOnly(data.markedDate)");
  });

  test("student participation history is paginated deterministically before totals are calculated", () => {
    const route = read("functions/functionz/routes/classParticipation.js");
    expect(route).toContain("const PAGE_SIZE = 100");
    expect(route).toContain(".orderBy(admin.firestore.FieldPath.documentId())");
    expect(route).toContain("if (cursor) query = query.startAfter(cursor)");
    expect(route).toContain("if (snapshot.docs.length < PAGE_SIZE) break");
  });

  test("Vercel API exposes only the authenticated student participation endpoint", () => {
    const api = read("api/index.js");
    expect(api).toContain('classParticipationMeHandler');
    expect(api).toContain('req.url === "/class-participation/me"');
  });

  test("student dashboard uses canonical recap identity before participation metrics are calculated", () => {
    const patch = read("scripts/patchClassParticipationCard.mjs");
    const hook = read("scripts/patchCourseCompletionSnapshotPersistence.mjs");
    const card = read("web/src/components/ClassParticipationCard.js");
    const service = read("web/src/services/classParticipationService.js");

    expect(patch).toContain('<ClassParticipationCard />');
    expect(hook).toContain('await import("./patchClassParticipationCard.mjs")');
    expect(card).toContain("Class Participation");
    expect(card).toContain("QuestionHistory");
    expect(card).toContain("requestedClassSessionId");
    expect(card).toContain('params.get("classSessionId")');
    expect(card).toContain('params.get("sessionId")');
    expect(card).toContain("record.classSessionId === requestedClassSessionId");
    expect(card).toContain("record.sessionId === requestedSessionId");
    expect(card).toContain("<strong>Lesson:</strong>");
    expect(card).toContain("<strong>Recorded:</strong>");
    expect(card).toContain("does not change your course grade or official attendance");
    expect(service).toContain('Authorization: `Bearer ${token}`');
    expect(service).toContain("classSessionId");
    expect(service).toContain("markedDate");
    expect(service).toContain("deduplicateParticipationRecords");
    expect(service).toContain("candidate.revision > current.revision");
    expect(service).not.toContain("presenterAbsent");
  });
});

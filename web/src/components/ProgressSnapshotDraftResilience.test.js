import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(__dirname, "../../..");
const readRepoFile = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

describe("canonical progress snapshot and local draft resilience", () => {
  test("student progress hook persists the canonical snapshot", () => {
    const source = readRepoFile("web/src/hooks/useCourseCompletionProgress.js");
    expect(source).toContain('from "../services/courseCompletionSnapshotService"');
    expect(source).toContain("persistCourseCompletionSnapshot({");
    expect(source).toContain("progress,");
    expect(source).toContain("studentProfile,");
  });

  test("lifecycle keeps Course Book snapshot persistence enabled", () => {
    const lifecycle = readRepoFile("scripts/patchCanonicalCourseCompletionProgress.mjs");
    const snapshotPatch = readRepoFile("scripts/patchCourseCompletionSnapshotPersistence.mjs");
    expect(lifecycle).toContain('await import("./patchCourseCompletionSnapshotPersistence.mjs")');
    expect(snapshotPatch).toContain("persistCourseCompletionSnapshot({");
    expect(snapshotPatch).toContain("loadingLessonProgress");
  });

  test("submission lifecycle keeps device shadow drafts for first attempts and resubmissions", () => {
    const lifecycle = readRepoFile("scripts/patchWorkbookSubmissionAutoSelection.mjs");
    const source = readRepoFile("web/src/components/AssignmentSubmissionPage.js");

    expect(lifecycle).toContain('await import("./patchLocalSubmissionDraftResilience.mjs")');
    expect(source).toContain('from "../utils/submissionLocalDraftCache"');
    expect(source).toContain("selectedLocalSubmissionDraftKey");
    expect(source).toContain("selectedLocalResubmissionDraftKey");
    expect(source).toContain('status: "local_draft"');
    expect(source).toContain('status: "local_resubmission_draft"');
    expect(source).toContain("pickFreshestSubmissionDraft({ localDraft, cloudDraft })");
    expect(source).toContain("cloud sync pending");
  });

  test("successful final writes remove the local shadow draft", () => {
    const source = readRepoFile("web/src/components/AssignmentSubmissionPage.js");
    expect(source).toContain("clearSubmissionLocalDraft({ key: selectedLocalSubmissionDraftKey })");
    expect(source).toContain("clearSubmissionLocalDraft({ key: selectedLocalResubmissionDraftKey })");
  });

  test("Firestore rules make canonical snapshots student-owned and staff-readable", () => {
    const rules = readRepoFile("firestore.rules");
    expect(rules).toContain("match /courseCompletionSnapshots/{snapshotId}");
    expect(rules).toContain("allow create: if ownsStudentIncoming() || isStaff();");
    expect(rules).toContain("allow read: if ownsStudentResource() || isStaff();");
  });
});

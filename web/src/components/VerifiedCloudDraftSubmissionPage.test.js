import fs from "fs";
import path from "path";

describe("VerifiedCloudDraftSubmissionPage", () => {
  test("keeps the submission flow focused by excluding certificate readiness controls", () => {
    const source = fs.readFileSync(
      path.join(__dirname, "VerifiedCloudDraftSubmissionPage.js"),
      "utf8",
    );

    expect(source).not.toContain("Certificate readiness");
    expect(source).not.toContain("Keep this visible before every submission");
    expect(source).not.toContain("ExamReadinessBadge");
  });

  test("keeps the compact A1 first submission form, but restores the locked assignment page so failed work can resubmit", () => {
    const source = fs.readFileSync(
      path.join(__dirname, "VerifiedCloudDraftSubmissionPage.js"),
      "utf8",
    );

    expect(source).toContain("compact = false");
    expect(source).toContain('data-compact-locked-submission="true"');
    expect(source).toContain("<AssignmentSubmissionPage submissionContext={submissionContext} />");
    expect(source).not.toContain("✓ Already submitted — this assignment has already been sent to your tutor.");
    expect(source).toContain('compact ? "Your answers *" : "Your text *"');
    expect(source).toContain('compact ? "1fr" : "repeat(auto-fit, minmax(180px, 1fr))"');
    expect(source).toContain("if (!confirmed && !compact && !allowUnconfirmedSubmission)");
  });

  test("A1 canonical submissions opt into compact review mode", () => {
    const source = fs.readFileSync(
      path.join(__dirname, "A1CanonicalSubmissionPanel.jsx"),
      "utf8",
    );

    expect(source).toContain("<VerifiedCloudDraftSubmissionPage");
    expect(source).toContain("compact");
    expect(source).toContain("Review your answers below. You can edit them before submitting.");
    expect(source).toContain(">Progress</strong>");
    expect(source).not.toContain("Review stage — not submitted yet");
  });
  test("first A1 submission checks missing drafts and locks with Firestore owner queries", () => {
    const source = fs.readFileSync(path.join(__dirname, "VerifiedCloudDraftSubmissionPage.js"), "utf8");
    expect(source).toContain("findOwnedSubmissionDraft({ db, studentId: user.uid, draftId: draftDocId })");
    expect(source).toContain("findOwnedSubmissionLock({ db, studentId: user.uid, lockId: draftDocId })");
    expect(source).not.toContain("await getDoc(doc(db, LOCK_COLLECTION, draftDocId))");
    expect(source).not.toContain("await getDoc(doc(db, DRAFT_COLLECTION, draftDocId))");
    expect(source).not.toContain("const beforeSnapshot = await getDoc(draftRef);");
    // Verification after creating an owned document is still required.
    expect(source).toContain("const verifiedSnapshot = await getDoc(draftRef)");
    expect(source).toContain("const verifiedSubmission = await getDoc(submissionRef)");
    expect(source).toContain("const verifiedLock = await getDoc(lockRef)");
  });

});

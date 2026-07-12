import fs from "fs";
import path from "path";

const readSource = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A1 mobile workbook submission", () => {
  test("loads the A1 mobile submit stylesheet from the production entry point", () => {
    expect(readSource("index.js")).toContain('import "./a1WorkbookMobileSubmit.css";');
  });

  test("uses the same responsive two-column tab grid pattern as A2", () => {
    const css = readSource("a1WorkbookMobileSubmit.css");

    expect(css).toContain('[data-a1-workbook-submission-mount] [role="tablist"]');
    expect(css).toContain("grid-template-columns: repeat(2, minmax(0, 1fr)) !important;");
    expect(css).toContain('[data-a1-workbook-submission-mount] [role="tab"]');
    expect(css).toContain("width: 100% !important;");
    expect(css).toContain("min-width: 0 !important;");
  });

  test("keeps the submit textarea editable on Android and iPhone browsers", () => {
    const css = readSource("a1WorkbookMobileSubmit.css");

    expect(css).toContain("-webkit-appearance: none !important;");
    expect(css).toContain("-webkit-text-fill-color: #111827 !important;");
    expect(css).toContain("caret-color: #111827 !important;");
    expect(css).toContain("pointer-events: auto !important;");
    expect(css).toContain("touch-action: manipulation !important;");
    expect(css).toContain("textarea::placeholder");
    expect(css).toContain("textarea:focus");
  });

  test("prepares assignment context before mounting the mobile form", () => {
    const source = readSource("components/WorkbookInlineEnhancements.jsx");

    expect(source).toContain("isA1SubmissionContextReady");
    expect(source).toContain('nextSearch.set("assignmentKey", submissionAssignmentKey);');
    expect(source).toContain('nextSearch.set("assignmentId", submissionAssignmentKey);');
    expect(source).toContain('nextSearch.set("level", "A1");');
    expect(source).toContain("!submissionContextReady");
    expect(source).toContain('mountedNode.setAttribute("data-submit-context-ready", "true");');
  });

  test("built-in A1 workbooks use one React-owned draft and submission form", () => {
    const shellSource = readSource("components/A1TutorMarkedWorkbookShell.js");
    const source = readSource("components/VerifiedCloudDraftSubmissionPage.js");

    expect(shellSource).toContain('import VerifiedCloudDraftSubmissionPage from "./VerifiedCloudDraftSubmissionPage";');
    expect(shellSource).not.toContain("PersistentAssignmentSubmissionPage");
    expect(shellSource).toContain("submissionContextReady ? (");
    expect(shellSource).toContain("<VerifiedCloudDraftSubmissionPage");
    expect(shellSource).toContain('"12.3"');
    expect(source).toContain('data-cloud-draft-persistence": "react-owned"');
    expect(source).toContain("value={text}");
    expect(source).toContain("onChange={handleTextChange}");
    expect(source).toContain("setText(nextValue)");
    expect(source).not.toContain("setControlledTextareaValue");
    expect(source).not.toContain("MutationObserver");
    expect(source).not.toContain("onSnapshot(");
    expect(source).not.toContain("setInterval(");
  });

  test("automatically resolves a cloud conflict with the visible answer before final submit", () => {
    const shellSource = readSource("components/A1TutorMarkedWorkbookShell.js");

    expect(shellSource).toContain('data-auto-resolve-draft-conflicts="visible-version-on-submit"');
    expect(shellSource).toContain("onSubmitCapture={handleSubmissionCapture}");
    expect(shellSource).toContain('data-draft-conflict") === "true"');
    expect(shellSource).toContain('=== "keep this device version"');
    expect(shellSource).toContain('draftState === "saved"');
    expect(shellSource).toContain("form.requestSubmit");
    expect(shellSource).toContain("Draft conflict resolved automatically");
  });

  test("all injected A1 workbooks use the verified cloud form while A2 and B1 keep the existing form", () => {
    const source = readSource("components/CourseWorkbookSubmissionTabs.js");

    expect(source).toContain('import VerifiedCloudDraftSubmissionPage from "./VerifiedCloudDraftSubmissionPage";');
    expect(source).toContain(
      'const SubmissionPage = level === "A1" ? VerifiedCloudDraftSubmissionPage : AssignmentSubmissionPage;'
    );
    expect((source.match(/<SubmissionPage/g) || []).length).toBe(2);
  });

  test("writes deterministic Firestore drafts and verifies them by reading the exact document back", () => {
    const source = readSource("components/VerifiedCloudDraftSubmissionPage.js");

    expect(source).toContain('const DRAFT_COLLECTION = "submissionDrafts";');
    expect(source).toContain("const draftRef = doc(db, DRAFT_COLLECTION, draftDocId);");
    expect(source).toContain("await setDoc(draftRef, payload, { merge: true });");
    expect(source).toContain("const verifiedSnapshot = await getDoc(draftRef);");
    expect(source).toContain("Firestore write verification did not return the latest draft text");
    expect(source).toContain("userId: user.uid");
    expect(source).toContain("uid: user.uid");
    expect(source).toContain("ownerUid: user.uid");
    expect(source).not.toContain("localStorage");
  });

  test("refreshes clean devices from Firestore and protects competing unsaved text", () => {
    const source = readSource("components/VerifiedCloudDraftSubmissionPage.js");

    expect(source).toContain('window.addEventListener("focus", refreshFromCloud);');
    expect(source).toContain('document.addEventListener("visibilitychange", refreshFromCloud);');
    expect(source).toContain("document.activeElement === textareaRef.current");
    expect(source).toContain("remoteChangedSinceLoad");
    expect(source).toContain('state: "conflict"');
    expect(source).toContain("Load newest cloud draft");
    expect(source).toContain("Keep this device version");
    expect(source).toContain("Nothing has been overwritten");
  });

  test("always renders a visible final submit button beside Save draft in both A1 mount types", () => {
    const source = readSource("components/VerifiedCloudDraftSubmissionPage.js");
    const css = readSource("a1WorkbookMobileSubmit.css");

    expect(source).toContain("data-a1-submission-actions");
    expect(source).toContain("data-a1-final-submit-button");
    expect(source).toContain('type="submit"');
    expect(source).toContain("Submit assignment");
    expect(css).toContain("[data-a1-final-submit-button]");
    expect(css).toContain("[data-a1-built-in-submission] form [data-a1-submission-actions]");
    expect(css).toContain("[data-a1-built-in-submission] form [data-a1-final-submit-button]");
    expect(css).toContain("display: inline-flex !important;");
    expect(css).toContain("visibility: visible !important;");
  });

  test("saves and verifies the flat final submission path before locking", () => {
    const source = readSource("components/VerifiedCloudDraftSubmissionPage.js");

    expect(source).toContain('const SUBMISSION_COLLECTION = "submissions";');
    expect(source).toContain('const LOCK_COLLECTION = "submissionLocks";');
    expect(source).toContain("const submissionRef = doc(collection(db, SUBMISSION_COLLECTION));");
    expect(source).toContain("submissionPath");
    expect(source).toContain("await setDoc(submissionRef, payload);");
    expect(source).toContain("const verifiedSubmission = await getDoc(submissionRef);");
    expect(source).toContain('reviewStatus: "pending_review"');
    expect(source).toContain("await setDoc(lockRef, lockPayload, { merge: true });");
    expect(source).toContain("const verifiedLock = await getDoc(lockRef);");
    expect(source).toContain('source: "a1_react_owned_submission"');
  });

  test("shared diagnostics report draft conflicts, remote freshness and final submission verification", () => {
    const source = readSource("components/AssignmentSubmissionDebugPanel.js");

    expect(source).toContain("touchEvents");
    expect(source).toContain("beforeInputEvents");
    expect(source).toContain("computedPointerEvents");
    expect(source).toContain("elementAtTextareaCenter");
    expect(source).toContain("draftSaveState");
    expect(source).toContain("draftDocId");
    expect(source).toContain("draftCloudError");
    expect(source).toContain("draftWriteCount");
    expect(source).toContain("draftLocalDirty");
    expect(source).toContain("draftConflict");
    expect(source).toContain("draftRemoteUpdatedAt");
    expect(source).toContain("draftRemoteSource");
    expect(source).toContain("finalSubmissionState");
    expect(source).toContain("finalSubmissionId");
    expect(source).toContain("finalSubmissionPath");
    expect(source).toContain("finalSubmissionError");
  });
});

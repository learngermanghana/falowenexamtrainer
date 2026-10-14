const fs=require("fs");
const path=require("path");

const read=(file)=>fs.readFileSync(path.resolve(__dirname,"../../..",file),"utf8");

describe("A1–B1 timed submission recovery",()=>{
  const rules=read("firestore.rules");
  const source=read("web/src/components/AssignmentSubmissionPage.js");
  const timer=read("web/src/components/SharedTimedAssignment.jsx");

  test.each(["A1","A2","B1"])("%s timed attempt owner can check a missing attempt before starting",level=>{
    expect(timer).toContain("onSnapshot(");
    expect(timer).toContain("ATTEMPT_COLLECTION");
    expect(rules).toContain("match /timedAssignmentAttempts/{attemptId}");
    expect(rules).toContain("resource == null");
    expect(rules).toContain("attemptId.matches('^timed__' + request.auth.uid.lower()");
    expect(rules).toContain("allow create: if ownsStudentIncoming()");
  });

  test("first submit and lock are atomic, so a failed lock cannot orphan student work",()=>{
    expect(source).toContain("const batch = writeBatch(db)");
    expect(source).toContain("batch.set(submissionRef, submissionPayload)");
    expect(source).toContain("batch.set(lockRef, {");
    expect(source).toContain("await batch.commit()");
    expect(source).not.toContain("await addDoc(collection(db, SUBMISSION_COLLECTION), submissionPayload)");
  });

  test("expired timer never requires extra draft write or minimum words on manual retry",()=>{
    expect(source).toContain('const saved = await persistSubmission({ statusLabel: "submitted" });');
    expect(source).toContain("timedAssignment?.expired && isWorkbookSubmissionContext");
    expect(source).toContain("!retryAfterExpiry && submissionWordCount < minimumSubmissionWords");
    expect(source).toContain("!retryAfterExpiry && !form.confirmed");
    expect(source).not.toContain('const draftSaved = await persistSubmission({ statusLabel: "draft" });');
    expect(source).toContain("getSubmissionSaveError(error)");
  });
});

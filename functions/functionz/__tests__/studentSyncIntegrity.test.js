const fs = require("fs");
const path = require("path");

const {
  __testables: {
    collectMatchingRows,
    resolvePaidValue,
    resolveBalanceValue,
    normalizeHeader,
  },
} = require("../studentsSheet");

const readRepoFile = (...parts) =>
  fs.readFileSync(path.resolve(__dirname, "../../../", ...parts), "utf8");

describe("student sync integrity", () => {
  test("matches an existing sheet row by stable student identity", () => {
    const rows = collectMatchingRows({
      studentCodes: ["A1ABC123", "A1XYZ999"],
      uids: ["uid-1", "uid-2"],
      emails: ["first@example.com", "second@example.com"],
      targetStudentCode: "A1XYZ999",
      targetUid: "uid-2",
      targetEmail: "second@example.com",
    });

    expect(rows).toEqual([3]);
  });

  test("normalizes supported sheet headers without depending on column position", () => {
    expect(normalizeHeader("Student Code")).toBe("studentcode");
    expect(normalizeHeader("Payment_Status")).toBe("paymentstatus");
    expect(normalizeHeader("Trial Purge At")).toBe("trialpurgeat");
  });

  test("keeps trial signup unpaid with full tuition balance", () => {
    const trialStudent = {
      initialPaymentAmount: 0,
      tuitionFee: 3000,
      balanceDue: 3000,
      paymentStatus: "pending",
      trialStatus: "active",
    };

    expect(resolvePaidValue(trialStudent)).toBe(0);
    expect(resolveBalanceValue(trialStudent)).toBe(3000);
  });

  test("keeps exam-only billing blank and preserves an existing balance without tuition", () => {
    expect(resolvePaidValue({ accountType: "exam_only", paymentStatus: "pending" })).toBe("");
    expect(resolveBalanceValue({ accountType: "exam_only", tuitionFee: null })).toBe("");
    expect(resolveBalanceValue({ balanceDue: 1000, tuitionFee: null })).toBe(1000);
    expect(resolvePaidValue({ paymentStatus: "pending", initialPaymentAmount: 2000 })).toBe("");
  });

  test("uses confirmed paid amount and never lets balance exceed the derived balance", () => {
    expect(
      resolveBalanceValue({
        initialPaymentAmount: 2000,
        tuitionFee: 3000,
        balanceDue: 3000,
      })
    ).toBe(1000);

    expect(
      resolveBalanceValue({
        paidAmount: 3000,
        tuitionFee: 3000,
        balanceDue: 0,
      })
    ).toBe(0);
  });

  test("signup Firestore payload keeps the fields required by the sheet sync", () => {
    const auth = readRepoFile("web", "src", "context", "AuthContext.js");

    [
      "studentCode: studentId",
      "name: profile.name",
      "email: normalizedEmail",
      'level: universityInvitation?.level || (profile.level',
      'className: universityInvitation ? "" : profile.className',
      "phone: profile.phone",
      "location: profile.location",
      'courseType: "full_course"',
      "address: profile.address",
      "emergencyContactPhone: profile.emergencyContactPhone",
      "initialPaymentAmount: profile.initialPaymentAmount",
      "tuitionFee: profile.tuitionFee",
      "balanceDue: profile.balanceDue",
      'paymentStatus: universityInvitation ? "exempt_pending" : (profile.paymentStatus',
      "paymentIntentAmount: profile.paymentIntentAmount",
      'trialStatus: universityInvitation ? "not_applicable" : (profile.trialStatus',
      "trialStartedAt: Timestamp.fromDate(trialStartedDate)",
      "trialUsedAt: Timestamp.fromDate(trialStartedDate)",
      "trialEndsAt: Timestamp.fromDate(trialEndsDate)",
      "trialPurgeAt: Timestamp.fromDate(trialPurgeDate)",
    ].forEach((contract) => expect(auth).toContain(contract));
    // Instructor-verified university registrations never receive expiry timestamps.
    expect(auth).toContain("...(!universityInvitation ? {");
    expect(auth).toContain('institutionVerification: "pending"');
    expect(auth).toContain('accessType: "invitation_pending"');
  });

  test("backend derives and protects legacy active trials before stale-signup cleanup", () => {
    const index = readRepoFile("functions", "index.js");

    expect(index).toContain('normalizeValue(student.trialStatus) !== "active"');
    expect(index).toContain("startedAtMs + TRIAL_DURATION_MS");
    expect(index).toContain("if (Number.isFinite(getTrialEndMillis(student))) return false");
    expect(index).toContain("if (!student.trialEndsAt && expectedTrialEndIso) updates.trialEndsAt = expectedTrialEndIso");
  });

  test("payment intent alone is not treated as confirmed backend payment", () => {
    const index = readRepoFile("functions", "index.js");

    expect(index).toContain("const confirmedPaidFields = [student.paid, student.paidAmount]");
    expect(index).not.toContain("student.paidAmount, student.initialPaymentAmount");
  });

  test("confirmed trial payment conversion cannot remain eligible for future purge", () => {
    const paymentApp = readRepoFile("functions", "functionz", "paymentAwareApp.js");
    const index = readRepoFile("functions", "index.js");

    expect(paymentApp).toContain('trialStatus: "converted"');
    expect(paymentApp).toContain('trialRetentionStatus: "converted"');
    expect(paymentApp).toContain("trialPurgeAt: admin.firestore.FieldValue.delete()");
    expect(paymentApp).toContain("trialConvertedAt");
    expect(index).toContain('if (lifecycle.state === "converted")');
    expect(index).toContain("continue;");
  });

  test("Firestore student creation and updates both flow into the sheet upsert", () => {
    const index = readRepoFile("functions", "index.js");

    expect(index).toContain("exports.onStudentCreated = onDocumentCreated");
    expect(index).toContain('document: "students/{studentCode}"');
    expect(index).toContain("onStudentCreated -> sheet sync result");
    expect(index).toContain("exports.onStudentUpdated = onDocumentUpdated");
    expect(index).toContain("onStudentUpdated -> sheet sync result");

    const appenderCalls = index.match(/appendStudent: getStudentAppender\(\)/g) || [];
    expect(appenderCalls.length).toBeGreaterThanOrEqual(2);
  });

  test("sheet upsert maps the signup, trial, class and payment contract", () => {
    const sheet = readRepoFile("functions", "functionz", "studentsSheet.js");

    [
      "student.className ||",
      "student.paymentStatus ||",
      "student.trialStartedAt ||",
      "student.trialEndsAt ||",
      "student.trialPurgeAt ||",
      "student.trialConvertedAt ||",
      "student.courseType ||",
      "student.address ||",
      "student.emergencyContactPhone ||",
      "resolvePaidValue(student)",
      "resolveBalanceValue(student)",
    ].forEach((contract) => expect(sheet).toContain(contract));
  });
});

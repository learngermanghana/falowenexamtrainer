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
      "level: (profile.level",
      "className: profile.className",
      "phone: profile.phone",
      "location: profile.location",
      "learningMode: profile.learningMode",
      "address: profile.address",
      "emergencyContactPhone: profile.emergencyContactPhone",
      "initialPaymentAmount: profile.initialPaymentAmount",
      "tuitionFee: profile.tuitionFee",
      "balanceDue: profile.balanceDue",
      "paymentStatus: profile.paymentStatus",
      "paymentIntentAmount: profile.paymentIntentAmount",
      "trialStatus: profile.trialStatus",
      "trialStartedAt: serverTimestamp()",
    ].forEach((contract) => expect(auth).toContain(contract));
  });

  test("Firestore student creation and updates both flow into the sheet upsert", () => {
    const index = readRepoFile("functions", "index.js");

    expect(index).toContain("exports.onStudentCreated = onDocumentCreated");
    expect(index).toContain('document: "students/{studentCode}"');
    expect(index).toContain("onStudentCreated -> sheet sync result");
    expect(index).toContain("exports.onStudentUpdated = onDocumentUpdated");
    expect(index).toContain("onStudentUpdated -> sheet sync result");

    const appenderCalls = index.match(/getStudentAppender\(\)\(\{/g) || [];
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
      "student.learningMode ||",
      "student.address ||",
      "student.emergencyContactPhone ||",
      "resolvePaidValue(student)",
      "resolveBalanceValue(student)",
    ].forEach((contract) => expect(sheet).toContain(contract));
  });
});

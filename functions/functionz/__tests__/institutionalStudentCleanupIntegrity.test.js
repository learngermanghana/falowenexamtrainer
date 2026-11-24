const fs = require("fs");
const path = require("path");

describe("institutional Kiswahili retention safety", () => {
  test("all three learner cleanup paths skip the Hamburg university cohort", () => {
    const index = fs.readFileSync(path.resolve(__dirname, "../../index.js"), "utf8");
    expect(index).toContain('student.registrationSource === "university-invite"');
    expect(index).toContain('student.cohortId === "university-hamburg-kiswahili-a1"');
    expect(index).toContain('isInstitutionalKiswahiliStudent(student)) return { state: "not_trial" }');
    expect(index).toContain('isInstitutionalKiswahiliStudent(student) || hasStudentMadePayment(student)) return false');
    expect(index).toContain('isInstitutionalKiswahiliStudent(student)) continue');
  });
});

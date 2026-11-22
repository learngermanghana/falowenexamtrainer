import { suggestEmailCorrection } from "./signupEmailHints";

describe("privacy-preserving email typo hints", () => {
  it("suggests known typos without modifying unfamiliar email domains", () => {
    expect(suggestEmailCorrection(" student@gmial.com ")).toBe("student@gmail.com");
    expect(suggestEmailCorrection("Ama@GMAIL.CON")).toBe("Ama@gmail.com");
    expect(suggestEmailCorrection("student@university.edu")).toBe("");
    expect(suggestEmailCorrection("student@gmail.com")).toBe("");
    expect(suggestEmailCorrection("not-an-email")).toBe("");
  });
});

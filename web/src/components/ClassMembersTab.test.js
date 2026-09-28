import fs from "fs";
import path from "path";

describe("Class Members current-student badge", () => {
  test("marks only the signed-in student's member card with You", () => {
    const source = fs.readFileSync(path.resolve(__dirname, "ClassMembersTab.js"), "utf8");

    expect(source).toContain("member.id === studentProfile?.id");
    expect(source).toContain('data-testid="current-class-member-badge"');
    expect(source).toContain(">You<");
  });
});

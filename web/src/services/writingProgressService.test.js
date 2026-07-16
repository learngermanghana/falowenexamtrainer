import { __TESTING__ } from "./writingProgressService";

describe("writingProgressService workspace identity", () => {
  test("preserves the legacy document ID when no workspace is supplied", () => {
    expect(
      __TESTING__.buildDocId({
        userId: "User-1",
        studentCode: "LLEA-001",
        mode: "course",
      }),
    ).toBe("llea-001__course");
  });

  test("isolates informal and formal letter drafts for the same student", () => {
    const informal = __TESTING__.buildDocId({
      userId: "User-1",
      studentCode: "LLEA-001",
      mode: "course",
      workspaceKey: "A1-12.3-teil-1-informal-letter",
    });
    const formal = __TESTING__.buildDocId({
      userId: "User-1",
      studentCode: "LLEA-001",
      mode: "course",
      workspaceKey: "A1-12.3-teil-2-formal-letter",
    });

    expect(informal).toBe(
      "llea-001__course__a1-12.3-teil-1-informal-letter",
    );
    expect(formal).toBe(
      "llea-001__course__a1-12.3-teil-2-formal-letter",
    );
    expect(informal).not.toBe(formal);
  });

  test("sanitizes workspace keys before using them in Firebase document IDs", () => {
    expect(__TESTING__.normalizeWorkspaceKey(" Formal Letter / Teil 2 ")).toBe(
      "formal-letter-teil-2",
    );
  });
});

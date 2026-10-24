import {
  A2_FORMAL_LETTER_TEMPLATE,
  A2_INFORMAL_LETTER_TEMPLATE,
  __TESTING__,
} from "./A2WritingWorkspaceSupport";

describe("A2WritingWorkspaceSupport", () => {
  test("provides separate formal and informal templates", () => {
    expect(A2_FORMAL_LETTER_TEMPLATE).toContain("Sehr geehrte Damen und Herren");
    expect(A2_FORMAL_LETTER_TEMPLATE).toContain("Mit freundlichen Grüßen");
    expect(A2_INFORMAL_LETTER_TEMPLATE).toContain("wie geht es dir?");
    expect(A2_INFORMAL_LETTER_TEMPLATE).toContain("Viele Grüße");
  });

  test("keeps the A2 planning prompt suitable for English notes", () => {
    expect(__TESTING__.pointsPlaceholder).toContain("English is okay here");
    expect(__TESTING__.LETTER_TYPES.map((item) => item.key)).toEqual(["informal", "formal"]);
  });
});

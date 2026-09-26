import { getA1Assignment } from "../data/a1AssignmentRegistry";
import { getA1TutorDraftProfile } from "../data/a1TutorDraftProfiles";
import { getA1GrammarNotesComponent } from "./A1WorkbookGrammarNotes";
import TwoCasePrepositionsPageLegacy from "./TwoCasePrepositionsPageLegacy";
import { DativeArticlesMitBeiZuGrammarNotes } from "./DativeArticlesMitBeiZuPage";

describe("A1 Day 18 tutor-marked workbook ownership", () => {
  test.each([
    ["A1-12.1", "12.1"],
    ["A1-12.2", "12.2"],
  ])("%s remains a canonical Day 18 tutor-marked assignment", (assignmentKey, chapter) => {
    const assignment = getA1Assignment(assignmentKey);
    const draftProfile = getA1TutorDraftProfile(assignmentKey);

    expect(assignment).toEqual(
      expect.objectContaining({
        assignmentKey,
        day: 18,
        chapter,
        layoutMode: "native",
      }),
    );
    expect(assignment.sections.map(({ key }) => key)).toEqual(["teil-1", "teil-2", "teil-3"]);
    expect(Object.keys(draftProfile.sections)).toEqual(["teil-1", "teil-2", "teil-3"]);
  });

  test("Kapitel 12.1 Grammar stays embedded through the canonical grammar component", () => {
    expect(getA1GrammarNotesComponent("A1-12.1")).toBe(TwoCasePrepositionsPageLegacy);
  });

  test("Kapitel 12.2 Grammar stays embedded through the canonical grammar component", () => {
    expect(getA1GrammarNotesComponent("A1-12.2")).toBe(DativeArticlesMitBeiZuGrammarNotes);
  });
});

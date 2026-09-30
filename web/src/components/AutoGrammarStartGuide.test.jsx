import { __TESTING__ } from "./AutoGrammarStartGuide";

describe("AutoGrammarStartGuide", () => {
  test("does not render a grammar supporting-materials guide on workbook routes", () => {
    expect(
      __TESTING__.resolveGrammarMatch(
        "/campus/course/a2-day-25-tagesablauf-workbook",
        "?assignmentKey=A2-9.25&assignmentId=A2-9.25&level=A2",
      ),
    ).toBeNull();
  });
});

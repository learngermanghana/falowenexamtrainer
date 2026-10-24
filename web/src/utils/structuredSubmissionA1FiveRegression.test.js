import {
  buildStructuredSubmissionTemplate,
  getStructuredSubmissionProfile,
} from "./structuredSubmissionTemplate";

describe("A1-5 production structured submission regression", () => {
  test("German Cases opens one box with all three canonical TEIL headings", () => {
    const profile = getStructuredSubmissionProfile({
      level: "A1",
      day: 9,
      chapter: "5",
      assignmentKey: "A1-5",
    });

    expect(profile).not.toBeNull();
    expect(profile.parts.map((part) => part.partId)).toEqual(["teil1", "teil2", "teil3"]);
    expect(buildStructuredSubmissionTemplate(profile)).toBe("TEIL 1\n\nTEIL 2\n\nTEIL 3");
  });
});

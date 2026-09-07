import {
  buildStructuredSubmissionTemplate,
  formatMissingStructuredParts,
  getStructuredAnswerText,
  getStructuredSubmissionProfile,
  parseStructuredSubmissionText,
} from "./structuredSubmissionTemplate";

describe("structured submission templates", () => {
  test("uses canonical A1 section ownership instead of a fixed level-wide count", () => {
    expect(getStructuredSubmissionProfile({ level: "A1", assignmentKey: "A1-0.1" }).parts.map((part) => part.partId))
      .toEqual(["teil1", "teil2"]);
    expect(getStructuredSubmissionProfile({ level: "A1", assignmentKey: "A1-1.2" }).parts.map((part) => part.partId))
      .toEqual(["teil1", "teil2", "teil3"]);
    expect(getStructuredSubmissionProfile({ level: "A1", assignmentKey: "A1-0.2" }).parts.map((part) => part.partId))
      .toEqual(["teil1", "teil3"]);
  });

  test("does not turn an A1 vocabulary reminder into a required submission part", () => {
    expect(getStructuredSubmissionProfile({ level: "A1", assignmentKey: "A1-8" }).parts.map((part) => part.partId))
      .toEqual(["teil1", "teil2", "teil3"]);
    expect(getStructuredSubmissionProfile({ level: "A1", assignmentKey: "A1-9" }).parts.map((part) => part.partId))
      .toEqual(["teil1", "teil2", "teil3", "teil4"]);
  });

  test("A2 and B1 default to Teil 2, Teil 3 and submitted Teil 4", () => {
    expect(getStructuredSubmissionProfile({ level: "A2", day: 15, assignmentKey: "A2-6.15" }).parts.map((part) => part.partId))
      .toEqual(["teil2", "teil3", "teil4"]);
    expect(getStructuredSubmissionProfile({ level: "B1", day: 9, assignmentKey: "B1-3.9" }).parts.map((part) => part.partId))
      .toEqual(["teil2", "teil3", "teil4"]);
  });

  test("A2 omits Teil 4 when it is absent or self-check only", () => {
    expect(getStructuredSubmissionProfile({ level: "A2", day: 14, assignmentKey: "A2-5.14" }).parts.map((part) => part.partId))
      .toEqual(["teil2", "teil3"]);
    expect(getStructuredSubmissionProfile({ level: "A2", day: 22, assignmentKey: "A2-8.22" }).parts.map((part) => part.partId))
      .toEqual(["teil2", "teil3"]);
    expect(getStructuredSubmissionProfile({ level: "A2", day: 25, assignmentKey: "A2-9.25" }).parts.map((part) => part.partId))
      .toEqual(["teil2", "teil3", "teil4"]);
  });

  test("builds one textarea template and parses answers under the protected headings", () => {
    const profile = getStructuredSubmissionProfile({ level: "A2", day: 15, assignmentKey: "A2-6.15" });
    expect(buildStructuredSubmissionTemplate(profile)).toBe("TEIL 2\n\nTEIL 3\n\nTEIL 4");

    const parsed = parseStructuredSubmissionText(
      "TEIL 2\nHallo Anna, ich schreibe dir heute.\n\nTEIL 3\n1. B\n2. C\n\nTEIL 4\n1. A\n2. B",
      profile,
    );

    expect(parsed.complete).toBe(true);
    expect(parsed.sections).toEqual({
      teil2: "Hallo Anna, ich schreibe dir heute.",
      teil3: "1. B\n2. C",
      teil4: "1. A\n2. B",
    });
    expect(getStructuredAnswerText(parsed)).not.toContain("TEIL 2");
  });

  test("reports deleted headings and unanswered required Teile before submission", () => {
    const profile = getStructuredSubmissionProfile({ level: "A2", day: 15, assignmentKey: "A2-6.15" });
    const parsed = parseStructuredSubmissionText(
      "TEIL 2\nHallo.\n\nTEIL 3\n",
      profile,
    );

    expect(parsed.complete).toBe(false);
    expect(parsed.unansweredParts).toContain("teil3");
    expect(parsed.missingHeadings).toContain("teil4");
    expect(formatMissingStructuredParts(["teil3", "teil4"])).toBe("Teil 3, Teil 4");
  });
});

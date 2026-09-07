import {
  buildStructuredSubmissionTemplate,
  buildStructuredSubmissionTextFromSections,
  compareStructuredSubmissionSections,
  formatMissingStructuredParts,
  getStructuredAnswerText,
  getStructuredSubmissionProfile,
  parseStructuredSubmissionText,
  resolveStructuredResubmissionSeed,
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

  test("preloads stored structured sections into one canonical resubmission box", () => {
    const profile = getStructuredSubmissionProfile({ level: "A2", day: 15, assignmentKey: "A2-6.15" });
    const seed = resolveStructuredResubmissionSeed({
      profile,
      structuredSections: {
        teil4: "1. A\n2. B",
        teil2: "Hallo Anna.",
        teil3: "1. B\n2. C",
      },
      submissionText: "legacy text should not win",
    });

    expect(seed.mode).toBe("structured");
    expect(seed.source).toBe("structuredSections");
    expect(seed.text).toBe(
      "TEIL 2\nHallo Anna.\n\nTEIL 3\n1. B\n2. C\n\nTEIL 4\n1. A\n2. B",
    );
  });

  test("converts historical submissions only when canonical headings are complete and exact", () => {
    const profile = getStructuredSubmissionProfile({ level: "B1", day: 9, assignmentKey: "B1-3.9" });
    const safeHistorical = resolveStructuredResubmissionSeed({
      profile,
      submissionText: "Teil 2\nBrieftext\n\nTeil 3\n1. B\n2. C\n\nTeil 4\n1. A\n2. B",
    });
    expect(safeHistorical.mode).toBe("structured");
    expect(safeHistorical.source).toBe("historicalHeadings");

    const ambiguousHistorical = resolveStructuredResubmissionSeed({
      profile,
      submissionText: "1. B\n2. C\nHallo, hier ist mein Brief ohne klare Teil-Überschriften.",
    });
    expect(ambiguousHistorical.mode).toBe("legacy");
    expect(ambiguousHistorical.confident).toBe(false);
  });

  test("detects changes per Teil and allows correct sections to remain unchanged", () => {
    const previous = {
      teil2: "Hallo Anna.",
      teil3: "1. B\n2. C",
      teil4: "1. A\n2. B",
    };
    const current = {
      ...previous,
      teil3: "1. B\n2. A",
    };
    const diff = compareStructuredSubmissionSections(previous, current, ["teil2", "teil3", "teil4"]);
    expect(diff.changedParts).toEqual(["teil3"]);
    expect(diff.unchangedParts).toEqual(["teil2", "teil4"]);
    expect(diff.hasChanges).toBe(true);

    expect(compareStructuredSubmissionSections(previous, previous, ["teil2", "teil3", "teil4"]).hasChanges).toBe(false);
  });

  test("rebuilds structured text in canonical profile order", () => {
    const profile = getStructuredSubmissionProfile({ level: "A1", assignmentKey: "A1-0.2" });
    expect(buildStructuredSubmissionTextFromSections(profile, { teil3: "1. B", teil1: "1. Guten Tag" }))
      .toBe("TEIL 1\n1. Guten Tag\n\nTEIL 3\n1. B");
  });
});

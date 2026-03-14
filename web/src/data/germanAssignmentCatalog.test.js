import {
  getAssignmentDictionaryEntry,
  getAssignmentDisplayTitle,
  getAssignmentDisplayType,
  getAssignmentSequenceForLevel,
  getValidProgressionIdentifiersForLevel,
} from "./germanAssignmentCatalog";

describe("getAssignmentDictionaryEntry", () => {
  test("resolves A1 day 2 1.1 reading/listening assignment", () => {
    const entry = getAssignmentDictionaryEntry({
      level: "A1",
      assignmentId: "A1-1.1",
      mode: "Lesen & Hören",
      assignmentDay: 2,
    });

    expect(entry).toMatchObject({
      assignment_id: "A1-1.1",
      chapter: "1.1",
      mode: "Lesen & Hören",
      assignment: true,
      assignmentDay: 2,
    });
  });

  test("keeps A1 day 3 1.1 writing/speaking as practical-only", () => {
    const entry = getAssignmentDictionaryEntry({
      level: "A1",
      assignmentId: "A1-1.1",
      mode: "Schreiben & Sprechen",
      assignmentDay: 3,
    });

    expect(entry).toMatchObject({
      chapter: "1.1",
      mode: "Schreiben & Sprechen",
      assignment: false,
    });
  });

  test("adds A1 12.3 real assignment on day 20", () => {
    const entry = getAssignmentDictionaryEntry({
      level: "A1",
      assignmentId: "A1-12.3",
      assignmentDay: 20,
    });

    expect(entry).toMatchObject({
      assignment_id: "A1-12.3",
      chapter: "12.3",
      assignment: true,
      assignmentDay: 20,
      mode: "Schreiben & Sprechen",
      grammar_topic: "Formal and Informal Letter",
    });
    expect(entry.schreiben_sprechen).toMatchObject({
      video: "https://youtu.be/2iJQFYGUqRE",
      workbook_link:
        "https://www.falowen.app/campus/course/letter-writing-intro-german-a1-day-12-3",
    });
  });
});

describe("assignment display helpers", () => {
  test("resolves title + mode", () => {
    const entry = getAssignmentDictionaryEntry({ level: "A2", assignmentId: "A2-3.7" });
    expect(getAssignmentDisplayTitle(entry, { preferEnglish: true })).toBe("Looking for an Apartment");
    expect(getAssignmentDisplayType(entry)).toBe("Lesen & Hören");
  });
});

describe("progression sequence", () => {
  test("A1 progression includes real marked items and excludes practical-only ids", () => {
    const a1Progression = getAssignmentSequenceForLevel("A1", { includePractical: false }).map(
      (entry) => entry.assignment_id
    );

    expect(a1Progression).toEqual(
      expect.arrayContaining([
        "A1-0.1",
        "A1-0.2",
        "A1-1.1",
        "A1-1.2",
        "A1-2",
        "A1-12.1",
        "A1-12.2",
        "A1-12.3",
        "A1-14.1",
      ])
    );
    expect(a1Progression).not.toContain("A1-1");
    expect(a1Progression).not.toContain("A1-5.9");
  });

  test("valid progression identifier set does not include bogus identifiers", () => {
    const valid = getValidProgressionIdentifiersForLevel("A1");
    expect(valid.has("A1-1")).toBe(false);
    expect(valid.has("A1-12.3")).toBe(true);
  });
});

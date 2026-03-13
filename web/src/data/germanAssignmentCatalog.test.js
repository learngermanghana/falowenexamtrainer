import {
  getAssignmentDictionaryEntry,
  getAssignmentDisplayTitle,
  getAssignmentDisplayType,
} from "./germanAssignmentCatalog";

describe("getAssignmentDictionaryEntry", () => {
  test("adds assignment metadata and assignmentDay", () => {
    const entry = getAssignmentDictionaryEntry({ level: "A1", assignmentId: "A1-3" });

    expect(entry).toMatchObject({
      topic: "Asking About Prices and Preferences",
      assignment: true,
      assignmentDay: 7,
    });
  });

  test("resolves by chapter and provides assignmentDay for day-accurate labels", () => {
    const entry = getAssignmentDictionaryEntry({ level: "A1", chapter: "2" });

    expect(entry).toMatchObject({
      topic: "Numbers and Addresses",
      assignment: true,
      assignmentDay: 4,
    });
  });

  test("marks A2 and B1 catalog chapters as assignments", () => {
    const a2Entry = getAssignmentDictionaryEntry({ level: "A2", assignmentId: "A2-3.7" });
    const b1Entry = getAssignmentDictionaryEntry({ level: "B1", assignmentId: "B1-6.19" });

    expect(a2Entry).toMatchObject({ assignment: true });
    expect(b1Entry).toMatchObject({ assignment: true });
  });

});


describe("assignment display helpers", () => {
  test("prefers topic for A1 entries", () => {
    const entry = getAssignmentDictionaryEntry({ level: "A1", assignmentId: "A1-0.1" });
    expect(getAssignmentDisplayTitle(entry, { preferEnglish: true })).toBe("Greetings and Asking About Well-being");
  });

  test("resolves A2/B1 display title and type consistently", () => {
    const entry = getAssignmentDictionaryEntry({ level: "A2", assignmentId: "A2-3.7" });
    expect(getAssignmentDisplayTitle(entry, { preferEnglish: true })).toBe("Looking for an Apartment");
    expect(getAssignmentDisplayType(entry)).toBe("Eine Wohnung suchen");
  });
});

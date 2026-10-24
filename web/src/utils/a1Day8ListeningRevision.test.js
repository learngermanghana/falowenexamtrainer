import { buildA1WorkbookSubmissionText, readA1WorkbookDraft, saveA1WorkbookDraft } from "./a1WorkbookDraft";

test("Day 8 version appears only on the new listening submission, not the other parts", () => {
  const assignment = {
    assignmentKey: "A1-4",
    sections: [
      { key: "teil-1", number: 1 },
      { key: "teil-2", number: 2 },
      { key: "teil-3", number: 3 },
    ],
  };
  const draft = { assignmentKey: "A1-4", sections: {
    "teil-1": { answers: { 1: "Ich komme aus Deutschland." } },
    "teil-2": { answers: { 1: "C" } },
    "teil-3": { answers: { 1: "A", 2: "B" } },
  }};
  const serialized = buildA1WorkbookSubmissionText({ assignment, draft });
  expect(serialized).toContain("TEIL 3\nA1-4-LISTENING-V2\n1. A\n2. B");
  expect(serialized).toContain("TEIL 2\n1. C");
  expect(serialized.match(/A1-4-LISTENING-V2/g)).toHaveLength(1);
});

test("a saved old Day 8 draft clears old listening choices without deleting translation or reading", () => {
  const key = "A1-4";
  window.localStorage.setItem("falowen:a1:workbook-draft:v1:A1-4", JSON.stringify({
    assignmentKey: key,
    sections: {
      "teil-1": { answers: { 1: "Deutsch" } },
      "teil-2": { answers: { 1: "C" } },
      "teil-3": { answers: { 1: "C", 5: "Nach Spanien" } },
    },
  }));
  const draft = readA1WorkbookDraft(key);
  expect(draft.sections["teil-1"].answers[1]).toBe("Deutsch");
  expect(draft.sections["teil-2"].answers[1]).toBe("C");
  expect(draft.sections["teil-3"]).toBeUndefined();
  const latest = saveA1WorkbookDraft({ assignmentKey: key, sections: draft.sections });
  expect(latest.readingRevision).toBe("a1-4-listening-v2");
  window.localStorage.removeItem("falowen:a1:workbook-draft:v1:A1-4");
});

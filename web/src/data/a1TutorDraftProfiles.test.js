import { A1_ASSIGNMENT_ORDER, getA1Assignment } from "./a1AssignmentRegistry";
import {
  A1_TUTOR_DRAFT_PROFILES,
  getA1TutorDraftProgress,
  getA1TutorDraftProfile,
  validateA1TutorDraftSubmissionSections,
} from "./a1TutorDraftProfiles";

const makeSerializedSections = (definition = {}) => new Map(
  Object.entries(definition).map(([key, lines]) => [key, lines]),
);

test("defines shared draft capture for every tutor-marked A1 assignment except page-owned A1-3", () => {
  const expected = A1_ASSIGNMENT_ORDER.filter((key) => key !== "A1-3");
  expect(Object.keys(A1_TUTOR_DRAFT_PROFILES)).toEqual(expected);
  expected.forEach((key) => expect(getA1TutorDraftProfile(key)).toBeTruthy());
  expect(getA1TutorDraftProfile("A1-3")).toBeNull();
});

test("models A1-14.1 Health as choice + existing letter + ten short vocabulary answers", () => {
  const health = getA1TutorDraftProfile("A1-14.1");
  expect(health.sections["teil-1"].items).toHaveLength(5);
  expect(health.sections["teil-1"].items[0]).toEqual(expect.objectContaining({
    type: "choice",
    choices: ["Anzeige A", "Anzeige B"],
  }));
  expect(health.sections["teil-2"].embeddedWriting).toBe(true);
  expect(health.sections["teil-3"].items).toHaveLength(10);
  expect(health.sections["teil-3"].items.every(({ type }) => type === "short")).toBe(true);
});

test("supports mixed question types in one Teil", () => {
  const countries = getA1TutorDraftProfile("A1-4");
  expect(countries.sections["teil-3"].items.slice(0, 4).every(({ type }) => type === "choice")).toBe(true);
  expect(countries.sections["teil-3"].items[4]).toEqual(expect.objectContaining({ number: 5, type: "short" }));

  const dative = getA1TutorDraftProfile("A1-12.2");
  expect(dative.sections["teil-1"].items.slice(0, 4).every(({ type }) => type === "short")).toBe(true);
  expect(dative.sections["teil-1"].items[4]).toEqual(expect.objectContaining({
    number: 5,
    type: "choice",
    choices: ["A", "B"],
  }));
});

test("treats the Day 1 reading text as study material and requires the ten questions only", () => {
  const profile = getA1TutorDraftProfile("A1-0.1");
  expect(profile.sections["teil-1"]).toEqual(expect.objectContaining({ readOnly: true, required: false }));
  expect(profile.sections["teil-2"].items).toHaveLength(10);
});

test("aligns A1-9 Negation to the three rendered assessed Teile", () => {
  expect(getA1Assignment("A1-9").sections.map(({ key }) => key)).toEqual(["teil-1", "teil-2", "teil-3"]);
  expect(Object.keys(getA1TutorDraftProfile("A1-9").sections)).toEqual(["teil-1", "teil-2", "teil-3"]);
});

test("reports incomplete Health workbook until reading, letter and vocabulary are complete", () => {
  const partial = {
    sections: {
      "teil-1": { answers: { 1: "Anzeige A", 2: "Anzeige B" } },
      "teil-2": { text: "Lieber Felix, ich bin krank und kann leider nicht kommen." },
      "teil-3": { answers: { 1: "der Kopf" } },
    },
  };
  expect(getA1TutorDraftProgress({ assignmentKey: "A1-14.1", draft: partial })).toEqual(
    expect.objectContaining({ complete: false, completed: 4, total: 16 }),
  );

  const complete = {
    sections: {
      "teil-1": { answers: Object.fromEntries(Array.from({ length: 5 }, (_, i) => [i + 1, "Anzeige A"])) },
      "teil-2": { text: "Lieber Felix, ich bin krank und kann leider nicht kommen. Können wir uns nächste Woche treffen?" },
      "teil-3": { answers: Object.fromEntries(Array.from({ length: 10 }, (_, i) => [i + 1, `Wort ${i + 1}`])) },
    },
  };
  expect(getA1TutorDraftProgress({ assignmentKey: "A1-14.1", draft: complete })).toEqual(
    expect.objectContaining({ complete: true, completed: 16, total: 16 }),
  );
});

test("blocks serialized final submission when a profiled required answer is missing", () => {
  const incomplete = makeSerializedSections({
    "teil-1": ["1. A", "2. B", "3. C", "4. D", "5. A"],
    "teil-2": ["1. Richtig", "2. Falsch", "3. Richtig", "4. Falsch"],
    "teil-3": ["1. A", "2. B", "3. C", "4. D", "5. A"],
  });
  const result = validateA1TutorDraftSubmissionSections({ assignmentKey: "A1-8", sections: incomplete });
  expect(result.ok).toBe(false);
  expect(result.message).toContain("Teil 2 answers 5");

  const complete = makeSerializedSections({
    "teil-1": ["1. A", "2. B", "3. C", "4. D", "5. A"],
    "teil-2": ["1. Richtig", "2. Falsch", "3. Richtig", "4. Falsch", "5. Richtig"],
    "teil-3": ["1. A", "2. B", "3. C", "4. D", "5. A"],
  });
  expect(validateA1TutorDraftSubmissionSections({ assignmentKey: "A1-8", sections: complete })).toEqual({ ok: true, message: "" });
});

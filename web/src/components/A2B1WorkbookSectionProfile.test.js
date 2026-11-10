import {
  STANDARD_WORKBOOK_TABS,
  getWorkbookTabsWithLegacyGrammar,
} from "./StandardWorkbookComponents";
import {
  getA2B1WorkbookIncludedSectionLabels,
  getA2B1WorkbookSectionProfile,
  validateA2B1WorkbookSubmissionSections,
} from "./a2B1WorkbookSectionProfile";

const tabsFor = (ariaLabel) =>
  getWorkbookTabsWithLegacyGrammar({
    tabs: STANDARD_WORKBOOK_TABS,
    ariaLabel,
  }).tabs;

const tabKeysFor = (ariaLabel) => tabsFor(ariaLabel).map((tab) => tab.key);

describe("A2/B1 workbook section profiles", () => {
  test("A2 Day 14 omits Teil 4 while keeping Grammar", () => {
    const profile = getA2B1WorkbookSectionProfile("A2", 14);
    const tabs = tabKeysFor("A2 Day 14 workbook sections");

    expect(profile.listening).toBe(false);
    expect(profile.part4).toBeNull();
    expect(profile.part4Submission).toBe("none");
    expect(profile.grammar).toBe(true);
    expect(tabs).toContain("grammar");
    expect(tabs).not.toContain("hoeren");
  });

  test("A2 Day 25 follows its canonical no-listening lesson data", () => {
    const profile = getA2B1WorkbookSectionProfile("A2", 25);
    const tabs = tabKeysFor("A2 Day 25 workbook sections");

    expect(profile.listening).toBe(false);
    expect(profile.part4).toBeNull();
    expect(profile.part4Submission).toBe("none");
    expect(tabs).not.toContain("hoeren");
    expect(tabs).toEqual(expect.arrayContaining(["grammar", "sprechen", "lesen", "references", "submit"]));
  });

  test("A2 self-check and graded listening semantics come from lesson data", () => {
    const day21 = getA2B1WorkbookSectionProfile("A2", 21);
    const day24 = getA2B1WorkbookSectionProfile("A2", 24);

    expect(day21).toMatchObject({
      listening: true,
      part4: "listening",
      part4Submission: "submit",
    });
    expect(day24).toMatchObject({
      listening: true,
      part4: "listening",
      part4Submission: "submit",
    });
  });

  test("B1 Day 22 exposes preserved Teil 4 as Lesen", () => {
    const profile = getA2B1WorkbookSectionProfile("B1", 22);
    const tabs = tabsFor("B1 Day 22 workbook sections");
    const part4 = tabs.find((tab) => tab.key === "hoeren");

    expect(profile.listening).toBe(false);
    expect(profile.part4).toBe("reading");
    expect(profile.part4Submission).toBe("submit");
    expect(part4).toMatchObject({ label: "Teil 4", description: "Lesen" });
  });

  test("B1 Day 23 has no Teil 4", () => {
    const profile = getA2B1WorkbookSectionProfile("B1", 23);
    const tabs = tabKeysFor("B1 Day 23 workbook sections");

    expect(profile.part4).toBeNull();
    expect(profile.part4Submission).toBe("none");
    expect(tabs).not.toContain("hoeren");
  });

  test("shows the actual included skills for A2 and B1 Course Book day cards", () => {
    expect(getA2B1WorkbookIncludedSectionLabels("A2", 7)).toEqual([
      "Grammar",
      "Sprechen",
      "Schreiben",
      "Lesen",
      "Hören",
    ]);

    expect(getA2B1WorkbookIncludedSectionLabels("A2", 14)).toEqual([
      "Grammar",
      "Sprechen",
      "Lesen",
    ]);

    expect(getA2B1WorkbookIncludedSectionLabels("B1", 22)).toEqual([
      "Grammar",
      "Sprechen",
      "Lesen",
    ]);

    expect(getA2B1WorkbookIncludedSectionLabels("B1", 23)).toEqual(["Sprechen"]);
    expect(getA2B1WorkbookIncludedSectionLabels("A2", 22)).toEqual(["Sprechen"]);
  });

  test("unknown tabs are preserved so page-specific extensions remain safe", () => {
    const result = getWorkbookTabsWithLegacyGrammar({
      tabs: [{ key: "custom", label: "Custom" }],
      ariaLabel: "A2 Day 14 workbook sections",
    });

    expect(result.tabs).toEqual([{ key: "custom", label: "Custom" }]);
  });
});


describe("A2/B1 submission section completeness", () => {
  test("blocks an A2 submission when a required Teil is missing", () => {
    const result = validateA2B1WorkbookSubmissionSections({
      level: "A2",
      day: 21,
      text: "TEIL 2\\nHallo! Ich schreibe Ihnen wegen des Wochenendes.\\nTEIL 3\\n1. A\\n2. B\\n3. C",
    });

    expect(result.ok).toBe(false);
    expect(result.missingParts).toEqual(["teil4"]);
    expect(result.message).toMatch(/Teil 4 · Hören/);
    expect(result.message).toMatch(/still a draft and has not been submitted/i);
  });

  test("blocks a heading-only section and a fully blank A2/B1 submission", () => {
    const headingOnly = validateA2B1WorkbookSubmissionSections({
      level: "B1",
      day: 24,
      text: "TEIL 3 · Lesen\\n1. A\\n2. B\\nTEIL 4 · Hören",
    });
    const blank = validateA2B1WorkbookSubmissionSections({ level: "A2", day: 21, text: "  " });

    expect(headingOnly.ok).toBe(false);
    expect(headingOnly.missingParts).toContain("teil4");
    expect(blank.ok).toBe(false);
    expect(blank.missingParts).toEqual(["teil2", "teil3", "teil4"]);
  });

  test("accepts every required part and does not require omitted or self-check parts", () => {
    const complete = validateA2B1WorkbookSubmissionSections({
      level: "A2",
      day: 21,
      text: "TEIL 2 · Schreiben\\nHallo Jan, ich komme am Samstag.\\nTEIL 3 · Lesen\\n1. A\\n2. B\\nTEIL 4 · Hören\\n1. Richtig\\n2. Falsch",
    });
    const readingOnly = validateA2B1WorkbookSubmissionSections({
      level: "A2",
      day: 25,
      text: "I get up at seven, have breakfast, and go to class.",
    });

    expect(complete).toMatchObject({ ok: true, missingParts: [] });
    expect(readingOnly).toMatchObject({ ok: true, missingParts: [] });
  });
});

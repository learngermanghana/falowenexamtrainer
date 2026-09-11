import fs from "fs";
import path from "path";
import { getCanonicalA1TeacherVideoResource } from "../data/a1TeacherVideoResources";

const readComponent = (filename) =>
  fs.readFileSync(path.join(__dirname, filename), "utf8");

describe("A1 Course Book Day 2 through Day 4 audit guardrails", () => {
  test("Day 3 Kapitel 1.1 uses the canonical teacher lecture and teaches its declared focus", () => {
    const source = readComponent("A1Day3SchreibenSprechenKapitel11WorkbookPage.js");
    const teacher = getCanonicalA1TeacherVideoResource(3, "1.1");

    expect(teacher?.url).toBe("https://youtu.be/Ygbpt6yC_f4");
    expect(source).toContain("teacherVideo={A1_DAY3_KAPITEL_11_TEACHER_VIDEO}");
    expect(source).not.toContain("No teacher lecture is currently configured for this page");
    expect(source).toContain("Personal information");
    expect(source).toContain("Articles: der · die · das");
    expect(source).toContain("Simple adjectives");
    expect(source).toContain("W-questions");
  });

  test("Day 3 Kapitel 1.1 deliberately removes stale Day 1/Day 2 review blocks", () => {
    const source = readComponent("A1Day3SchreibenSprechenKapitel11WorkbookPage.js");

    expect(source).toContain('removeSectionByText(root, "h1, h2, h3, h4", "Spelling Practice")');
    expect(source).toContain('removeSectionByText(root, "h1, h2, h3, h4", "Basic Vocabulary for A1 German Class")');
  });

  test("Day 3 Kapitel 1.2 uses correct heißen spelling and the canonical workbook identity", () => {
    const source = readComponent("A1Day3PronounsIntroducingYourselfWorkbookPage.js");

    expect(source).toContain("Present-Tense Verb Conjugation Practice");
    expect(source).toContain("heißen");
    expect(source).not.toContain("heiBen");
  });

  test("Day 4 keeps one real two-part workbook structure and the canonical Numbers identity", () => {
    const source = readComponent("A1Day4NumbersForBeginnersWorkbookPage.js");

    expect(source).toContain("A1 · Day 4 Workbook · Numbers");
    expect(source).toContain("They all belong to this one Teil 2 section");
    expect(source).not.toContain("Teil 1: Zahlen erkennen und benennen");
    expect(source).not.toContain("A1 · Day 4 Workbook · Numbers and Addresses");
  });
});

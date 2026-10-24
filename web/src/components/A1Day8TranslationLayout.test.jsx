import fs from "fs";
import path from "path";
import { getA1TutorDraftProfile } from "../data/a1TutorDraftProfiles";

const read = (fileName) =>
  fs.readFileSync(path.resolve(__dirname, fileName), "utf8");

describe("A1 Day 8 translation task layout", () => {
  test("renders the shared translation task with five inline answers", () => {
    const source = read("A1Day8CountriesAndLanguagesWorkbookPage.js");

    expect(source).toContain('import A1TranslationTask from "./A1TranslationTask"');
    expect(source).toContain('<A1TranslationTask');
    expect(source).toContain('sectionKey="teil-1"');
    expect(source).toContain('title="Herkunft und Sprache"');
    expect(source).toContain('I come from Germany. I speak German.');
    expect(source).toContain('He comes from England. He speaks English.');
    expect(source).toContain('kommen aus · sprechen');
  });

  test("keeps the canonical five translation answers but marks them as inline", () => {
    const profile = getA1TutorDraftProfile("A1-4");
    const section = profile.sections["teil-1"];

    expect(section.label).toBe("Translation");
    expect(section.inlineAnswers).toBe(true);
    expect(section.items).toHaveLength(5);
    expect(section.items.every((item) => item.type === "short")).toBe(true);
  });

  test("does not render a duplicate short-answer panel below inline translation cards", () => {
    const capture = read("A1TutorDraftSectionCapture.jsx");
    expect(capture).toContain("const inlineAnswers = Boolean(sectionProfile.inlineAnswers)");
    expect(capture).toContain("if (inlineAnswers) return null");
  });
});

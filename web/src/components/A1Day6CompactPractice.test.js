import fs from "fs";
import path from "path";

const source = fs.readFileSync(path.join(__dirname, "A1Day6FamilyAndHobbiesWorkbookPage.js"), "utf8");

describe("A1 Day 6 compact language and hobby practice", () => {
  test("shows country-flag-language references for all ten languages", () => {
    expect((source.match(/\["🇩🇪"|"🇬🇧"|"🇪🇸"|"🇫🇷"|"🇮🇹"|"🇷🇺"|"🇨🇳"|"🇯🇵"|"🇵🇹"|"🇸🇦"/g) || []).length).toBe(10);
    expect(source).toContain("repeat(auto-fit, minmax(min(100%, 180px), 1fr))");
    expect(source).toContain("not every country where the language is spoken");
  });

  test("uses four verb/pronoun questions, checked in-browser without cloud marking", () => {
    for (const sentence of ["Liest du gern?", "Schwimmt er gern?", "Kocht sie gern?", "Reist du gern?"]) {
      expect(source).toContain(sentence);
    }
    expect(source).toContain("Check answer");
    expect(source).toContain('role="status"');
    expect(source).toContain("normalizeYesNoQuestion(answer)");
  });
});

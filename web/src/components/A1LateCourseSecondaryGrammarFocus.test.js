import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const componentsDir = __dirname;
const repoRoot = path.resolve(componentsDir, "../../..");
const patchScript = path.join(repoRoot, "scripts/patchA1LateCourseSecondaryGrammar.mjs");

const readComponent = (name) => fs.readFileSync(path.join(componentsDir, name), "utf8");

describe("late A1 secondary grammar sequence", () => {
  beforeAll(() => {
    execFileSync(process.execPath, [patchScript], { cwd: repoRoot, stdio: "pipe" });
  });

  it("teaches Perfekt as a second Day 21 grammar focus with practice", () => {
    const source = readComponent("WeatherPerfektLetterPage.js");

    expect(source).toContain('eyebrow="Second grammar focus" title="Perfekt: talking about completed actions"');
    expect(source).toContain("haben/sein + Partizip II");
    expect(source).toContain('prompt: "Ich ___ gestern Deutsch gelernt."');
    expect(source).toContain('prompt: "Wir ___ nach Kumasi gefahren."');
    expect(source).not.toContain('eyebrow="Optional review"');
  });

  it("teaches adjective endings as a second Day 23 grammar focus with practice", () => {
    const source = readComponent("DativeAdjectiveDeclensionPage.js");

    expect(source).toContain('eyebrow="Second grammar focus" title="Adjective endings with ein/eine"');
    expect(source).toContain("ein großer Mann");
    expect(source).toContain("einen großen Mann");
    expect(source).toContain("mit einem großen Mann");
    expect(source).toContain('prompt: "Das ist ein ___ Hund."');
    expect(source).not.toContain('eyebrow="Optional extra"');
  });

  it("revises both topics again on Day 24", () => {
    const source = readComponent("ConjunctionNotesPage.js");

    expect(source).toContain('title="Final Grammar Check: Perfekt and Adjective Endings"');
    expect(source).toContain('title: "7) Task"');
    expect(source).toContain("Ich habe Deutsch gelernt.");
    expect(source).toContain("mit einem guten Kurs");
  });

  it("keeps the fixed Day 21 tutor assignment identity", () => {
    const source = readComponent("A1Day21WeatherWorkbookPage.js");
    expect(source).toContain('const DAY21_ASSIGNMENT_KEY = "A1-13"');
    expect(source).toContain('fallbackAssignmentKey={DAY21_ASSIGNMENT_KEY}');
  });
});

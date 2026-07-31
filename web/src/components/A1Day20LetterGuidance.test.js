import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(currentDir, "LetterWritingIntroPage.js");
const source = fs.readFileSync(sourcePath, "utf8");

describe("A1 Day 20 letter guidance", () => {
  test("uses only current A1 grammar in the body guidance", () => {
    expect(source).toContain("Answer every task point with one short sentence.");
    expect(source).toContain("Use about four words when possible.");
    expect(source).toContain("Write no more than five sentences in the main body.");
    expect(source).toContain("Use <strong>weil</strong> only when you give a reason.");
    expect(source).not.toContain("Ich möchte wissen, ob ...");
    expect(source).not.toContain("<strong>deshalb</strong>");
  });

  test("shows five reusable A1 sentence patterns", () => {
    expect(source).toContain("<strong>Statement:</strong> Subject + verb + rest.");
    expect(source).toContain("<strong>Modal verb:</strong> Subject + modal verb + rest + infinitive.");
    expect(source).toContain("<strong>Yes/no question:</strong> Verb + subject + rest?");
    expect(source).toContain("<strong>W-question:</strong> W-word + verb + subject/rest?");
    expect(source).toContain("<strong>Separable verb:</strong> Subject + verb + rest + prefix.");
  });

  test("keeps the workbook prompts direct and short", () => {
    expect(source).toContain('"Fragen Sie: Gibt es eine Feier?"');
    expect(source).toContain('"Fragen Sie: Kann Ihre Familie mitkommen?"');
    expect(source).toContain('"Fragen Sie: Wann beginnt der Kurs?"');
    expect(source).toContain('"Fragen Sie: Wie viel kostet der Kurs?"');
    expect(source).toContain('"Fragen Sie: Kann ich online bezahlen?"');
    expect(source).toContain("Schreiben Sie höchstens fünf kurze Sätze im Hauptteil.");
    expect(source).not.toContain("Fragen Sie, ob es eine Feier gibt");
  });

  test("uses short model letters without the removed connectors", () => {
    expect(source).toContain("Wann beginnt der Kurs? Wie viel kostet der Kurs? Kann ich online bezahlen?");
    expect(source).toContain("Wann bist du zu Hause? Kann ich Samstag kommen? Ich bringe Kuchen mit.");
    expect(source).not.toContain("Der Kurs ist wichtig für meine Arbeit, deshalb");
    expect(source).not.toContain("Ich bin am Samstag frei, deshalb");
  });
});

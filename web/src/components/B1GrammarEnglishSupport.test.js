import fs from "fs";
import path from "path";
import { getB1GrammarEnglishSupport } from "./B1GrammarEnglishSupport";

describe("B1 grammar English support", () => {
  test("covers every existing B1 grammar-note day from 1 to 23", () => {
    for (let day = 1; day <= 23; day += 1) {
      const support = getB1GrammarEnglishSupport(day);
      expect(support).toBeTruthy();
      expect(support.terms.length).toBeGreaterThan(10);
      expect(support.rule.length).toBeGreaterThan(30);
      expect(support.example.length).toBeGreaterThan(10);
    }
  });

  test("does not invent English support for B1 days without grammar-note pages", () => {
    [24, 25, 26, 27, 28].forEach((day) => {
      expect(getB1GrammarEnglishSupport(day)).toBeNull();
    });
  });

  test("keeps support short and leaves examples in German", () => {
    const day5 = getB1GrammarEnglishSupport(5);
    expect(day5.terms).toContain("Konjunktiv II");
    expect(day5.terms).toContain("indirect question");
    expect(day5.rule).toContain("verb goes to the end");
    expect(day5.example).toContain("Könnten Sie");
  });

  test("renders the helper only inside B1 grammar notes", () => {
    const source = fs.readFileSync(
      path.resolve(__dirname, "A2B1WorkbookGrammarNotesContent.js"),
      "utf8",
    );
    expect(source).toContain('import B1GrammarEnglishSupport from "./B1GrammarEnglishSupport"');
    expect(source).toContain('normalizedLevel === "B1" && GrammarNotes');
    expect(source).toContain("<B1GrammarEnglishSupport day={numericDay} />");
  });
});

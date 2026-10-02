import fs from "fs";
import path from "path";

test("A2 Day 8 exposes full restaurant grammar notes instead of the old recipe imperative drill", () => {
  const file = fs.readFileSync(
    path.join(process.cwd(), "src", "components", "A2Day8ImperativeGrammarPage.js"),
    "utf8",
  );

  expect(file).toMatch(/Höfliche Wünsche und Bitten im Restaurant/);
  expect(file).toMatch(/Konjunktiv-II form of haben/);
  expect(file).toMatch(/Konjunktiv-II form of können/);
  expect(file).toMatch(/Akkusativ bei der Bestellung/);
  expect(file).toMatch(/Fragen richtig bilden/);
  expect(file).toMatch(/Sie-Form im Restaurant/);
  expect(file).not.toMatch(/Kurz lernen · dann anwenden/);
  expect(file).not.toMatch(/Imperativ: ein Rezept Schritt für Schritt erklären/);
});

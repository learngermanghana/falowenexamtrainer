import fs from "fs";
import path from "path";

describe("C2 Day 1 speaking ideas", () => {
  const source = fs.readFileSync(path.join(__dirname, "C2Day1GuidedWorkbookPage.js"), "utf8");

  test("adds A2/B1-style speaking support below the C2 task", () => {
    expect(source).toContain('data-c2-day1-speaking-ideas="true"');
    expect(source).toContain("Ideen für Ihren Vortrag");
    expect(source).toContain("<strong>Ideen:</strong>");
    expect(source).toContain("<strong>Leitfrage:</strong>");
    expect(source).toContain("<strong>C2-Satzanfang:</strong>");
    expect(source).toContain("<strong>So können Sie den Gedanken entwickeln:</strong>");
    expect(source).toContain("Aussage → Begründung → Beispiel → Einordnung");
  });

  test("covers the main circular-economy argument branches", () => {
    expect(source).toContain("Verantwortung der Verbraucher");
    expect(source).toContain("Verantwortung der Hersteller");
    expect(source).toContain("Reparieren und Wiederverwenden statt nur Recycling");
    expect(source).toContain("Staatliche Rahmenbedingungen und Anreize");
    expect(source).toContain("Differenzierte Schlussposition");
    expect(source).toContain("Wegwerfmentalität");
    expect(source).toContain("Reparierbarkeit");
    expect(source).toContain("Ressourcenschonung");
    expect(source).toContain("steuerliche Anreize");
  });
});

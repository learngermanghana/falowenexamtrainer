import fs from "fs";
import path from "path";
import { getC2ExamStandard } from "../data/c2ExamStandardContent";

describe("C2 Day 1 topic foundation", () => {
  const standard = getC2ExamStandard(1);
  const knowledge = standard.topicKnowledge;
  const pageSource = fs.readFileSync(path.join(__dirname, "C2Day1GuidedWorkbookPage.js"), "utf8");
  const panelSource = fs.readFileSync(path.join(__dirname, "C2StandardExamPanels.js"), "utf8");

  test("teaches circular economy before asking students to argue", () => {
    expect(standard.title).toBe("Kreislaufwirtschaft und Wegwerfgesellschaft");
    expect(standard.grammarFocus).toBe("Nuancierte Bewertung und Registersteuerung");
    expect(knowledge.chapter).toBe("1.1");
    expect(knowledge.englishDefinition).toContain("products and materials stay in use");
    expect(knowledge.germanDefinition).toContain("Produkte und Rohstoffe möglichst lange im Umlauf");
    expect(knowledge.linearModel).toContain("Wegwerfen");
    expect(knowledge.circularModel).toContain("reparieren");
    expect(knowledge.exampleTitle).toBe("Beispiel: Smartphone");
  });

  test("prepares students for the admin slide questions", () => {
    const questions = knowledge.checks.map((check) => check.question);
    expect(questions).toContain('Was ist die Kernfrage bei „Kreislaufwirtschaft und Wegwerfgesellschaft“?');
    expect(questions).toContain("Welche zwei Interessen oder Werte können bei diesem Thema in Spannung geraten?");
    expect(questions).toContain("Welche Kollokation passt zu einem ersten Argument über langlebige Produkte?");
    expect(knowledge.tensions).toEqual(expect.arrayContaining([
      ["niedriger Preis und Bequemlichkeit", "Langlebigkeit und Ressourcenschonung"],
      ["unternehmerische Freiheit", "staatliche Umwelt- und Produktregeln"],
    ]));
  });

  test("keeps the Day 1 page independent of the legacy Identity mastery lesson", () => {
    expect(pageSource).toContain('getC2ExamStandard');
    expect(pageSource).toContain('data-c2-day1-topic-foundation="true"');
    expect(pageSource).toContain("Thema verstehen · Kreislaufwirtschaft zuerst verstehen");
    expect(pageSource).not.toContain("getC2Day1To7Mastery");
    expect(pageSource).not.toContain("Sprache, Identität und Gesellschaft");
    expect(panelSource).toContain('data-c2-topic-foundation="true"');
    expect(panelSource).toContain("Thema verstehen · Inhalt vor Argumentation");
  });
});

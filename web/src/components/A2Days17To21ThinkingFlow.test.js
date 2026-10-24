// Production trigger: A2 Days 17-21 thinking-flow release.
import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("A2 Days 17-21 thinking flow", () => {
  test("grammar tab adds thinking-first support for Days 17-21 after the video", () => {
    const source = read("A2B1WorkbookGrammarNotes.js");
    expect(source).toContain("A2Days17To21ThinkingFirstGrammarGuide");
    expect(source).toContain('numericDay >= 17 && numericDay <= 21');
    expect(source.indexOf("A2B1GrammarVideoCard")).toBeLessThan(source.indexOf("A2Days17To21ThinkingFirstGrammarGuide day={numericDay}"));
  });

  test("support contains real speaking ideas for all five lessons", () => {
    const source = read("A2Days17To21ThinkingSupport.js");
    [
      "More speaking help: In die Apotheke gehen",
      "More speaking help: Die Bank anrufen",
      "More speaking help: Einkaufen – wo und wie?",
      "More speaking help: Eine Reklamation machen",
      "More speaking help: Ein Wochenende planen",
    ].forEach((marker) => expect(source).toContain(marker));
    expect(source).toContain("Idea → decision → German sentence");
    expect(source).toContain("modelAnswer");
  });

  test("shared SpeakingMindMap enriches A2 Days 17-21", () => {
    const source = read("SpeakingMindMap.js");
    expect(source).toContain("getA2Days17To21SpeakingConfig");
    expect(source).toContain("day >= 17 && day <= 21");
  });

  test("Days 17 and 18 do not repeat the speaking question below the mind map", () => {
    const day17 = read("A2Day17InDieApothekeGehenWorkbookPage.js");
    const day18 = read("A2Day18DieBankAnrufenWorkbookPage.js");
    const standardShell = read("A2StandardTabbedWorkbookPage.js");

    expect((day17.match(/<SpeakingMindMap /g) || [])).toHaveLength(1);
    expect(day17).toContain("The mind map contains the complete task");
    expect(day17).not.toContain("Beispiel für die Brain Map-Struktur");
    expect(day17).not.toContain("Sprechen wie bei einer Mini-Präsentation");
    expect(day17).not.toContain("Modellantwort (ca. 30–45 Sekunden)");
    expect(standardShell).toContain("showSpeakingTaskCard = true");
    expect(day18).toContain("showSpeakingTaskCard={false}");
  });

  test.each([
    ["A2Day17InDieApothekeGehenWorkbookPage.js", "Beschreiben Sie kurz, warum Sie das Medikament benötigen.", "Fragen Sie nach der richtigen Dosierung oder möglichen Nebenwirkungen."],
    ["A2Day18DieBankAnrufenWorkbookPage.js", "fragen, ob Ihre Karte entsperrt werden kann.", "fragen, wie lange der Vorgang dauern wird."],
    ["A2Day19EinkaufenWoUndWieWorkbookPage.js", "Laden Sie ihn oder sie zum Einkaufen ein und erklären Sie den Grund.", "Bitten Sie um seine oder ihre Meinung zu Ihrer Idee."],
    ["A2Day21EinWochenendePlanenWorkbookPage.js", "Beschreiben Sie Ihre Wochenendpläne und erklären Sie, warum sie besonders sind", "Erklären Sie, was die Person mitbringen sollte oder was sie erwarten kann"],
  ])("%s keeps a clear Teil 2 situation with visible bullet points", (file, firstBullet, secondBullet) => {
    const source = read(file);
    expect(source).toContain(firstBullet);
    expect(source).toContain(secondBullet);
  });

  test("Day 20 keeps the concrete complaint-writing context", () => {
    const source = read("A2Day20TypischeReklamationssituationenWorkbookPage.js");
    expect(source).toContain("Reklamation");
    expect(source).toContain("Kassenbon");
    expect(source).toContain("Rückerstattung");
  });
});

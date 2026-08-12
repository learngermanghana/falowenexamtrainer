// Deployment trigger: A2 Days 22-28 thinking flow merged to main.
import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("A2 Days 22-28 thinking flow", () => {
  test("grammar tab adds the thinking-first guide for supported late-A2 grammar notes after the video", () => {
    const source = read("A2B1WorkbookGrammarNotes.js");
    expect(source).toContain("A2Days22To28ThinkingFirstGrammarGuide");
    expect(source).toContain('numericDay >= 22 && numericDay <= 28');
    expect(source.indexOf("A2B1GrammarVideoCard")).toBeLessThan(
      source.indexOf("A2Days22To28ThinkingFirstGrammarGuide day={numericDay}"),
    );
  });

  test("support contains real idea-building help for every Day 22-28 speaking topic", () => {
    const source = read("A2Days22To28ThinkingSupport.js");
    [
      "More speaking help: Meine Woche planen",
      "More speaking help: Mein Schul- oder Arbeitsweg",
      "More speaking help: Einen Urlaub planen",
      "More speaking help: Mein Tagesablauf",
      "More speaking help: Gefühle in Situationen",
      "More speaking help: Digitale Kommunikation",
      "More speaking help: Über meine Zukunft sprechen",
    ].forEach((marker) => expect(source).toContain(marker));
    expect(source).toContain("Idea → decision → German sentence");
    expect(source).toContain("modelAnswer");
  });

  test("shared SpeakingMindMap enriches all A2 Days 22-28", () => {
    const source = read("SpeakingMindMap.js");
    expect(source).toContain("getA2Days22To28SpeakingConfig");
    expect(source).toContain("day >= 22 && day <= 28");
  });

  test("Days 26-28 mini-learning also starts with a thinking-first route", () => {
    const source = read("A2Days26To28LearningUpgrade.js");
    expect(source).toContain("THINK_FIRST_BY_DAY");
    expect(source).toContain("Feelings with wenn: picture the situation first");
    expect(source).toContain("Opinions with dass: decide your message first");
    expect(source).toContain("Futur I: choose the future plan before building the form");
    expect(source.indexOf("ThinkingFirstCard day={day}")).toBeLessThan(source.indexOf("A2MiniLearningBlock {...lesson}"));
  });

  test.each([
    ["A2Day22DieWochePlanungWorkbookPage.js", "zum Mittagessen einladen", "Nennen Sie Datum, Uhrzeit und Ort des Treffens."],
    ["A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage.js", "mit Ihnen zum Autohändler oder in ein Autohaus zu gehen", "Schlagen Sie vor, wann und wo Sie sich treffen können."],
    ["A2Day24EinenUrlaubPlanenWorkbookPage.js", "zusammen mit Sandra einen Urlaub planen", "Bitten Sie Sandra um ihre Meinung zu Ihrer Idee."],
    ["A2Day25TagesablaufWorkbookPage.js", "über deinen Tagesablauf", "Frage nach dem Tagesablauf deiner Freundin oder deines Freundes."],
    ["A2Day28UeberDieZukunftSprechenWorkbookPage.js", "viele Pläne für Ihre Zukunft", "Fragen Sie, was Ihr Freund/Ihre Freundin für die Zukunft plant."],
  ])("%s keeps a clear Teil 2 situation with visible bullet points", (file, situation, bullet) => {
    const source = read(file);
    expect(source).toContain(situation);
    expect(source).toContain(bullet);
  });
});

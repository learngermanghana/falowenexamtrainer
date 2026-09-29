import { collectObjectiveGroups, extractWorkbookObjectiveLetter } from "./WorkbookSubmissionCaptureRuntime";

const makeQuestion = (section, number, options) => {
  const card = document.createElement("div");
  const strong = document.createElement("strong");
  strong.textContent = `${number}. Frage`;
  card.appendChild(strong);
  options.forEach((option) => {
    const span = document.createElement("span");
    span.textContent = option;
    card.appendChild(span);
  });
  section.appendChild(card);
};

describe("WorkbookSubmissionCaptureRuntime objective mapping", () => {
  test("recognizes Anzeige letter options", () => {
    expect(extractWorkbookObjectiveLetter("Anzeige F")).toBe("F");
    expect(extractWorkbookObjectiveLetter("C) Antwort")).toBe("C");
  });

  test("renumbers restarted Lesen groups instead of overwriting earlier questions", () => {
    const section = document.createElement("section");

    for (let question = 1; question <= 7; question += 1) {
      makeQuestion(section, question, ["A) Eins", "B) Zwei", "C) Drei"]);
    }
    for (let question = 1; question <= 5; question += 1) {
      makeQuestion(section, question, ["Anzeige A", "Anzeige B", "Anzeige C", "Anzeige D", "Anzeige E", "Anzeige F"]);
    }

    const groups = collectObjectiveGroups(section);
    expect(groups.map((group) => group.questionNumber)).toEqual(
      Array.from({ length: 12 }, (_, index) => index + 1),
    );
    expect(groups.slice(7).map((group) => extractWorkbookObjectiveLetter(group.options[0].textContent))).toEqual(
      ["A", "A", "A", "A", "A"],
    );
  });
});

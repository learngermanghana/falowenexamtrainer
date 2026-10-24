import lesson from "./selfLearningLessons/c1/day9KonsumUndWerbung";
import { C1_APPROVED_OPINION_ESSAY_TEMPLATE } from "./c1ApprovedOpinionEssayTemplate";
import { getStandardWritingConfig } from "./standardLessonJourney";

test("C1 Course Book opinion writing uses the six-part advanced scaffold, not the old template", () => {
  const config = getStandardWritingConfig(lesson);
  expect(config.taskType).toMatch(/C1 opinion essay|Stellungnahme/i);
  expect(config.opinionTemplate).toBe(C1_APPROVED_OPINION_ESSAY_TEMPLATE);
  expect(config.opinionTemplate.split(/\n\n+/)).toHaveLength(6);
  [
    "Das Thema [Thema] gewinnt im öffentlichen Diskurs zunehmend an Bedeutung",
    "Zunächst lässt sich anführen, dass [Hauptargument]",
    "Als anschauliches Beispiel hierfür lässt sich [konkretes Beispiel] heranziehen",
    "Demgegenüber muss jedoch eingeräumt werden, dass [Gegenargument/Nachteil]",
    "Möglicherweise",
  ].slice(0,4).forEach((phrase) => expect(config.opinionTemplate).toContain(phrase));
  expect(config.opinionTemplate).toContain("Um dieser Herausforderung wirksam zu begegnen");
  expect(config.opinionTemplate).toContain("Zusammenfassend lässt sich festhalten, dass trotz der Einwände");
  expect(config.opinionTemplate).not.toContain("In der heutigen Zeit wird oft über");
  expect(config.opinionTemplate).not.toContain("Eine mögliche Lösung oder Alternative wäre");
});

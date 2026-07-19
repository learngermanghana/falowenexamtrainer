import lesson from "./selfLearningLessons/c1/day9KonsumUndWerbung";
import { C1_APPROVED_OPINION_ESSAY_TEMPLATE } from "./c1ApprovedOpinionEssayTemplate";
import { getStandardWritingConfig } from "./standardLessonJourney";

test("C1 Day 9 places the requested minimal template in the actual writing textbox", () => {
  const config = getStandardWritingConfig(lesson);

  expect(config.taskType).toMatch(/C1 opinion essay|Stellungnahme/i);
  expect(config.opinionTemplate).toBe(C1_APPROVED_OPINION_ESSAY_TEMPLATE);
  expect(config.opinionTemplate).toContain(
    "In der heutigen Zeit wird häufig über [Thema] diskutiert.",
  );
  expect(config.opinionTemplate).toContain(
    "Einerseits bietet [Thema] zahlreiche Vorteile.",
  );
  expect(config.opinionTemplate).toContain(
    "Andererseits sollte berücksichtigt werden, dass [Nachteil / Problem].",
  );
  expect(config.opinionTemplate).toContain(
    "Dennoch bin ich der Auffassung, dass [eigene Position].",
  );
  expect(config.opinionTemplate).toContain(
    "Zusammenfassend lässt sich sagen, dass [Fazit].",
  );
  expect(config.opinionTemplate).not.toContain("[Fragestellung / Titel]");
  expect(config.opinionTemplate).not.toContain("[Akteur 1]");
  expect(config.opinionTemplate).not.toContain("personalisierte Werbung");
});

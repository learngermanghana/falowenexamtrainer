import lesson from "./selfLearningLessons/c1/day9KonsumUndWerbung";
import { C1_APPROVED_OPINION_ESSAY_TEMPLATE } from "./c1ApprovedOpinionEssayTemplate";
import { getStandardWritingConfig } from "./standardLessonJourney";

test("C1 Day 9 places the approved topic-neutral template in the actual writing textbox", () => {
  const config = getStandardWritingConfig(lesson);

  expect(config.taskType).toMatch(/C1 opinion essay|Stellungnahme/i);
  expect(config.opinionTemplate).toBe(C1_APPROVED_OPINION_ESSAY_TEMPLATE);
  expect(config.opinionTemplate).toContain("[Fragestellung / Titel]");
  expect(config.opinionTemplate).toContain(
    "[Akteur 1], [Akteur 2] sowie [Akteur 3] gleichermaßen eine wichtige Verantwortung tragen",
  );
  expect(config.opinionTemplate).toContain(
    "[Aspekt 1], [Aspekt 2], [Aspekt 3] und [Aspekt 4] miteinander verbindet",
  );
  expect(config.opinionTemplate).not.toContain("personalisierte Werbung");
  expect(config.opinionTemplate).not.toContain("Verbraucherinnen und Verbraucher");
});

import lesson from "./selfLearningLessons/c1/day9KonsumUndWerbung";
import { C1_APPROVED_OPINION_ESSAY_TEMPLATE } from "./c1ApprovedOpinionEssayTemplate";
import { getStandardWritingConfig } from "./standardLessonJourney";

test("C1 Day 9 places the approved template with recommendation and outlook in the actual writing textbox", () => {
  const config = getStandardWritingConfig(lesson);

  expect(config.taskType).toMatch(/C1 opinion essay|Stellungnahme/i);
  expect(config.opinionTemplate).toBe(C1_APPROVED_OPINION_ESSAY_TEMPLATE);
  expect(config.opinionTemplate).toContain(
    "In der heutigen Zeit wird häufig über [Thema] diskutiert.",
  );
  expect(config.opinionTemplate).toContain(
    "da es sowohl [Bereich 1] als auch [Bereich 2] betrifft",
  );
  expect(config.opinionTemplate).toContain(
    "Einerseits bietet [Thema] zahlreiche Vorteile.",
  );
  expect(config.opinionTemplate).toContain(
    "Andererseits sollte berücksichtigt werden, dass [Nachteil oder Problem].",
  );
  expect(config.opinionTemplate).toContain(
    "Dennoch bin ich der Auffassung, dass [eigene Position mit Begründung].",
  );
  expect(config.opinionTemplate).toContain(
    "sowohl Chancen als auch Herausforderungen mit sich bringt",
  );
  expect(config.opinionTemplate).toContain(
    "Daher wäre es empfehlenswert, [konkrete Maßnahme oder ausgewogene Lösung].",
  );
  expect(config.opinionTemplate).toContain(
    "langfristig ein angemessener Ausgleich zwischen [Aspekt 1] und [Aspekt 2] geschaffen werden",
  );
  expect(config.opinionTemplate).not.toContain("[Fragestellung / Titel]");
  expect(config.opinionTemplate).not.toContain("personalisierte Werbung");
});

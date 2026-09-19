import lesson from "./selfLearningLessons/c1/day9KonsumUndWerbung";
import { C1_APPROVED_OPINION_ESSAY_TEMPLATE } from "./c1ApprovedOpinionEssayTemplate";
import { getStandardWritingConfig } from "./standardLessonJourney";

test("C1 Day 9 places the approved concise template in the actual writing textbox", () => {
  const config = getStandardWritingConfig(lesson);

  expect(config.taskType).toMatch(/C1 opinion essay|Stellungnahme/i);
  expect(config.opinionTemplate).toBe(C1_APPROVED_OPINION_ESSAY_TEMPLATE);
  expect(config.opinionTemplate).toContain(
    "In der heutigen Zeit wird oft über [Thema] diskutiert.",
  );
  expect(config.opinionTemplate).toContain(
    "Dieses Thema ist von großer Bedeutung, da es sowohl [Bereich 1] als auch [Bereich 2] betrifft.",
  );
  expect(config.opinionTemplate).toContain(
    "Ich vertrete die Ansicht, dass [eigene Meinung].",
  );
  expect(config.opinionTemplate).toContain(
    "Zunächst ist festzustellen, dass [Grund / Hauptargument].",
  );
  expect(config.opinionTemplate).toContain(
    "Andererseits sollte berücksichtigt werden, dass [Gegenargument / Nachteil].",
  );
  expect(config.opinionTemplate).toContain(
    "Eine mögliche Lösung oder Alternative wäre, dass [Vorschlag / Alternative].",
  );
  expect(config.opinionTemplate).toContain(
    "Zusammenfassend lässt sich festhalten, dass [kurzes Fazit].",
  );
  expect(config.opinionTemplate).toContain(
    "Ich bin der Auffassung, dass [eigene Position].",
  );
  expect(config.opinionTemplate).not.toContain("Einerseits bietet");
  expect(config.opinionTemplate).not.toContain("personalisierte Werbung");
});

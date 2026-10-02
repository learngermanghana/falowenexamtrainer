import { getLessonById } from "./lessonCatalog";
import { A2_EARLY_COURSE_ALIGNMENT } from "./a2CurriculumAlignment";

test("A2 Day 8 learner metadata stays aligned to the restaurant lesson", () => {
  const lesson = getLessonById("A2-3.8");

  expect(lesson?.title).toBe("Im Restaurant – bestellen und reagieren (Exercise) 3.8");
  expect(lesson?.title).not.toMatch(/Rezepte und Essen/i);
  expect(A2_EARLY_COURSE_ALIGNMENT[8]?.title).toBe("Im Restaurant – bestellen und reagieren (Exercise) 3.8");
});

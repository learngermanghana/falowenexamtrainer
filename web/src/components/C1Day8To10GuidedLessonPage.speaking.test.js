import fs from "fs";
import path from "path";

const readSource = (filePath) =>
  fs.readFileSync(path.join(__dirname, filePath), "utf8");

test("C1 Days 8 to 10 show the same speaking idea-point layout as C1 Day 1", () => {
  const pageSource = readSource("C1Day8To10GuidedLessonPage.js");

  expect(pageSource).toContain("const SpeakingBuilder = ({ lesson })");
  expect(pageSource).toContain("lesson.speakingBuilder?.branches || []");
  expect(pageSource).toContain("Punkte für deine Antwort");
  expect(pageSource).toContain("<SpeakingBuilder lesson={lesson} />");
});

test("C1 Day 9 supplies readable speaking branches for consumption and advertising", () => {
  const lessonSource = readSource(
    "../data/selfLearningLessons/c1/day9KonsumUndWerbung.js",
  );

  expect(lessonSource).toContain('title: "Werbestrategien"');
  expect(lessonSource).toContain('title: "Personalisierte Werbung"');
  expect(lessonSource).toContain('title: "Wirkung auf Kaufentscheidungen"');
  expect(lessonSource).toContain('title: "Verantwortung der Unternehmen"');
  expect(lessonSource).toContain('title: "Verantwortung der Verbraucher"');
  expect(lessonSource).toContain('title: "Regulierung und Schutz"');
});

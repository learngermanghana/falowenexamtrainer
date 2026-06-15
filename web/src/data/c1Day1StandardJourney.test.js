import lesson from "./selfLearningLessons/c1/day1ZieleUndLernweg";
import speakingGuide from "./selfLearningLessons/c1/day1LearningSpeakingGuide";
import writingConfig from "./writingQuestionBuilders/c1Day1ZieleUndLernweg";
import { getLessonRadioResource } from "./lessonRadioDictionary";
import { getAdvancedWritingPhase } from "./advancedWritingProgression";
import { getStandardWritingConfig } from "./standardLessonJourney";

test("C1 Day 1 live lesson has a rich content-based speaking structure", () => {
  expect(lesson.title).toBe("Ziele und Lernweg");
  expect(lesson.speakingBuilder.branches).toEqual(speakingGuide.branches);
  expect(speakingGuide.branches).toHaveLength(5);
  speakingGuide.branches.forEach((branch) => {
    expect(branch.keywords.length).toBeGreaterThanOrEqual(5);
    expect(branch.prompt).toBeTruthy();
    expect(branch.example).toBeTruthy();
    expect(branch.starter).toBeTruthy();
    expect(["Einleitung", "Hauptteil 1", "Hauptteil 2", "Schluss"]).not.toContain(branch.title);
  });
});

test("C1 Day 1 uses five-question guided writing and the requested radio", () => {
  expect(getStandardWritingConfig(lesson)).toBe(writingConfig);
  expect(writingConfig.questions).toHaveLength(5);
  expect(getLessonRadioResource("C1", 1).youtubeId).toBe("McNk1VTFvMk");
  expect(getAdvancedWritingPhase("C1", 1)).toBe("guided");
  expect(getAdvancedWritingPhase("C1", 20)).toBe("full-essay");
});

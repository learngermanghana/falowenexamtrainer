import {
  getStandardWritingConfig,
  getWorkspaceWritingPrompt,
} from "./standardLessonJourneyV13";

const b2Lesson = {
  level: "B2",
  day: 2,
  title: "Beziehungen und Kommunikation",
  writingTaskType: "B2 opinion essay / Meinungsbeitrag",
  writingTopic:
    "Schreiben: Respektvolle Kommunikation in Beziehungen. Verfassen Sie einen B2-Meinungsbeitrag. Bearbeiten Sie alle Punkte: Nennen Sie Ihre Meinung. Nennen Sie Gründe.",
  writingBuilder: {
    structure: [
      "Einleitung: Stellen Sie das Thema kurz vor.",
      "Meinung: Äußern Sie Ihre Meinung klar.",
      "Gründe: Erklären Sie wichtige Gründe.",
    ],
  },
};

describe("standard writing workspace prompt", () => {
  test("keeps the full B2 task in the formatted prompt and shortens the workspace instruction", () => {
    const config = getStandardWritingConfig(b2Lesson);

    expect(config.topic).toBe(
      "Write one complete B2 opinion essay. Use the clearly formatted Schreibaufgabe above and address every required point.",
    );
    expect(config.prompt).toBe(b2Lesson.writingTopic);
    expect(config.writingTopic).toBe(b2Lesson.writingTopic);
    expect(config.writingPromptBullets).toEqual(b2Lesson.writingBuilder.structure);
  });

  test("uses the same concise instruction for C1 opinion writing", () => {
    const prompt = getWorkspaceWritingPrompt({
      level: "C1",
      writingTaskType: "C1 Stellungnahme",
      writingTopic: "Verfassen Sie eine C1-Stellungnahme.",
    });

    expect(prompt).toBe(
      "Write one complete C1 opinion essay. Use the clearly formatted Schreibaufgabe above and address every required point.",
    );
  });
});

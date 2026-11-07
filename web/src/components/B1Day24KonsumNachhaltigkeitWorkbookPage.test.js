import { B1_DAY24_KONSUM_NACHHALTIGKEIT_WORKBOOK_CONFIG } from "./B1Day24KonsumNachhaltigkeitWorkbookPage";
import { getA2B1LessonProfile } from "../data/a2B1LessonProfile";

describe("B1 Day 24 sustainability workbook", () => {
  test("keeps all seven speaking branches", () => {
    const { speaking } = B1_DAY24_KONSUM_NACHHALTIGKEIT_WORKBOOK_CONFIG;

    expect(speaking.ideaGroups).toHaveLength(7);
    expect(speaking.ideaGroups[0].items).toContain(
      "Kulturelle Unterschiede im Konsum, zum Beispiel in Deutschland und Ghana",
    );
    expect(speaking.ideaGroups[1].items).toContain("Strom- und Wassersparen");
    expect(speaking.ideaGroups[5].title).toBe(
      "6. Redemittel für Diskussion oder Schreiben",
    );
    expect(speaking.ideaGroups[6].items).toContain(
      "Nachhaltigkeit und Wirtschaftswachstum: Konflikt oder Chance?",
    );
  });

  test("keeps the current four-point sustainability writing prompt", () => {
    const { writing } = B1_DAY24_KONSUM_NACHHALTIGKEIT_WORKBOOK_CONFIG;
    expect(writing.title).toContain("Konsum und Nachhaltigkeit");
    expect(writing.sourceTitle).toContain("Laura");
    expect(writing.taskPoints).toHaveLength(4);
  });

  test("keeps the current reading about secondhand shopping and Repair-Cafés", () => {
    const { text } = B1_DAY24_KONSUM_NACHHALTIGKEIT_WORKBOOK_CONFIG.reading;
    expect(text.paragraphs.join(" ")).toContain("Repair-Cafés");
    expect(text.paragraphs.join(" ")).toContain("Greenwashing");
    expect(text.questions).toHaveLength(7);
    expect(text.questions.every((question) => question.options.length === 3)).toBe(true);
  });

  test("uses the approved Day 24 questions with the exact R2 object", () => {
    const { listening } = B1_DAY24_KONSUM_NACHHALTIGKEIT_WORKBOOK_CONFIG;
    expect(listening.audioKey).toBe("b1/day-24/day_24.mp3");
    expect(listening.questions).toHaveLength(5);
    expect(listening.submitRequired).toBe(true);
    expect(listening.showPublishedPractice).toBe(false);
    expect(listening.videoId || listening.embedUrl || listening.externalUrl).toBeFalsy();
    expect(B1_DAY24_KONSUM_NACHHALTIGKEIT_WORKBOOK_CONFIG.submitListening).toBe(true);
  });

  test("includes Hören questions in timed submission", () => {
    const profile = getA2B1LessonProfile("B1", 24);
    expect(profile.assignmentKey).toBe("B1-8.24");
    expect(profile.sections.part4).toMatchObject({
      visible: true, mode: "graded", submitRequired: true, contentType: "listening",
    });
    expect(profile.requiredSubmissionParts.map((part) => part.partId)).toEqual(["teil2", "teil3", "teil4"]);
    expect(profile.timer?.timedTabs).toEqual(["schreiben", "lesen", "hoeren"]);
  });
});

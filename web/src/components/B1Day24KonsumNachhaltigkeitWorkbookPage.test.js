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

  test("uses Paul's complete writing prompt", () => {
    const { writing } = B1_DAY24_KONSUM_NACHHALTIGKEIT_WORKBOOK_CONFIG;

    expect(writing.title).toBe(
      "Ist es wichtig, beim Konsum auf Nachhaltigkeit zu achten? Schreiben Sie Ihre Meinung.",
    );
    expect(writing.sourceText).toContain(
      "weniger Plastik zu verwenden oder Secondhand zu kaufen",
    );
  });

  test("keeps Eleni's full reading and seven true-or-false statements", () => {
    const { text } = B1_DAY24_KONSUM_NACHHALTIGKEIT_WORKBOOK_CONFIG.reading;

    expect(text.paragraphs.join(" ")).toContain("Wertstoffhof und ein Schadstoffmobil");
    expect(text.paragraphs.join(" ")).toContain("Man gibt Sachen eine zweite Chance!");
    expect(text.questions).toHaveLength(7);
    expect(text.questions.every((question) => question.options.length === 2)).toBe(true);
  });

  test("uses the exact new Day 24 R2 object and no longer shows the old Hören questions", () => {
    const { listening } = B1_DAY24_KONSUM_NACHHALTIGKEIT_WORKBOOK_CONFIG;
    expect(listening.audioKey).toBe("b1/day-24/day_24.mp3");
    expect(listening.questions).toEqual([]);
    expect(listening.submitRequired).toBe(false);
    expect(listening.showPublishedPractice).toBe(false);
    expect(listening.videoId || listening.embedUrl || listening.externalUrl).toBeFalsy();
    expect(B1_DAY24_KONSUM_NACHHALTIGKEIT_WORKBOOK_CONFIG.submitListening).toBe(false);
  });

  test("keeps the Hören audio tab while graded submission requires only Schreiben and Lesen", () => {
    const profile = getA2B1LessonProfile("B1", 24);
    expect(profile.assignmentKey).toBe("B1-8.24");
    expect(profile.sections.part4).toMatchObject({
      visible: true, mode: "self-check", submitRequired: false, contentType: "listening",
    });
    expect(profile.requiredSubmissionParts.map((part) => part.partId)).toEqual(["teil2", "teil3"]);
    expect(profile.timer?.timedTabs).toEqual(["schreiben", "lesen"]);
  });
});

import {
  B2_LESSON_CONTENT_ALIGNMENT,
  alignB2CurriculumEntry,
  getB2LessonContentAlignment,
} from "./b2LessonContentAlignment";
import { getCurriculumEntriesForLevel } from "./curriculumManifest";

describe("B2 Days 8-12 lesson content alignment", () => {
  it.each([
    [8, "2.3", "Reisen und Mobilität", "Vergleiche und Abwägung"],
    [9, "2.4", "Wohnen und Nachbarschaft", "Höfliche Beschwerden"],
    [10, "2.5", "Konsum und Geld", "Zweiteilige Konnektoren"],
    [11, "3.1", "Gesellschaft und Integration", "Konjunktiv II"],
    [12, "3.2", "Kultur und Freizeit", "Temporale Nebensätze"],
  ])("aligns Day %i to the active lesson", (day, chapter, title, grammar) => {
    expect(getB2LessonContentAlignment(day)).toEqual(
      expect.objectContaining({ day, chapter, title })
    );
    expect(B2_LESSON_CONTENT_ALIGNMENT[day].grammar_topic).toContain(grammar);
  });

  it("preserves assignment identity and submission fields", () => {
    const original = {
      level: "B2",
      day: 8,
      chapter: "2.3",
      title: "Politik und Engagement",
      assignmentId: "B2-2.3",
      assignment_id: "B2-2.3",
      submissionRequired: true,
      progressionEligible: true,
    };

    expect(alignB2CurriculumEntry(original)).toEqual(
      expect.objectContaining({
        title: "Reisen und Mobilität",
        topic: "Reisen und Mobilität",
        assignmentId: "B2-2.3",
        assignment_id: "B2-2.3",
        submissionRequired: true,
        progressionEligible: true,
      })
    );
  });

  it("exports aligned B2 curriculum entries to the Course Book schedule", () => {
    const entries = getCurriculumEntriesForLevel("B2");
    const days = Object.fromEntries(
      entries.filter((entry) => entry.day >= 8 && entry.day <= 12).map((entry) => [entry.day, entry])
    );

    expect(days[8].topic).toBe("Reisen und Mobilität");
    expect(days[9].topic).toBe("Wohnen und Nachbarschaft");
    expect(days[10].topic).toBe("Konsum und Geld");
    expect(days[11].topic).toBe("Gesellschaft und Integration");
    expect(days[12].topic).toBe("Kultur und Freizeit");
  });

  it("does not modify other levels or B2 days outside the batch", () => {
    const a1 = { level: "A1", day: 8, title: "Countries and Languages" };
    const b2Day7 = { level: "B2", day: 7, title: "Gesellschaftliche Vielfalt" };
    expect(alignB2CurriculumEntry(a1)).toBe(a1);
    expect(alignB2CurriculumEntry(b2Day7)).toBe(b2Day7);
  });
});

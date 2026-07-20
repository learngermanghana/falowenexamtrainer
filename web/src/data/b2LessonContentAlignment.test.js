import {
  B2_LESSON_CONTENT_ALIGNMENT,
  alignB2CurriculumEntry,
  getB2LessonContentAlignment,
} from "./b2LessonContentAlignment";
import { getCurriculumEntriesForLevel } from "./curriculumManifest";

describe("B2 lesson content alignment", () => {
  it.each([
    [8, "2.3", "Reisen und Mobilität", "Vergleiche und Abwägung"],
    [9, "2.4", "Wohnen und Nachbarschaft", "Höfliche Beschwerden"],
    [10, "2.5", "Konsum und Geld", "Zweiteilige Konnektoren"],
    [11, "3.1", "Gesellschaft und Integration", "Konjunktiv II"],
    [12, "3.2", "Kultur und Freizeit", "Temporale Nebensätze"],
    [13, "3.3", "Familie und Generationen", "Ursache, Gegensatz und Folge"],
    [14, "3.4", "Freundschaft und soziale Beziehungen", "Relativsätze"],
    [15, "3.5", "Ernährung und Konsumverhalten", "Konzessive und alternative Strukturen"],
    [16, "4.1", "Digitalisierung im Alltag", "Passiv und Nominalisierung"],
    [17, "4.2", "Mobilität und Stadtleben", "lokale Präpositionen"],
    [18, "4.3", "Natur, Klima und Verantwortung", "Konditionale und konsekutive Sätze"],
    [19, "4.4", "Freiwilligenarbeit und Engagement", "Finale und kausale Strukturen"],
    [20, "4.5", "Technologie und Arbeit der Zukunft", "Passiv mit Modalverben"],
    [21, "5.1", "Migration und neue Lebenswege", "Konzessive Nebensätze"],
    [22, "5.2", "Demokratie und Mitbestimmung", "Gegenargumenten"],
    [23, "5.3", "Work-Life-Balance", "Je ... desto"],
    [24, "5.4", "Wissenschaft und Forschung im Alltag", "Nominalisierung"],
    [25, "5.5", "Nachhaltiger Konsum", "Partizipialattribute"],
    [26, "6.1", "Behörden, Termine und formelle Kommunikation", "Formelle E-Mail-Struktur"],
    [27, "6.2", "Prüfungstraining: Argumentieren und Reagieren", "Redemittel"],
    [28, "6.3", "Review und persönlicher Fortschritt", "Wiederholung"],
  ])("aligns Day %i to the active lesson", (day, chapter, title, grammar) => {
    expect(getB2LessonContentAlignment(day)).toEqual(
      expect.objectContaining({ day, chapter, title })
    );
    expect(B2_LESSON_CONTENT_ALIGNMENT[day].grammar_topic).toContain(grammar);
  });

  it("preserves assignment identity and submission fields", () => {
    const original = {
      level: "B2",
      day: 13,
      chapter: "3.3",
      title: "Reisen und Mobilität",
      assignmentId: "B2-3.3",
      assignment_id: "B2-3.3",
      submissionRequired: true,
      progressionEligible: true,
    };

    expect(alignB2CurriculumEntry(original)).toEqual(
      expect.objectContaining({
        title: "Familie und Generationen",
        topic: "Familie und Generationen",
        assignmentId: "B2-3.3",
        assignment_id: "B2-3.3",
        submissionRequired: true,
        progressionEligible: true,
      })
    );
  });

  it("exports aligned B2 curriculum entries to the Course Book schedule", () => {
    const entries = getCurriculumEntriesForLevel("B2");
    const days = Object.fromEntries(
      entries.filter((entry) => entry.day >= 13 && entry.day <= 28).map((entry) => [entry.day, entry])
    );

    expect(days[13].topic).toBe("Familie und Generationen");
    expect(days[14].topic).toBe("Freundschaft und soziale Beziehungen");
    expect(days[15].topic).toBe("Ernährung und Konsumverhalten");
    expect(days[16].topic).toBe("Digitalisierung im Alltag");
    expect(days[20].topic).toBe("Technologie und Arbeit der Zukunft");
    expect(days[24].topic).toBe("Wissenschaft und Forschung im Alltag");
    expect(days[28].topic).toBe("Review und persönlicher Fortschritt");
  });

  it("does not modify other levels or B2 days outside the aligned range", () => {
    const a1 = { level: "A1", day: 13, title: "Revision" };
    const b2Day7 = { level: "B2", day: 7, title: "Gesellschaftliche Vielfalt" };
    expect(alignB2CurriculumEntry(a1)).toBe(a1);
    expect(alignB2CurriculumEntry(b2Day7)).toBe(b2Day7);
  });
});

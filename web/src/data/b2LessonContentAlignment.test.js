import {
  B2_LESSON_CONTENT_ALIGNMENT,
  alignB2CurriculumEntry,
  getB2LessonContentAlignment,
} from "./b2LessonContentAlignment";
import { getCurriculumEntriesForLevel } from "./curriculumManifest";
import { courseSchedules } from "./courseSchedule";
import { SELF_LEARNING_LESSONS } from "../components/SelfLearningLessonRegistry";

const EXPECTED_LESSONS = [
  [8, "2.3", "Reisen und Mobilität", "Vergleiche und Abwägung"],
  [9, "2.4", "Wohnen und Nachbarschaft", "Höfliche Beschwerden"],
  [10, "2.5", "Konsum und Geld", "Zweiteilige Konnektoren"],
  [11, "3.1", "Gesellschaft und Integration", "Konjunktiv II"],
  [12, "3.2", "Kultur und Freizeit", "Temporale Nebensätze"],
  [13, "3.3", "Familie und Generationen", "Ursache, Gegensatz und Folge"],
  [14, "3.4", "Freundschaft und soziale Beziehungen", "Relativsätze"],
  [15, "3.5", "Ernährung und Konsumverhalten", "Konzessive und alternative Strukturen"],
  [16, "4.1", "Digitalisierung im Alltag", "Passiv und Nominalisierung"],
  [17, "4.2", "Mobilität und Stadtleben", "Vergleiche und lokale Präpositionen"],
  [18, "4.3", "Natur, Klima und Verantwortung", "Konditionale und konsekutive Sätze"],
  [19, "4.4", "Freiwilligenarbeit und Engagement", "Finale und kausale Strukturen"],
  [20, "4.5", "Technologie und Arbeit der Zukunft", "Passiv mit Modalverben und Zukunftsformen"],
  [21, "5.1", "Migration und neue Lebenswege", "Temporale und kausale Strukturen"],
  [22, "5.2", "Demokratie und Mitbestimmung", "Meinung und indirekte Rede"],
  [23, "5.3", "Work-Life-Balance", "Konzessive und finale Strukturen"],
  [24, "5.4", "Wissenschaft und Forschung im Alltag", "Passiv und Nominalisierung"],
  [25, "5.5", "Nachhaltiger Konsum", "Adjektivdeklination und Vergleichsformen"],
  [26, "6.1", "Behörden, Termine und formelle Kommunikation", "Formelle Sprache und indirekte Fragen"],
  [27, "6.2", "Prüfungstraining: Argumentieren und Reagieren", "Argumentieren und Reagieren"],
  [28, "6.3", "Review und persönlicher Fortschritt", "Review: Verknüpfungen"],
];

describe("B2 Days 8-28 lesson content alignment", () => {
  it.each(EXPECTED_LESSONS)(
    "aligns Day %i to the active self-learning lesson",
    (day, chapter, title, grammar) => {
      expect(getB2LessonContentAlignment(day)).toEqual(
        expect.objectContaining({ day, chapter, title }),
      );
      expect(B2_LESSON_CONTENT_ALIGNMENT[day].grammar_topic).toContain(grammar);
    },
  );

  it("preserves assignment identity and submission fields", () => {
    const original = {
      level: "B2",
      day: 14,
      chapter: "3.4",
      title: "Wohnen und Zusammenleben",
      assignmentId: "B2-3.4",
      assignment_id: "B2-3.4",
      submissionRequired: true,
      progressionEligible: true,
    };

    expect(alignB2CurriculumEntry(original)).toEqual(
      expect.objectContaining({
        title: "Freundschaft und soziale Beziehungen",
        topic: "Freundschaft und soziale Beziehungen",
        assignmentId: "B2-3.4",
        assignment_id: "B2-3.4",
        submissionRequired: true,
        progressionEligible: true,
      }),
    );
  });

  it("exports aligned B2 curriculum entries for every active fallback lesson", () => {
    const entries = getCurriculumEntriesForLevel("B2");
    const days = Object.fromEntries(
      entries
        .filter((entry) => entry.day >= 8 && entry.day <= 28)
        .map((entry) => [entry.day, entry]),
    );

    EXPECTED_LESSONS.forEach(([day, chapter, title]) => {
      expect(days[day]).toEqual(expect.objectContaining({ day, chapter, title, topic: title }));
    });
  });

  it("keeps the Course Book title and the opened self-learning lesson on the same source of truth", () => {
    EXPECTED_LESSONS.forEach(([day, chapter, title]) => {
      const scheduleEntry = courseSchedules.B2.find((entry) => Number(entry?.day) === day);
      const lesson = SELF_LEARNING_LESSONS.B2.find((entry) => Number(entry?.day) === day);
      const alignment = B2_LESSON_CONTENT_ALIGNMENT[day];

      expect(scheduleEntry).toEqual(
        expect.objectContaining({
          day,
          chapter,
          topic: title,
        }),
      );
      expect(lesson).toEqual(
        expect.objectContaining({
          day,
          chapter,
          title,
          topic: alignment.lessonTopic,
        }),
      );
    });
  });

  it("does not modify other levels or B2 days outside the aligned fallback block", () => {
    const a1 = { level: "A1", day: 14, title: "A1 lesson" };
    const b2Day7 = { level: "B2", day: 7, title: "Gesellschaftliche Vielfalt" };
    expect(alignB2CurriculumEntry(a1)).toBe(a1);
    expect(alignB2CurriculumEntry(b2Day7)).toBe(b2Day7);
  });
});

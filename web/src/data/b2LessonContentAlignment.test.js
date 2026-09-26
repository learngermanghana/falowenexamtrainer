import {
  B2_LESSON_CONTENT_ALIGNMENT,
  alignB2CurriculumEntry,
  getB2LessonContentAlignment,
} from "./b2LessonContentAlignment";
import { getCurriculumEntriesForLevel } from "./curriculumManifest";
import { courseSchedules } from "./courseSchedule";
import { SELF_LEARNING_LESSONS } from "../components/SelfLearningLessonRegistry";

const EXPECTED_LESSONS = [
  [1, "1.1", "Umweltschutz im Alltag – Müll vermeiden", "indem / dadurch, dass"],
  [2, "1.2", "Mülltrennung, Recycling und Kreislaufwirtschaft", "Passiv und Modalpassiv"],
  [3, "1.3", "Lebensmittelverschwendung und nachhaltiger Konsum", "je ... desto"],
  [4, "1.4", "Plastik, Verpackungen und bewusster Einkauf", "ohne ... zu / statt ... zu"],
  [5, "1.5", "Nachhaltige Mobilität und öffentlicher Verkehr", "Konjunktiv II"],
  [6, "2.1", "Energie sparen und erneuerbare Energien", "falls / sofern"],
  [7, "2.2", "Klimafreundliches Wohnen und grüne Städte", "Relativsätze mit Präpositionen"],
  [8, "2.3", "Bildungsgerechtigkeit und Zugang zu Bildung", "Passiv und Modalpassiv"],
  [9, "2.4", "Schulpflicht, Leistung und Verantwortung der Schule", "Modalpassiv"],
  [10, "2.5", "Kindergarten und frühkindliche Bildung", "Relativsätze"],
  [11, "3.1", "Digitale Bildung – Unterricht mit und ohne Technologie", "während / wohingegen"],
  [12, "3.2", "Studium, Studiengebühren und lebenslanges Lernen", "zwar ... jedoch"],
  [13, "3.3", "Wissenschaft und Forschung im Alltag", "laut / zufolge / nach Angaben"],
  [14, "3.4", "Wissenschaft, Desinformation und verlässliche Quellen", "indirekte Rede und Quellenangaben"],
  [15, "3.5", "Wohnraummangel, hohe Mieten und soziale Gerechtigkeit", "aufgrund / trotz / obwohl"],
  [16, "4.1", "Stadt oder Land – Lebensqualität und Infrastruktur", "während / wohingegen"],
  [17, "4.2", "Familie, Kinderbetreuung und Vereinbarkeit mit dem Beruf", "um ... zu / damit"],
  [18, "4.3", "Arbeitswelt, Fachkräftemangel und Weiterbildung", "Passiv und Modalpassiv"],
  [19, "4.4", "Homeoffice, ständige Erreichbarkeit und Work-Life-Balance", "obwohl / trotzdem"],
  [20, "4.5", "Soziale Medien, Privatsphäre und öffentliche Identität", "Relativsätze mit Präpositionen"],
  [21, "5.1", "Künstliche Intelligenz in Schule und Universität", "falls / sofern"],
  [22, "5.2", "Künstliche Intelligenz, Automatisierung und Arbeitsplätze", "Passiv und Modalpassiv"],
  [23, "5.3", "Datenschutz, Algorithmen und personalisierte Werbung", "Relativsätze mit Präpositionen"],
  [24, "5.4", "Digitale Gesundheit, Telemedizin und medizinische Technologie", "Passiv und Modalpassiv"],
  [25, "5.5", "Reisen, Massentourismus und nachhaltiger Tourismus", "während / wohingegen"],
  [26, "6.1", "Migration, Integration und Sprache", "obwohl / obgleich / trotz"],
  [27, "6.2", "Gleichstellung, Diskriminierung und gesellschaftlicher Zusammenhalt", "nicht nur ... sondern auch"],
  [28, "6.3", "Gesellschaft im Wandel – B2 Prüfungstraining", "Ursache, Folge, Gegensatz"],
];

describe("B2 Days 1-28 lesson content alignment", () => {
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
        title: "Wissenschaft, Desinformation und verlässliche Quellen",
        topic: "Wissenschaft, Desinformation und verlässliche Quellen",
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
        .filter((entry) => entry.day >= 1 && entry.day <= 28)
        .map((entry) => [entry.day, entry]),
    );

    EXPECTED_LESSONS.forEach(([day, chapter, title]) => {
      expect(days[day]).toEqual(expect.objectContaining({ day, chapter, title, topic: title }));
    });
  });

  it("keeps the Course Book title and the opened self-learning lesson on the same source of truth", () => {
    EXPECTED_LESSONS.forEach(([day, chapter, title]) => {
      const scheduleEntry = courseSchedules.B2.find((entry) => Number(entry?.day) === day);
      const lesson = SELF_LEARNING_LESSONS.B2.filter((entry) => Number(entry?.day) === day).at(-1);
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

  it("does not modify other levels and does align every B2 day", () => {
    const a1 = { level: "A1", day: 14, title: "A1 lesson" };
    expect(alignB2CurriculumEntry(a1)).toBe(a1);

    expect(alignB2CurriculumEntry({ level: "B2", day: 7, title: "old title" })).toEqual(
      expect.objectContaining({
        title: "Klimafreundliches Wohnen und grüne Städte",
        grammar_topic: expect.stringContaining("Relativsätze mit Präpositionen"),
      }),
    );
  });
});

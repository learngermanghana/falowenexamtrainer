import React from "react";
import SelfLearningEditableLessonPageV2 from "./SelfLearningEditableLessonPageV2";
import StandardLessonWritingCoachPage from "./StandardLessonWritingCoachPage";
import B2Day1To4GuidedLessonPage from "./B2Day1To4GuidedLessonPage";
import B2Day7To16GuidedLessonPage from "./B2Day7To16GuidedLessonPage";
import B2Day17To20GuidedLessonPage from "./B2Day17To20GuidedLessonPage";
import B2Day21To24GuidedLessonPage from "./B2Day21To24GuidedLessonPage";
import B2Day25To28GuidedLessonPage from "./B2Day25To28GuidedLessonPage";
import C1Day8To10GuidedLessonPage from "./C1Day8To10GuidedLessonPage";
import C1Day11GoetheSpeakingSelfLearningPage from "./C1Day11GoetheSpeakingSelfLearningPage";
import B1TutorLessonPage from "./B1TutorLessonPage";
import {
  removeTeacherLectureFromCanonicalLesson,
  removeTeacherLectureFromLesson,
} from "./selfLearning/TeacherLectureSupportingMaterials";
import { buildDefaultLesson } from "../data/selfLearningLessons/buildSelfLearningLesson";
import { getLessonRadioResource } from "../data/lessonRadioDictionary";
import { getB1Day5RadioResource } from "../data/b1Day5Media";
import c1Day0Orientation from "../data/selfLearningLessons/c1/day0Orientation";
import c1Day1ZieleUndLernweg from "../data/selfLearningLessons/c1/day1ZieleUndLernweg";
import c1Day2KulturUndIdentitaet from "../data/selfLearningLessons/c1/day2KulturUndIdentitaet";
import c1Day3MedienUndInformationskompetenz from "../data/selfLearningLessons/c1/day3MedienUndInformationskompetenz";
import c1Day4BeziehungenUndTeamarbeit from "../data/selfLearningLessons/c1/day4BeziehungenUndTeamarbeit";
import c1Day5BeruflicheEntwicklung from "../data/selfLearningLessons/c1/day5BeruflicheEntwicklung";
import c1Day6GesundheitUndLebensstil from "../data/selfLearningLessons/c1/day6GesundheitUndLebensstil";
import c1Day7ReisenUndNachhaltigkeit from "../data/selfLearningLessons/c1/day7ReisenUndNachhaltigkeit";
import c1Day8WohnenUndStadtentwicklung from "../data/selfLearningLessons/c1/day8WohnenUndStadtentwicklung";
import c1Day9KonsumUndWerbung from "../data/selfLearningLessons/c1/day9KonsumUndWerbung";
import c1Day10IntegrationUndGesellschaft from "../data/selfLearningLessons/c1/day10IntegrationUndGesellschaft";
import c1Day11EngagementUndEhrenamt from "../data/selfLearningLessons/c1/day11EngagementUndEhrenamt";
import c1Day12FreizeitUndKultur from "../data/selfLearningLessons/c1/day12FreizeitUndKultur";
import c1Day13Mehrsprachigkeit from "../data/selfLearningLessons/c1/day13Mehrsprachigkeit";
import c1Day14InnovationUndZukunft from "../data/selfLearningLessons/c1/day14InnovationUndZukunft";
import c1Day15BildungUndLebenslangesLernen from "../data/selfLearningLessons/c1/day15BildungUndLebenslangesLernen";
import c1Day16TechnologieImAlltag from "../data/selfLearningLessons/c1/day16TechnologieImAlltag";
import b2Day0Orientation from "../data/selfLearningLessons/b2/day0Orientation";
import b2Day1PersoenlicheIdentitaet from "../data/selfLearningLessons/b2/day1PersoenlicheIdentitaet";
import b2Day2AlltagUndZeitmanagement from "../data/selfLearningLessons/b2/day2AlltagUndZeitmanagement";
import b2Day3ArbeitUndBeruf from "../data/selfLearningLessons/b2/day3ArbeitUndBeruf";
import b2Day4BildungUndLernen from "../data/selfLearningLessons/b2/day4BildungUndLernen";
import b2Day5GesundheitUndWohlbefinden from "../data/selfLearningLessons/b2/day5GesundheitUndWohlbefinden";
import b2Day6MigrationUndIntegration from "../data/selfLearningLessons/b2/day6MigrationUndIntegration";
import b2Day7GesellschaftlicheVielfalt from "../data/selfLearningLessons/b2/day7GesellschaftlicheVielfalt";

const c1FallbackLessons = [
  [17, "4.2", "Umwelt und Verantwortung", "Nachhaltigkeit, Klima und persönliches Handeln"],
  [18, "4.3", "Gesellschaft und Zusammenhalt", "Gemeinschaft, Konflikte und Solidarität"],
  [19, "4.4", "Arbeit der Zukunft", "Digitalisierung, neue Kompetenzen und Arbeitsmodelle"],
  [20, "4.5", "Digitale Gesundheit", "Gesundheitsapps, Datenschutz und Chancen"],
  [21, "5.1", "Migration und Teilhabe", "Migrationserfahrungen, Sprache und Chancen"],
  [22, "5.2", "Politik und Mitbestimmung", "Demokratie, Verantwortung und Beteiligung"],
  [23, "5.3", "Freizeit und Work-Life-Balance", "Erholung, Grenzen und Lebensqualität"],
  [24, "5.4", "Mobilität und Infrastruktur", "Verkehr, Planung und öffentlicher Raum"],
  [25, "5.5", "Wissenschaft und Forschung", "Forschung, Fortschritt und gesellschaftlicher Nutzen"],
  [26, "6.1", "Nachhaltiger Konsum", "Kaufverhalten, Ressourcen und Verantwortung"],
  [27, "6.2", "Digitalisierung und Verwaltung", "Online-Services, Bürokratie und Zugang"],
  [28, "6.3", "Review und Transfer", "C1-Themen wiederholen und auf neue Aufgaben übertragen"],
].map(([day, chapter, title, topic]) => buildDefaultLesson({ level: "C1", day, chapter, title, topic }));

const b2FallbackLessons = [
  [8, "2.3", "Reisen und Mobilität", "Transport, Urlaub und nachhaltige Entscheidungen"],
  [9, "2.4", "Wohnen und Nachbarschaft", "Wohnformen, Mietprobleme und Zusammenleben"],
  [10, "2.5", "Konsum und Geld", "Kaufentscheidungen, Budget und Werbung"],
  [11, "3.1", "Gesellschaft und Integration", "Sprache, Teilhabe und Zusammenleben"],
  [12, "3.2", "Kultur und Freizeit", "Hobbys, kulturelle Angebote und persönliche Interessen"],
  [13, "3.3", "Familie und Generationen", "Familienmodelle, Generationenkonflikte und Verantwortung beschreiben"],
  [14, "3.4", "Freundschaft und soziale Beziehungen", "Beziehungen, Vertrauen und soziale Erwartungen erklären"],
  [15, "3.5", "Ernährung und Konsumverhalten", "Essgewohnheiten, gesunde Ernährung und Konsumentscheidungen diskutieren"],
  [16, "4.1", "Digitalisierung im Alltag", "Digitale Werkzeuge, Chancen und Abhängigkeiten bewerten"],
  [17, "4.2", "Mobilität und Stadtleben", "Verkehr, Stadtplanung und Lebensqualität vergleichen"],
  [18, "4.3", "Natur, Klima und Verantwortung", "Klimaschutz, Natur und persönliche Verantwortung erklären"],
  [19, "4.4", "Freiwilligenarbeit und Engagement", "Ehrenamt, gesellschaftliche Hilfe und persönliche Motivation diskutieren"],
  [20, "4.5", "Technologie und Arbeit der Zukunft", "Automatisierung, neue Berufe und berufliche Kompetenzen beschreiben"],
  [21, "5.1", "Migration und neue Lebenswege", "Umzug, Integration und persönliche Chancen erklären"],
  [22, "5.2", "Demokratie und Mitbestimmung", "Beteiligung, Rechte und gesellschaftliche Verantwortung diskutieren"],
  [23, "5.3", "Work-Life-Balance", "Arbeit, Freizeit, Erholung und Grenzen im Alltag erklären"],
  [24, "5.4", "Wissenschaft und Forschung im Alltag", "Forschung, Medizin, Technik und Nutzen für die Gesellschaft beschreiben"],
  [25, "5.5", "Nachhaltiger Konsum", "Kaufverhalten, Ressourcen und Verantwortung kritisch bewerten"],
  [26, "6.1", "Behörden, Termine und formelle Kommunikation", "Formelle Anliegen, Termine und schriftliche Kommunikation trainieren"],
  [27, "6.2", "Prüfungstraining: Argumentieren und Reagieren", "Mündliche und schriftliche B2-Prüfungsstrategien anwenden"],
  [28, "6.3", "Review und persönlicher Fortschritt", "B2-Themen wiederholen, Schwächen erkennen und nächsten Lernplan erstellen"],
].map(([day, chapter, title, topic]) => buildDefaultLesson({ level: "B2", day, chapter, title, topic }));

export const SELF_LEARNING_LESSONS = {
  B2: [
    b2Day0Orientation,
    b2Day1PersoenlicheIdentitaet,
    b2Day2AlltagUndZeitmanagement,
    b2Day3ArbeitUndBeruf,
    b2Day4BildungUndLernen,
    b2Day5GesundheitUndWohlbefinden,
    b2Day6MigrationUndIntegration,
    b2Day7GesellschaftlicheVielfalt,
    ...b2FallbackLessons,
  ],
  C1: [
    c1Day0Orientation,
    c1Day1ZieleUndLernweg,
    c1Day2KulturUndIdentitaet,
    c1Day3MedienUndInformationskompetenz,
    c1Day4BeziehungenUndTeamarbeit,
    c1Day5BeruflicheEntwicklung,
    c1Day6GesundheitUndLebensstil,
    c1Day7ReisenUndNachhaltigkeit,
    c1Day8WohnenUndStadtentwicklung,
    c1Day9KonsumUndWerbung,
    c1Day10IntegrationUndGesellschaft,
    c1Day11EngagementUndEhrenamt,
    c1Day12FreizeitUndKultur,
    c1Day13Mehrsprachigkeit,
    c1Day14InnovationUndZukunft,
    c1Day15BildungUndLebenslangesLernen,
    c1Day16TechnologieImAlltag,
    ...c1FallbackLessons,
  ],
};

const lessonKey = (level, day) => `${String(level || "").toUpperCase()}-${Number(day || 0)}`;

const removeAllDisplayedVideosFromLesson = (lesson = null) => {
  const withoutTeacher = removeTeacherLectureFromLesson(lesson);
  if (!withoutTeacher) return withoutTeacher;
  return {
    ...withoutTeacher,
    videoResource: null,
    resources: {
      ...(withoutTeacher.resources || {}),
      videos: [],
    },
  };
};

const removeAllDisplayedVideosFromCanonicalLesson = (canonicalLesson = null) => {
  const withoutTeacher = removeTeacherLectureFromCanonicalLesson(canonicalLesson);
  if (!withoutTeacher) return withoutTeacher;
  return {
    ...withoutTeacher,
    resources: {
      ...(withoutTeacher.resources || {}),
      videos: [],
    },
  };
};

export const SelfLearningLessonFrame = ({ children }) => children;

const renderSelfLearningPage = ({ level, lesson, canonicalLesson }) => {
  const normalizedLevel = String(level || "").toUpperCase();
  const day = Number(lesson?.day || 0);
  const pageLesson = removeAllDisplayedVideosFromLesson(lesson);
  const pageCanonicalLesson = removeAllDisplayedVideosFromCanonicalLesson(canonicalLesson);

  let page;
  if (day === 0) {
    page = (
      <SelfLearningEditableLessonPageV2
        lesson={pageLesson}
        falowenRadio={null}
      />
    );
  } else if (normalizedLevel === "C1" && day === 11) {
    page = <C1Day11GoetheSpeakingSelfLearningPage />;
  } else if (normalizedLevel === "C1" && day >= 8 && day <= 10) {
    page = <C1Day8To10GuidedLessonPage lesson={pageLesson} canonicalLesson={pageCanonicalLesson} />;
  } else if (normalizedLevel === "B2" && day >= 25 && day <= 28) {
    page = <B2Day25To28GuidedLessonPage lesson={pageLesson} canonicalLesson={pageCanonicalLesson} />;
  } else if (normalizedLevel === "B2" && day >= 21 && day <= 24) {
    page = <B2Day21To24GuidedLessonPage lesson={pageLesson} canonicalLesson={pageCanonicalLesson} />;
  } else if (normalizedLevel === "B2" && day >= 17 && day <= 20) {
    page = <B2Day17To20GuidedLessonPage lesson={pageLesson} canonicalLesson={pageCanonicalLesson} />;
  } else if (normalizedLevel === "B2" && day >= 7 && day <= 16) {
    page = <B2Day7To16GuidedLessonPage lesson={pageLesson} canonicalLesson={pageCanonicalLesson} />;
  } else if (normalizedLevel === "B2" && day >= 1 && day <= 6) {
    page = <B2Day1To4GuidedLessonPage lesson={pageLesson} canonicalLesson={pageCanonicalLesson} />;
  } else {
    page = <StandardLessonWritingCoachPage lesson={pageLesson} canonicalLesson={pageCanonicalLesson} />;
  }

  return (
    <SelfLearningLessonFrame
      level={normalizedLevel}
      day={day}
      lesson={lesson}
      canonicalLesson={canonicalLesson}
    >
      {page}
    </SelfLearningLessonFrame>
  );
};

const componentRegistry = Object.fromEntries(
  Object.entries(SELF_LEARNING_LESSONS).flatMap(([level, lessons]) =>
    lessons.map((lesson) => [
      lessonKey(level, lesson.day),
      ({ canonicalLesson }) => renderSelfLearningPage({ level, lesson, canonicalLesson }),
    ]),
  ),
);

const B1RadioLessonComponent = ({ canonicalLesson }) => (
  <B1TutorLessonPage canonicalLesson={canonicalLesson} />
);

const hasB1Radio = (day) =>
  Boolean(getLessonRadioResource("B1", day) || getB1Day5RadioResource("B1", day));

export const getSelfLearningLessonComponent = (level, day) => {
  const normalizedLevel = String(level || "").toUpperCase();
  const dayNumber = Number(day || 0);
  if (normalizedLevel === "B1" && dayNumber > 0 && hasB1Radio(dayNumber)) {
    return B1RadioLessonComponent;
  }
  return componentRegistry[lessonKey(normalizedLevel, dayNumber)] || null;
};

export default getSelfLearningLessonComponent;

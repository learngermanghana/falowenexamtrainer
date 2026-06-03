import React from "react";
import SelfLearningEditableLessonPageV2 from "./SelfLearningEditableLessonPageV2";
import { buildDefaultLesson } from "../data/selfLearningLessons/buildSelfLearningLesson";
import c1Day1ZieleUndLernweg from "../data/selfLearningLessons/c1/day1ZieleUndLernweg";
import b2Day1PersoenlicheIdentitaet from "../data/selfLearningLessons/b2/day1PersoenlicheIdentitaet";
import b2Day2AlltagUndZeitmanagement from "../data/selfLearningLessons/b2/day2AlltagUndZeitmanagement";
import b2Day3ArbeitUndBeruf from "../data/selfLearningLessons/b2/day3ArbeitUndBeruf";
import b2Day4BildungUndLernen from "../data/selfLearningLessons/b2/day4BildungUndLernen";
import b2Day5GesundheitUndWohlbefinden from "../data/selfLearningLessons/b2/day5GesundheitUndWohlbefinden";
import b2Day6MedienUndDigitaleKommunikation from "../data/selfLearningLessons/b2/day6MedienUndDigitaleKommunikation";

const c1FallbackLessons = [
  [2, "1.2", "Kultur und Identität", "Kulturelle Prägung, Zugehörigkeit und Selbstverständnis"],
  [3, "1.3", "Medien und Informationskompetenz", "Nachrichten, Quellenkritik und digitale Verantwortung"],
  [4, "1.4", "Beziehungen und Teamarbeit", "Kommunikation, Konflikte und Zusammenarbeit"],
  [5, "1.5", "Berufliche Entwicklung", "Karriere, Weiterbildung und berufliche Ziele"],
  [6, "2.1", "Gesundheit und Lebensstil", "Balance, Prävention und gesellschaftliche Gesundheit"],
  [7, "2.2", "Reisen und Nachhaltigkeit", "Mobilität, Tourismus und Verantwortung"],
  [8, "2.3", "Wohnen und Stadtentwicklung", "Wohnraum, Infrastruktur und Lebensqualität"],
  [9, "2.4", "Konsum und Werbung", "Kaufentscheidungen, Werbung und Verantwortung"],
  [10, "2.5", "Integration und Gesellschaft", "Teilhabe, Sprache und gesellschaftlicher Zusammenhalt"],
  [11, "3.1", "Engagement und Ehrenamt", "Freiwilligenarbeit und soziale Verantwortung"],
  [12, "3.2", "Freizeit und Kultur", "Kulturelle Angebote, Erholung und gesellschaftliche Bedeutung"],
  [13, "3.3", "Mehrsprachigkeit", "Sprachenlernen, Identität und Kommunikation"],
  [14, "3.4", "Innovation und Zukunft", "Technologische Entwicklung und gesellschaftlicher Wandel"],
  [15, "3.5", "Bildung und lebenslanges Lernen", "Lernen, Weiterbildung und Chancengleichheit"],
  [16, "4.1", "Technologie im Alltag", "Digitale Werkzeuge, Abhängigkeit und praktische Nutzung"],
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
  [7, "2.2", "Umwelt und Nachhaltigkeit", "Klimaschutz, Konsum und Alltagshandeln"],
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
    b2Day1PersoenlicheIdentitaet,
    b2Day2AlltagUndZeitmanagement,
    b2Day3ArbeitUndBeruf,
    b2Day4BildungUndLernen,
    b2Day5GesundheitUndWohlbefinden,
    b2Day6MedienUndDigitaleKommunikation,
    ...b2FallbackLessons,
  ],
  C1: [c1Day1ZieleUndLernweg, ...c1FallbackLessons],
};

const lessonKey = (level, day) => `${String(level || "").toUpperCase()}-${Number(day || 0)}`;

const componentRegistry = Object.fromEntries(
  Object.entries(SELF_LEARNING_LESSONS).flatMap(([level, lessons]) =>
    lessons.map((lesson) => [lessonKey(level, lesson.day), () => <SelfLearningEditableLessonPageV2 lesson={lesson} />])
  )
);

export const getSelfLearningLessonComponent = (level, day) => componentRegistry[lessonKey(level, day)] || null;

export default getSelfLearningLessonComponent;

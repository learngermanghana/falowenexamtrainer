import React from "react";
import SelfLearningEditableLessonPage from "./SelfLearningEditableLessonPage";
import { buildDefaultLesson } from "../data/selfLearningLessons/buildSelfLearningLesson";
import c1Day1ZieleUndLernweg from "../data/selfLearningLessons/c1/day1ZieleUndLernweg";

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
  [1, "1.1", "Persönliche Identität und Selbstverständnis", "Über sich selbst, Werte und persönliche Entwicklung sprechen"],
  [2, "1.2", "Alltag und Zeitmanagement", "Routinen, Prioritäten und Produktivität beschreiben"],
  [3, "1.3", "Arbeit und Beruf", "Berufliche Erfahrungen, Erwartungen und Zusammenarbeit"],
  [4, "1.4", "Bildung und Lernen", "Lernstrategien, Prüfungen und Weiterbildung"],
  [5, "1.5", "Gesundheit und Wohlbefinden", "Stress, Balance und gesunde Gewohnheiten"],
  [6, "2.1", "Medien und digitale Kommunikation", "Soziale Medien, Datenschutz und Online-Verhalten"],
  [7, "2.2", "Umwelt und Nachhaltigkeit", "Klimaschutz, Konsum und Alltagshandeln"],
  [8, "2.3", "Reisen und Mobilität", "Transport, Urlaub und nachhaltige Entscheidungen"],
  [9, "2.4", "Wohnen und Nachbarschaft", "Wohnformen, Mietprobleme und Zusammenleben"],
  [10, "2.5", "Konsum und Geld", "Kaufentscheidungen, Budget und Werbung"],
  [11, "3.1", "Gesellschaft und Integration", "Sprache, Teilhabe und Zusammenleben"],
  [12, "3.2", "Kultur und Freizeit", "Hobbys, kulturelle Angebote und persönliche Interessen"],
].map(([day, chapter, title, topic]) => buildDefaultLesson({ level: "B2", day, chapter, title, topic }));

export const SELF_LEARNING_LESSONS = {
  B2: b2FallbackLessons,
  C1: [c1Day1ZieleUndLernweg, ...c1FallbackLessons],
};

const lessonKey = (level, day) => `${String(level || "").toUpperCase()}-${Number(day || 0)}`;

const componentRegistry = Object.fromEntries(
  Object.entries(SELF_LEARNING_LESSONS).flatMap(([level, lessons]) =>
    lessons.map((lesson) => [lessonKey(level, lesson.day), () => <SelfLearningEditableLessonPage lesson={lesson} />])
  )
);

export const getSelfLearningLessonComponent = (level, day) => componentRegistry[lessonKey(level, day)] || null;

export default getSelfLearningLessonComponent;

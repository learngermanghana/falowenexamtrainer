import { buildDefaultLesson } from "../buildSelfLearningLesson";
import b2Day1PersoenlicheIdentitaet from "./day1PersoenlicheIdentitaet";
import b2Day2AlltagUndZeitmanagement from "./day2AlltagUndZeitmanagement";
import b2Day3ArbeitUndBeruf from "./day3ArbeitUndBeruf";
import b2Day4BildungUndLernen from "./day4BildungUndLernen";
import b2Day5GesundheitUndWohlbefinden from "./day5GesundheitUndWohlbefinden";
import b2Day6MedienUndDigitaleKommunikation from "./day6MedienUndDigitaleKommunikation";
import b2Day7UmweltUndNachhaltigkeit from "./day7UmweltUndNachhaltigkeit";
import b2Day8ReisenUndMobilitaet from "./day8ReisenUndMobilitaet";
import b2Day9WohnenUndNachbarschaft from "./day9WohnenUndNachbarschaft";
import b2Day10KonsumUndGeld from "./day10KonsumUndGeld";
import b2Day11GesellschaftUndIntegration from "./day11GesellschaftUndIntegration";
import b2Day12KulturUndFreizeit from "./day12KulturUndFreizeit";

const b2FallbackLessons = [
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

export const b2SelfLearningLessons = [
  b2Day1PersoenlicheIdentitaet,
  b2Day2AlltagUndZeitmanagement,
  b2Day3ArbeitUndBeruf,
  b2Day4BildungUndLernen,
  b2Day5GesundheitUndWohlbefinden,
  b2Day6MedienUndDigitaleKommunikation,
  b2Day7UmweltUndNachhaltigkeit,
  b2Day8ReisenUndMobilitaet,
  b2Day9WohnenUndNachbarschaft,
  b2Day10KonsumUndGeld,
  b2Day11GesellschaftUndIntegration,
  b2Day12KulturUndFreizeit,
  ...b2FallbackLessons,
];

export default b2SelfLearningLessons;

import React from "react";
import CurrentDay0OrientationPage from "./CurrentDay0OrientationPage";

const q = (question, options, answer, explanation) => ({ question, options, answer, explanation });

const config = {
  level: "B1",
  subtitle: "Congratulations on starting B1. You are moving from everyday A2 communication to fuller and more independent German.",
  testTitle: "Final A2 Knowledge Test Before B1",
  testIntro: "Complete this A2 readiness check before B1 Day 1. It is a self-check, not a graded B1 assignment.",
  threshold: 70,
  selfLearning: false,
  courseFlow: "Instruction → tutor or AI support → grammar notes → workbook tabs → Submit inside the workbook",
  courseNotes: [
    "Open the Course Book and choose the current B1 day.",
    "B1 workbooks use Teil 1 Sprechen, Teil 2 Schreiben, Teil 3 Lesen, Teil 4 Hören, Ref and Submit.",
    "Teil 1 is speaking preparation and group practice. Prepare opinions, reasons and examples; it is normally not submitted.",
    "Complete Teil 2, Teil 3 and Teil 4, then submit them through the Submit tab in the same workbook.",
    "B1 answers must be fuller than A2: state your idea, explain why, add an example and connect sentences clearly.",
  ],
  campusItems: ["Course Book", "Exam File", "Attendance", "Class Members", "Vocab Practice", "Results", "Account"],
  nextLink: "/campus/course/lesson/B1/1",
  nextLabel: "Open B1 Day 1",
  questions: [
    q("Choose the correct sentence with weil.", ["Ich bleibe zu Hause, weil ich krank bin.", "Ich bleibe zu Hause, weil bin ich krank.", "Ich bleibe zu Hause, weil ich bin krank."], 0, "Weil sends the conjugated verb to the end."),
    q("Choose the correct sentence with dass.", ["Ich glaube, dass der Kurs hilfreich ist.", "Ich glaube, dass ist der Kurs hilfreich.", "Ich glaube, dass der Kurs ist hilfreich."], 0, "Dass introduces a subordinate clause, so the verb comes last."),
    q("Choose the correct sentence with obwohl.", ["Obwohl ich müde bin, lerne ich weiter.", "Obwohl ich bin müde, lerne ich weiter.", "Obwohl müde ich bin, lerne ich weiter."], 0, "The verb comes last in the obwohl-clause."),
    q("Choose the correct sentence with deshalb.", ["Ich habe morgen eine Prüfung, deshalb lerne ich heute.", "Ich habe morgen eine Prüfung, deshalb ich lerne heute.", "Ich habe morgen eine Prüfung, deshalb heute ich lerne."], 0, "After deshalb, the verb comes directly after the connector."),
    q("Choose the correct indirect question.", ["Ich weiß nicht, ob er heute kommt.", "Ich weiß nicht, ob kommt er heute.", "Ich weiß nicht, er ob heute kommt."], 0, "Ob sends the verb to the end."),
    q("Choose the correct Perfekt sentence.", ["Wir sind gestern nach Kumasi gefahren.", "Wir haben gestern nach Kumasi gefahren.", "Wir sind gestern nach Kumasi fahren."], 0, "Fahren normally uses sein when it describes movement."),
    q("Choose the correct Präteritum sentence.", ["Als Kind hatte ich viel Zeit.", "Als Kind habe ich viel Zeit hatte.", "Als Kind hatten ich viel Zeit."], 0, "The Präteritum form of haben for ich is hatte."),
    q("Choose the correct past modal sentence.", ["Ich musste gestern lange arbeiten.", "Ich muss gestern lange arbeiten.", "Ich gemusst gestern lange arbeiten."], 0, "Musste is the correct past form of müssen for ich."),
    q("Choose the correct reflexive sentence.", ["Ich interessiere mich für Musik.", "Ich interessiere mir für Musik.", "Ich mich interessiere für Musik."], 0, "Sich interessieren uses mich with ich."),
    q("Which sentence describes a fixed location?", ["Das Bild hängt an der Wand.", "Das Bild hängt an die Wand.", "Das Bild hängt auf die Wand."], 0, "A fixed location answers wo? and uses the dative."),
    q("Which sentence describes movement?", ["Ich hänge das Bild an die Wand.", "Ich hänge das Bild an der Wand.", "Ich hänge das Bild bei der Wand."], 0, "Movement answers wohin? and uses the accusative."),
    q("Choose the correct dative sentence.", ["Ich fahre mit dem Bus zur Arbeit.", "Ich fahre mit den Bus zur Arbeit.", "Ich fahre mit der Bus zur Arbeit."], 0, "Mit always takes the dative."),
    q("Choose the correct comparative sentence.", ["Deutsch ist leichter als Mathematik.", "Deutsch ist mehr leicht als Mathematik.", "Deutsch ist am leichter als Mathematik."], 0, "The comparative is leichter and comparisons use als."),
    q("Choose the correct relative clause.", ["Das ist der Mann, der mir geholfen hat.", "Das ist der Mann, die mir geholfen hat.", "Das ist der Mann, der hat mir geholfen."], 0, "Der refers to der Mann and the verb comes last."),
    q("Choose the correct purpose clause.", ["Ich lerne jeden Tag, um die Prüfung zu bestehen.", "Ich lerne jeden Tag, um zu die Prüfung bestehen.", "Ich lerne jeden Tag, um die Prüfung bestehen zu."], 0, "Um ... zu expresses purpose with the same subject."),
  ],
};

export default function B1Day0OrientationKnowledgeTestWorkbookPage() {
  return <CurrentDay0OrientationPage config={config} />;
}

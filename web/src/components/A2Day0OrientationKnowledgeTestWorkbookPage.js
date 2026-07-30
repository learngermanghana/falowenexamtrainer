import React from "react";
import CurrentDay0OrientationPage from "./CurrentDay0OrientationPage";

const q = (question, options, answer, explanation) => ({ question, options, answer, explanation });

const config = {
  level: "A2",
  subtitle: "Congratulations on moving to A2. Day 0 checks your A1 foundation and explains the current Falowen workflow.",
  testTitle: "Final A1 Knowledge Test Before A2",
  testIntro: "Use the corrections to identify A1 topics to revise before Day 1.",
  threshold: 70,
  selfLearning: false,
  courseFlow: "Falowen Radio → instruction and lesson material → workbook tabs → Submit inside the same workbook",
  courseNotes: [
    "Open the Course Book and choose the current day.",
    "Listen to Falowen Radio first and select Continue before starting the lesson and workbook tabs.",
    "A2 workbooks normally show Teil 1 Sprechen, Teil 2 Schreiben, Teil 3 Lesen, Teil 4 Hören, Ref and Submit.",
    "Prepare Teil 1 for class practice. Complete and submit Teil 2, Teil 3 and Teil 4.",
    "Use the Submit tab in the same workbook; the correct assignment is selected automatically.",
    "Do not use old external submission links or look for a separate student submission page.",
  ],
  campusItems: ["Course Book", "Exam File", "Attendance", "Class Members", "Vocab Practice", "Results", "Account"],
  nextLink: "/campus/course",
  nextLabel: "Open A2 Course Book",
  questions: [
    q("Choose the correct statement.", ["Ich lerne jeden Tag Deutsch.", "Ich jeden Tag lerne Deutsch.", "Ich Deutsch jeden Tag lerne."], 0, "The conjugated verb is in position 2."),
    q("Choose the correct W-question.", ["Wo du wohnst?", "Wo wohnst du?", "Wo du bist wohnst?"], 1, "Use question word + verb + subject."),
    q("Choose the correct yes/no question.", ["Du hast heute Zeit?", "Hast du heute Zeit?", "Heute du hast Zeit?"], 1, "Yes/no questions begin with the verb."),
    q("Choose the correct modal sentence.", ["Ich muss morgen arbeiten.", "Ich muss arbeite morgen.", "Ich morgen arbeiten muss."], 0, "The second verb stays in the infinitive at the end."),
    q("Choose the correct separable verb sentence.", ["Ich stehe um sieben Uhr auf.", "Ich aufstehe um sieben Uhr.", "Ich stehe auf um sieben Uhr."], 0, "The prefix moves to the end of the main clause."),
    q("Choose the correct accusative article.", ["Ich kaufe der Apfel.", "Ich kaufe den Apfel.", "Ich kaufe dem Apfel."], 1, "The masculine accusative article is den."),
    q("Choose the correct Perfekt sentence.", ["Ich habe gestern gelernt.", "Ich bin gestern gelernt.", "Ich habe gestern lernen."], 0, "Lernen uses haben + gelernt."),
    q("Choose the correct sentence with weil.", ["Ich lerne Deutsch, weil ich arbeiten möchte.", "Ich lerne Deutsch, weil möchte ich arbeiten.", "Ich lerne Deutsch, weil ich möchte arbeiten."], 0, "The verb comes at the end of a weil-clause."),
    q("Choose an informal greeting.", ["Sehr geehrte Damen und Herren,", "Hallo Anna,", "Mit freundlichen Grüßen"], 1, "Hallo Anna is an informal greeting."),
    q("Choose an informal closing.", ["Liebe Grüße", "Sehr geehrte Frau Meier", "Betreff"], 0, "Liebe Grüße is a common informal closing."),
  ],
};

export default function A2Day0OrientationKnowledgeTestWorkbookPage() {
  return <CurrentDay0OrientationPage config={config} />;
}

import React from "react";
import CurrentDay0OrientationPage from "./CurrentDay0OrientationPage";

const q = (question, options, answer, explanation) => ({ question, options, answer, explanation });

const config = {
  level: "B2",
  subtitle: "Congratulations on starting B2 self-learning. Day 0 checks your B1 foundation and explains the current independent-learning flow.",
  testTitle: "Final B1 Knowledge Test Before B2",
  testIntro: "Use the result to identify grammar, writing and argumentation areas to revise before B2 Day 1.",
  threshold: 70,
  selfLearning: true,
  courseFlow: "Course Book → Falowen Radio → Learn → Speak → Write → Finish → record confidence honestly",
  courseNotes: [
    "B2 is a self-learning track. Start every study session from the Course Book instead of waiting for a live class.",
    "Listen to Falowen Radio first and select Continue to open Learn, Speak, Write and Finish.",
    "Use Learn to understand the topic, useful language and grammar focus.",
    "Use Speak and Write for active production, then improve your work with Falowen AI feedback.",
    "Use Finish for reading, listening, vocabulary and lesson completion.",
    "The normal daily B2 flow does not use tutor assignment submission. Mark your confidence only after real practice.",
  ],
  campusItems: ["Course Book", "Vocab Practice", "Results", "Account"],
  nextLink: "/campus/course/lesson/B2/1",
  nextLabel: "Open B2 Day 1",
  questions: [
    q("Choose the correct sentence with obwohl.", ["Obwohl war die Aufgabe schwierig, habe ich sie beendet.", "Obwohl die Aufgabe schwierig war, habe ich sie beendet.", "Obwohl die Aufgabe schwierig war, ich habe sie beendet."], 1, "The subordinate-clause verb comes last and the main clause begins with the verb."),
    q("Choose the correct passive sentence.", ["Die Aufgabe wird morgen erklären.", "Die Aufgabe ist morgen erklärt werden.", "Die Aufgabe wird morgen erklärt."], 2, "The present passive uses werden plus the past participle."),
    q("Choose the correct Konjunktiv II sentence.", ["Wenn ich mehr Zeit hätte, würde ich öfter lesen.", "Wenn ich mehr Zeit habe, würde ich öfter gelesen.", "Wenn hätte ich mehr Zeit, ich würde öfter lesen."], 0, "A hypothetical condition can use hätte and würde plus infinitive."),
    q("Choose the correct relative clause.", ["Das ist die Kollegin, mit die ich arbeite.", "Das ist die Kollegin, mit der ich arbeite.", "Das ist die Kollegin, mit der arbeite ich."], 1, "Mit takes the dative and the verb comes last."),
    q("Choose the balanced comparison.", ["Einerseits Homeoffice bietet Flexibilität, andererseits der Kontakt kann fehlen.", "Einerseits bietet Homeoffice Flexibilität, andererseits fehlen kann der Kontakt.", "Einerseits bietet Homeoffice Flexibilität, andererseits kann der Kontakt fehlen."], 2, "Einerseits ... andererseits uses normal main-clause word order."),
    q("Which response gives an opinion and reason?", ["Meiner Meinung nach ist Weiterbildung wichtig, weil sie neue Chancen eröffnet.", "Weiterbildung gut.", "Ich Meinung Weiterbildung wichtig."], 0, "A developed response states an opinion and supports it."),
    q("Which structure is best for an opinion text?", ["Conclusion → greeting → one word", "Introduction → reasons and examples → contrast → conclusion", "Only disconnected sentences"], 1, "A clear text needs developed arguments and a conclusion."),
    q("Choose the correct indirect question.", ["Ich möchte wissen, wann beginnt der Kurs.", "Ich möchte wissen, der Kurs wann beginnt.", "Ich möchte wissen, wann der Kurs beginnt."], 2, "The verb comes last in an indirect question."),
    q("What should you do after AI feedback?", ["Revise your own answer and try again", "Copy without reading", "Mark the lesson complete immediately"], 0, "B2 self-learning depends on active correction."),
    q("When should you record high confidence?", ["Before opening the lesson", "After completing and understanding the main practice", "Whenever you want to skip the task"], 1, "Confidence should reflect real learning and practice."),
  ],
};

export default function B2Day0SelfLearningOrientationWorkbookPage() {
  return <CurrentDay0OrientationPage config={config} />;
}

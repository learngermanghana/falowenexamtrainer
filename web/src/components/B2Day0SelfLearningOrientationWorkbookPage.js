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
  courseFlow: "Course Book → Learn → Speak → Write → Finish → record confidence honestly",
  courseNotes: [
    "B2 is a self-learning track. Start every study session from the Course Book instead of waiting for a live class.",
    "Use Learn to understand the topic, useful language and grammar focus.",
    "Use Speak and Write for active production, then improve your work with Falowen AI feedback.",
    "Use Finish for reading, listening, vocabulary and lesson completion.",
    "The normal daily B2 flow does not use tutor assignment submission. Mark your confidence only after real practice.",
  ],
  campusItems: ["Course Book", "Vocab Practice", "Results", "Account"],
  nextLink: "/campus/course/lesson/B2/1",
  nextLabel: "Open B2 Day 1",
  questions: [
    q("Choose the correct sentence with obwohl.", ["Obwohl die Aufgabe schwierig war, habe ich sie beendet.", "Obwohl war die Aufgabe schwierig, habe ich sie beendet.", "Obwohl die Aufgabe schwierig war, ich habe sie beendet."], 0, "The subordinate-clause verb comes last and the main clause begins with the verb."),
    q("Choose the correct passive sentence.", ["Die Aufgabe wird morgen erklärt.", "Die Aufgabe wird morgen erklären.", "Die Aufgabe ist morgen erklärt werden."], 0, "The present passive uses werden plus the past participle."),
    q("Choose the correct Konjunktiv II sentence.", ["Wenn ich mehr Zeit hätte, würde ich öfter lesen.", "Wenn ich mehr Zeit habe, würde ich öfter gelesen.", "Wenn hätte ich mehr Zeit, ich würde öfter lesen."], 0, "A hypothetical condition can use hätte and würde plus infinitive."),
    q("Choose the correct relative clause.", ["Das ist die Kollegin, mit der ich arbeite.", "Das ist die Kollegin, mit die ich arbeite.", "Das ist die Kollegin, mit der arbeite ich."], 0, "Mit takes the dative and the verb comes last."),
    q("Choose the balanced comparison.", ["Einerseits bietet Homeoffice Flexibilität, andererseits kann der Kontakt fehlen.", "Einerseits Homeoffice bietet Flexibilität, andererseits der Kontakt kann fehlen.", "Einerseits bietet Homeoffice Flexibilität, andererseits fehlen kann der Kontakt."], 0, "Einerseits ... andererseits uses normal main-clause word order."),
    q("Which response gives an opinion and reason?", ["Meiner Meinung nach ist Weiterbildung wichtig, weil sie neue Chancen eröffnet.", "Weiterbildung gut.", "Ich Meinung Weiterbildung wichtig."], 0, "A developed response states an opinion and supports it."),
    q("Which structure is best for an opinion text?", ["Introduction → reasons and examples → contrast → conclusion", "Conclusion → greeting → one word", "Only disconnected sentences"], 0, "A clear text needs developed arguments and a conclusion."),
    q("Choose the correct indirect question.", ["Ich möchte wissen, wann der Kurs beginnt.", "Ich möchte wissen, wann beginnt der Kurs.", "Ich möchte wissen, der Kurs wann beginnt."], 0, "The verb comes last in an indirect question."),
    q("What should you do after AI feedback?", ["Revise your own answer and try again", "Copy without reading", "Mark the lesson complete immediately"], 0, "B2 self-learning depends on active correction."),
    q("When should you record high confidence?", ["After completing and understanding the main practice", "Before opening the lesson", "Whenever you want to skip the task"], 0, "Confidence should reflect real learning and practice."),
  ],
};

export default function B2Day0SelfLearningOrientationWorkbookPage() {
  return <CurrentDay0OrientationPage config={config} />;
}

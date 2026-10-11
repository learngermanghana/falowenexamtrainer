import { classifyStudyBuddyTurn, studyBuddyFollowupInstructions, getStudyBuddyPracticeActions } from "./studyBuddyFollowups";

const history = [
  { role: "user", content: "Explain kein and nicht" },
  { role: "assistant", content: "Use kein with certain nouns and nicht with adjectives or verbs." },
];
test("recognises short questions as follow-ups to the preceding explanation", () => {
  expect(classifyStudyBuddyTurn("Why?", history).intent).toBe("clarify_followup");
  expect(classifyStudyBuddyTurn("Explain again, simpler", history).previousStudent).toBe("Explain kein and nicht");
  expect(studyBuddyFollowupInstructions({ message: "Why?", history })).toContain("resolve pronouns");
});
test("continues exercises and checks attempted answers", () => {
  expect(classifyStudyBuddyTurn("Give me another example", history).intent).toBe("more_examples");
  expect(classifyStudyBuddyTurn("Quiz me", history).intent).toBe("guided_practice");
  expect(classifyStudyBuddyTurn("My answer is kein", history).intent).toBe("check_answer");
});
test("allows topic changes and does not fabricate prior context", () => {
  expect(classifyStudyBuddyTurn("new topic: Perfekt", history).intent).toBe("new_question");
  expect(classifyStudyBuddyTurn("Why?", []).intent).toBe("new_question");
});
const exercise = [{ role: "user", content: "Quiz me on kein" }, { role: "assistant", content: "Choose: Ich habe ___ Auto. A: kein, B: nicht. Your answer?" }];
test.each(["A", "kein", "Ich habe kein Auto.", "no"])("grades bare exercise answer %s", (answer) => expect(classifyStudyBuddyTurn(answer, exercise).intent).toBe("check_answer"));
test.each(["Why does gehen use sein in the Perfekt?", "Warum benutzt gehen sein im Perfekt?", "Wieso steht das Verb am Ende?"])("recognises new question %s", (question) => {
  expect(classifyStudyBuddyTurn(question, history)).toEqual({ intent: "new_question", previousStudent: "" });
  expect(classifyStudyBuddyTurn(question, exercise).intent).toBe("new_question");
});
test("does not reuse stale exercises", () => {
  expect(classifyStudyBuddyTurn("kein", [...exercise, { role: "user", content: "Where are results?" }, { role: "assistant", content: "Open Results. Need help?" }]).intent).toBe("new_question");
  expect(classifyStudyBuddyTurn("A", history).intent).toBe("new_question");
  expect(classifyStudyBuddyTurn("Why is that?", exercise).intent).toBe("clarify_followup");
});
test("practice controls preserve or advance the exercise", () => {
  expect(classifyStudyBuddyTurn("Try again", exercise).intent).toBe("retry_practice");
  expect(studyBuddyFollowupInstructions({ message: "Explain this exercise", history: exercise })).toContain("repeat the same exercise");
  expect(studyBuddyFollowupInstructions({ message: "Next practice question", history: exercise })).toContain("exactly ONE new question");
});

test.each(["A?", "kein?", "42?"])("preserves uncertain answer %s", answer => {
  expect(classifyStudyBuddyTurn(answer, exercise).intent).toBe("check_answer");
});
test.each([
  "Open Course Book: https://www.falowen.app/campus/course. Choose your level and lesson there.",
  "Complete your profile to continue.",
  "It is your turn to open Billing.",
  "The word __kein__ negates nouns.",
  "Which topic would you like to practise?",
])("does not treat ordinary prose as an exercise: %s", content => {
  const dialogue = [{ role: "user", content: "Quiz me" }, { role: "assistant", content }];
  expect(getStudyBuddyPracticeActions(dialogue)).toEqual([]);
  expect(classifyStudyBuddyTurn("A?", dialogue).intent).toBe("new_question");
});
test.each(["Translate: 'I have a car.'", "Your answer?", "Choose the correct word. A) kein B) nicht", "Ergänze: Ich habe ___ Auto."])("recognises structured exercise %s", content => {
  const dialogue = [{ role: "user", content: "Help me learn" }, { role: "assistant", content }];
  expect(getStudyBuddyPracticeActions(dialogue)).toHaveLength(3);
  expect(classifyStudyBuddyTurn("kein?", dialogue).intent).toBe("check_answer");
});

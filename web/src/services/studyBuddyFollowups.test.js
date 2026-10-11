import { classifyStudyBuddyTurn, studyBuddyFollowupInstructions } from "./studyBuddyFollowups";

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

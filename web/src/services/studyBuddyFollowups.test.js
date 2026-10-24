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

test.each([
  "How do you say ‘car’ in German?",
  "Which word is correct here?",
  "Great! What is the plural of Auto?",
  "1. Wie heißt ‘car’ auf Deutsch?",
])("recognises direct quiz question: %s", content => {
  const dialogue = [{ role: "user", content: "Quiz me on German vocabulary" }, { role: "assistant", content }];
  expect(getStudyBuddyPracticeActions(dialogue)).toHaveLength(3);
  expect(classifyStudyBuddyTurn("Auto", dialogue).intent).toBe("check_answer");
  expect(classifyStudyBuddyTurn("Auto?", dialogue).intent).toBe("check_answer");
});
test.each(["Hint?", "Help?", "Again?", "Correct?", "Really?", "Hilfe?", "Tipp?"])("keeps short help request %s as clarification", message => {
  expect(classifyStudyBuddyTurn(message, exercise).intent).toBe("clarify_followup");
  expect(classifyStudyBuddyTurn(message.replace("?", ""), exercise).intent).toBe("clarify_followup");
});
test.each(["What topic would you like to practise?", "Which level should we practise?", "What language do you want?", "How do you want to pay?"])("does not activate practice for setup or support: %s", content => {
  const dialogue = [{ role: "user", content: "Quiz me" }, { role: "assistant", content }];
  expect(getStudyBuddyPracticeActions(dialogue)).toEqual([]);
});
test("does not reuse an older practice request for a later question", () => {
  const dialogue = [...exercise, { role: "user", content: "Where are lessons?" }, { role: "assistant", content: "Which lesson do you want to open?" }];
  expect(getStudyBuddyPracticeActions(dialogue)).toEqual([]);
  expect(classifyStudyBuddyTurn("Auto?", dialogue).intent).toBe("new_question");
});

test.each(["Hint?", "Help?", "Why?", "Explain this exercise"])("retains direct quiz through %s and its hint", help => {
  const dialogue = [
    { role: "user", content: "Quiz me" },
    { role: "assistant", content: "How do you say ‘car’ in German?" },
    { role: "user", content: help },
    { role: "assistant", content: "Hint: it begins with A. How do you say ‘car’ in German?" },
  ];
  expect(getStudyBuddyPracticeActions(dialogue)).toHaveLength(3);
  expect(classifyStudyBuddyTurn("Auto", dialogue).intent).toBe("check_answer");
  expect(studyBuddyFollowupInstructions({ message: "Auto", history: dialogue })).toContain("Active exercise:");
});
test("keeps exercise through feedback and a hint without repetition", () => {
  const dialogue = [
    { role: "user", content: "Quiz me" },
    { role: "assistant", content: "What is the plural of Auto?" },
    { role: "user", content: "Auton" },
    { role: "assistant", content: "Not quite. Try again." },
    { role: "user", content: "Hint?" },
    { role: "assistant", content: "Add s to this noun." },
  ];
  expect(getStudyBuddyPracticeActions(dialogue)).toHaveLength(3);
  expect(classifyStudyBuddyTurn("Autos?", dialogue).intent).toBe("check_answer");
});
test.each(["Eine Übung, bitte", "Übung", "Gib mir Übungen"])("recognises German practice request %s", request => {
  expect(classifyStudyBuddyTurn(request, history).intent).toBe("guided_practice");
  const dialogue = [{ role: "user", content: request }, { role: "assistant", content: "Wie heißt ‘car’ auf Deutsch?" }];
  expect(getStudyBuddyPracticeActions(dialogue)).toHaveLength(3);
  expect(classifyStudyBuddyTurn("Auto", dialogue).intent).toBe("check_answer");
});
test.each(['What does “Niveau” mean?', 'How do you say “ready” in German?', 'What is the German word for language?', 'What does payment mean?'])("allows setup vocabulary as quiz target: %s", content => {
  const dialogue = [{ role: "user", content: "Quiz me" }, { role: "assistant", content }];
  expect(getStudyBuddyPracticeActions(dialogue)).toHaveLength(3);
  expect(classifyStudyBuddyTurn("bereit", dialogue).intent).toBe("check_answer");
});
test.each(["new topic: Perfekt", "Why does gehen use sein in the Perfekt?", "Where is my Course Book?"])("ends practice for %s", message => {
  const dialogue = [
    { role: "user", content: "Quiz me" }, { role: "assistant", content: "How do you say car in German?" },
    { role: "user", content: "Hint?" }, { role: "assistant", content: "It starts with A." },
    { role: "user", content: message }, { role: "assistant", content: "Here is the explanation." },
  ];
  expect(getStudyBuddyPracticeActions(dialogue)).toEqual([]);
  expect(classifyStudyBuddyTurn("Auto", dialogue).intent).toBe("new_question");
});

test.each(["What would you like to practise?", "What do you want to study?", "What should we learn?", "Was möchtest du üben?"])("does not grade setup response: %s", content => {
  const dialogue = [{ role: "user", content: "Quiz me" }, { role: "assistant", content }];
  expect(getStudyBuddyPracticeActions(dialogue)).toEqual([]);
  expect(classifyStudyBuddyTurn("grammar", dialogue).intent).toBe("new_question");
});
test.each(["Tell me about the dative case", "Let's study Perfekt instead", "Let’s learn the accusative", "Teach me about word order"])("topic command ends retained practice: %s", message => {
  const dialogue = [...exercise, { role: "user", content: "kein" }, { role: "assistant", content: "Correct!" }];
  expect(classifyStudyBuddyTurn(message, dialogue)).toEqual({ intent: "new_question", previousStudent: "" });
  const changed = [...dialogue, { role: "user", content: message }, { role: "assistant", content: "Here is the explanation." }];
  expect(getStudyBuddyPracticeActions(changed)).toEqual([]);
  expect(classifyStudyBuddyTurn("kein", changed).intent).toBe("new_question");
});

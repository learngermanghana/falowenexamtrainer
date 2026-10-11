// Resolve compact learner follow-ups against the current conversation without
// treating every short message as a new lesson or a navigation request.
const recent = (history) => (Array.isArray(history) ? history : [])
  .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string")
  .slice(-10);

const isPracticePrompt = (content) => /\b(?:fill in|complete|choose|translate|your answer|your turn|try this|ergänze|wähle|übersetze|antworte)\b/i.test(content) || /_{2,}/.test(content);

export const getStudyBuddyPracticeActions = (history = []) => {
  const messages = recent(history);
  const latest = messages[messages.length - 1];
  if (latest?.role !== "assistant") return [];
  const prior = messages.slice(0, -1);
  const student = prior[prior.length - 1];
  const feedback = student?.role === "user" && classifyStudyBuddyTurn(student.content, prior.slice(0, -1)).intent === "check_answer";
  const requestedPractice = /\b(?:quiz me|test me|practi[cs]e|exercise|übung)\b/i.test(student?.content || "");
  if (!feedback && !isPracticePrompt(latest.content) && !(requestedPractice && /\?/.test(latest.content))) return [];
  return [
    { label: "Try again", message: "Try again" },
    { label: "Explain this", message: "Explain this exercise" },
    { label: "Next question", message: "Next practice question" },
  ];
};

export const classifyStudyBuddyTurn = (message, history = []) => {
  const text = String(message || "").trim().toLowerCase();
  const messages = recent(history);
  const previousStudent = [...messages].reverse().find((item) => item.role === "user")?.content || "";
  if (!previousStudent) return { intent: "new_question", previousStudent: "" };
  if (/^(?:new topic|change topic|something else|forget that|neues thema)\b/.test(text)) {
    return { intent: "new_question", previousStudent: "" };
  }
  if (/^try again[.!\s]*$/i.test(text)) return { intent: "retry_practice", previousStudent };
  if (/^explain this exercise[.!\s]*$/i.test(text)) return { intent: "explain_practice", previousStudent };
  if (/^next (?:practice )?question[.!\s]*$/i.test(text)) return { intent: "next_practice", previousStudent };
  if (/\b(?:my answer is|i think it is|ich denke|meine antwort|answers?:|1\s*[.)-]\s*\w)/i.test(text)) {
    return { intent: "check_answer", previousStudent };
  }
  if (/\b(?:another example|more examples|one more example|noch ein beispiel|beispiel(?:e)?)\b/i.test(text)) {
    return { intent: "more_examples", previousStudent };
  }
  if (/\b(?:quiz me|test me|questions? to practi[cs]e|exercise|übung|practice questions?)\b/i.test(text)) {
    return { intent: "guided_practice", previousStudent };
  }
  // Only the latest tutor turn can supply an unanswered exercise. An older
  // exercise must not turn replies to a later explanation into answer attempts.
  const latest = messages[messages.length - 1];
  const tutorPrompt = latest?.role === "assistant" ? latest.content : "";
  const practiceRequested = /\b(?:quiz me|test me|practi[cs]e|exercise|übung)\b/i.test(previousStudent);
  const awaitingAnswer = isPracticePrompt(tutorPrompt) || (practiceRequested && /\?/.test(tutorPrompt));
  const asksQuestion = /\?/.test(text) || /^(?:why|how|what|when|where|who|can|could|please|explain|warum|wieso|wie|was|wann|wo|wer|kann)\b/i.test(text);
  if (text && awaitingAnswer && !asksQuestion &&
      !/^(?:okay|ok|again|more|weiter)[.!\s]*$/i.test(text) &&
      !/\b(?:don't understand|don't get it|explain again|simpler|easier|nochmal|einfacher)\b/i.test(text)) {
    return { intent: "check_answer", previousStudent };
  }
  if (/\b(?:i don't understand|don't get it|explain again|simpler|easier|nochmal|einfacher|what do you mean|what about|and the second|question\s*\d+|number\s*\d+|that answer|previous|before)\b/i.test(text) ||
      /^(?:why (?:is that|is it|not|so)|(?:warum|wieso) (?:das|nicht|denn))[?.!\s]*$/i.test(text) ||
      /^(?:why|warum|wieso|how|what|and|but|yes|no|okay|ok|again|more|weiter|und|aber)[?.!\s]*$/i.test(text)) {
    return { intent: "clarify_followup", previousStudent };
  }
  return { intent: "new_question", previousStudent: "" };
};

export const studyBuddyFollowupInstructions = ({ message, history = [] }) => {
  const turn = classifyStudyBuddyTurn(message, history);
  const rules = {
    new_question: "Answer the student's current question, without forcing a connection to an unrelated earlier topic.",
    clarify_followup: "This is a follow-up: resolve pronouns and references such as 'it', 'that', 'question 2' from the recent dialogue. Respond directly to the student's actual confusion before suggesting any new exercise. If ambiguous, ask one concise clarifying question.",
    more_examples: "Continue the last explanation with one or two NEW, level-appropriate German examples; do not repeat the prior explanation verbatim.",
    guided_practice: "Use the current topic to give exactly ONE short practice question at a time. End the exercise with 'Your answer?' so the learner knows to respond. Wait for the learner's answer before grading or revealing solutions.",
    retry_practice: "Repeat the current exercise without revealing its solution. Wait for a new attempted answer. If no exercise is available in the recent dialogue, ask which exercise the student wants to retry.",
    explain_practice: "Explain the rule behind the current exercise with a different example. Then repeat the same exercise and wait for the student to answer; do not switch exercises.",
    next_practice: "Give exactly ONE new question on the current practice topic. Do not reveal its answer. End with 'Your answer?'. Wait for the learner to respond. If no practice topic is available, ask which topic they want to practise.",
    check_answer: "Evaluate the learner's latest attempted answer against the immediately preceding practice question. Briefly explain why it is correct or what needs changing, then invite another attempt if helpful. Keep this exercise active until the student asks for the next question; do not automatically add a new exercise. Do not invent a question or a student's response.",
  };
  return [
    `Turn intent: ${turn.intent}.`,
    rules[turn.intent],
    turn.previousStudent ? `Earlier student question to keep in context: ${turn.previousStudent.slice(0, 350)}` : "",
    "When the student challenges your previous answer, reconsider it independently and correct mistakes instead of defending them.",
    "Do not ask a routine follow-up after every navigation/support response; for teaching, offer at most one relevant next step.",
  ].filter(Boolean).join("\n");
};

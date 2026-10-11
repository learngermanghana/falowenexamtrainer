// Resolve compact learner follow-ups against the current conversation without
// treating every short message as a new lesson or a navigation request.
const recent = (history) => (Array.isArray(history) ? history : [])
  .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string")
  .slice(-10);

export const classifyStudyBuddyTurn = (message, history = []) => {
  const text = String(message || "").trim().toLowerCase();
  const messages = recent(history);
  const previousStudent = [...messages].reverse().find((item) => item.role === "user")?.content || "";
  if (!previousStudent) return { intent: "new_question", previousStudent: "" };
  if (/^(?:new topic|change topic|something else|forget that|neues thema)\b/.test(text)) {
    return { intent: "new_question", previousStudent: "" };
  }
  if (/\b(?:my answer is|i think it is|ich denke|meine antwort|answers?:|1\s*[.)-]\s*\w)/i.test(text)) {
    return { intent: "check_answer", previousStudent };
  }
  if (/\b(?:another example|more examples|one more example|noch ein beispiel|beispiel(?:e)?)\b/i.test(text)) {
    return { intent: "more_examples", previousStudent };
  }
  if (/\b(?:quiz me|test me|questions? to practi[cs]e|exercise|übung|practice questions?)\b/i.test(text)) {
    return { intent: "guided_practice", previousStudent };
  }
  if (/\b(?:i don't understand|don't get it|explain again|simpler|easier|nochmal|einfacher|why|warum|wieso|what do you mean|what about|and the second|question\s*\d+|number\s*\d+|that answer|previous|before)\b/i.test(text) ||
      /^(?:why|how|what|and|but|yes|no|okay|ok|again|more|weiter|und|aber)[?.!\s]*$/i.test(text)) {
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
    guided_practice: "Use the current topic to give 1–3 short practice questions, preferably one at a time. Wait for the learner's answer before grading or revealing solutions.",
    check_answer: "Evaluate the learner's latest attempted answer against the immediately preceding practice question. Briefly explain why it is correct or what needs changing, then invite another attempt if helpful. Do not invent a question or a student's response.",
  };
  return [
    `Turn intent: ${turn.intent}.`,
    rules[turn.intent],
    turn.previousStudent ? `Earlier student question to keep in context: ${turn.previousStudent.slice(0, 350)}` : "",
    "When the student challenges your previous answer, reconsider it independently and correct mistakes instead of defending them.",
    "Do not ask a routine follow-up after every navigation/support response; for teaching, offer at most one relevant next step.",
  ].filter(Boolean).join("\n");
};

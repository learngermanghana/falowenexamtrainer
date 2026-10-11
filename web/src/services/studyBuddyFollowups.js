// Resolve compact learner follow-ups against the current conversation without
// treating every short message as a new lesson or a navigation request.
const recent = (history) => (Array.isArray(history) ? history : [])
  .filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string")
  .slice(-10);

const isShortHelpRequest = (text) => /^(?:hint|help|again|correct|really|explain|huh|hilfe|tipp|nochmal|richtig|wirklich)[?.!\s]*$/i.test(text);

const requestsPractice = (text) => /(?:^|[^\p{L}\p{N}_])(?:quiz me|test me|practi[cs]e|exercise|übung(?:en)?|questions? to practi[cs]e|practice questions?)(?=$|[^\p{L}\p{N}_])/iu.test(text);

const isDirectQuizQuestion = (content, practiceActive) => {
  if (!practiceActive) return false;
  const questions = String(content || "").match(/(?:^|[.!]\s+|\n)\s*(?:[0-9]+[.)]\s*)?(?:how|which|what|who|where|when|why|wie|welche[rns]?|was|wer|wo|wann|warum)\b[^?]*\?/gi) || [];
  return questions.some(question =>
    !/https?:\/\//i.test(question) &&
    !/\b(?:what (?:would you like|do you want) to (?:practi[cs]e|study|learn)|what (?:should|shall) we (?:practi[cs]e|study|learn)|was (?:möchtest|willst) du (?:üben|lernen))\b/i.test(question) &&
    !/\b(?:what|which)\s+(?:topic|level|language|skill|difficulty)\b.*\b(?:would you like|do you want|should we|shall we)\b/i.test(question) &&
    !/\b(?:how do you (?:want to pay|open|navigate|sign up|log in)|(?:what|which) (?:topic|level|skill|difficulty) (?:should|shall)|(?:welches thema|welches niveau) (?:möchtest|sollen))\b/i.test(question));
};

// Require an answer request or exercise structure, not navigation verbs.
const isPracticePrompt = (content, practiceActive) =>
  isDirectQuizQuestion(content, practiceActive) ||
  /\b(?:your answer|what is your answer|deine antwort)\s*[?:]/i.test(content) ||
  /(?:^|[\s:])_{2,}(?=$|[\s.,!?;])/m.test(content) ||
  /(?:^|\n)\s*(?:translate|übersetze|fill in|ergänze|complete (?:the|this) sentence)\b[^\n]*[:“"']/i.test(content) ||
  (/\b(?:choose|wähle)\b/i.test(content) && /(?:^|[\s,])(?:[a-d])[.):]\s*\S/im.test(content));

// Replay recent turns so hints and feedback retain the exercise, while a new
// question or navigation request ends it. Both UI actions and grading use this state.
const getPracticeState = (messages) => {
  let state = { requested: false, exercise: "" };
  messages.forEach((entry, index) => {
    if (entry.role === "user") {
      const { intent } = classifyStudyBuddyTurn(entry.content, messages.slice(0, index), state);
      if (intent === "guided_practice" || intent === "next_practice" || (index === 0 && requestsPractice(entry.content) && !/^(?:new topic|change topic|something else|forget that|neues thema)\b/i.test(entry.content))) {
        state = { requested: true, exercise: "" };
      } else if (intent === "new_question") {
        state = { requested: false, exercise: "" };
      }
    } else if (/https?:\/\//i.test(entry.content)) {
      state = { requested: false, exercise: "" };
    } else if (isPracticePrompt(entry.content, state.requested || Boolean(state.exercise))) {
      state = { requested: true, exercise: entry.content };
    }
  });
  return state;
};

export const getStudyBuddyPracticeActions = (history = []) => {
  const messages = recent(history);
  if (messages[messages.length - 1]?.role !== "assistant" || !getPracticeState(messages).exercise) return [];
  return [
    { label: "Try again", message: "Try again" },
    { label: "Explain this", message: "Explain this exercise" },
    { label: "Next question", message: "Next practice question" },
  ];
};

export const classifyStudyBuddyTurn = (message, history = [], practiceState) => {
  const text = String(message || "").trim().toLowerCase();
  const messages = recent(history);
  const previousStudent = [...messages].reverse().find((item) => item.role === "user")?.content || "";
  if (!previousStudent) return { intent: "new_question", previousStudent: "" };
  if (/^(?:new topic|change topic|something else|forget that|neues thema)\b/.test(text)) {
    return { intent: "new_question", previousStudent: "" };
  }
  if (/^(?:tell me about|teach me about|let['’]s (?:study|learn|discuss)|can we (?:study|learn|discuss)|erklär(?:e)? mir|lass uns (?:lernen|über))\b/i.test(text)) {
    return { intent: "new_question", previousStudent: "" };
  }
  if (isShortHelpRequest(text)) return { intent: "clarify_followup", previousStudent };
  if (/^try again[.!\s]*$/i.test(text)) return { intent: "retry_practice", previousStudent };
  if (/^explain this exercise[.!\s]*$/i.test(text)) return { intent: "explain_practice", previousStudent };
  if (/^next (?:practice )?question[.!\s]*$/i.test(text)) return { intent: "next_practice", previousStudent };
  if (/\b(?:my answer is|i think it is|ich denke|meine antwort|answers?:|1\s*[.)-]\s*\w)/i.test(text)) {
    return { intent: "check_answer", previousStudent };
  }
  if (/\b(?:another example|more examples|one more example|noch ein beispiel|beispiel(?:e)?)\b/i.test(text)) {
    return { intent: "more_examples", previousStudent };
  }
  if (requestsPractice(text)) {
    return { intent: "guided_practice", previousStudent };
  }
  const state = practiceState || getPracticeState(messages);
  const awaitingAnswer = Boolean(state.exercise) && messages[messages.length - 1]?.role === "assistant";
  const answerShaped = /^[\p{L}\p{N}]+[?.!]*$/u.test(text) && !isShortHelpRequest(text) && !/^(?:why|how|what|when|where|who|warum|wieso|wie|was|wann|wo|wer)[?.!]*$/i.test(text);
  const asksQuestion = (/\?/.test(text) && !answerShaped) || /^(?:why|how|what|when|where|who|can|could|please|explain|warum|wieso|wie|was|wann|wo|wer|kann)\b/i.test(text);
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
  const practice = getPracticeState(recent(history));
  const rules = {
    new_question: "Answer the student's current question, without forcing a connection to an unrelated earlier topic.",
    clarify_followup: "This is a follow-up: resolve pronouns and references such as 'it', 'that', 'question 2' from the recent dialogue. Respond directly to the student's actual confusion before suggesting any new exercise. If ambiguous, ask one concise clarifying question.",
    more_examples: "Continue the last explanation with one or two NEW, level-appropriate German examples; do not repeat the prior explanation verbatim.",
    guided_practice: "Use the current topic to give exactly ONE short practice question at a time. End the exercise with 'Your answer?' so the learner knows to respond. Wait for the learner's answer before grading or revealing solutions.",
    retry_practice: "Repeat the current exercise without revealing its solution. Wait for a new attempted answer. If no exercise is available in the recent dialogue, ask which exercise the student wants to retry.",
    explain_practice: "Explain the rule behind the current exercise with a different example. Then repeat the same exercise and wait for the student to answer; do not switch exercises.",
    next_practice: "Give exactly ONE new question on the current practice topic. Do not reveal its answer. End with 'Your answer?'. Wait for the learner to respond. If no practice topic is available, ask which topic they want to practise.",
    check_answer: "Evaluate the learner's latest attempted answer against the active practice question, including when hints or feedback intervene. Briefly explain why it is correct or what needs changing, then invite another attempt if helpful. Keep this exercise active until the student asks for the next question; do not automatically add a new exercise. Do not invent a question or a student's response.",
  };
  return [
    `Turn intent: ${turn.intent}.`,
    rules[turn.intent],
    turn.intent !== "new_question" && practice.exercise ? `Active exercise: ${practice.exercise.slice(0, 1200)}` : "",
    turn.previousStudent ? `Earlier student question to keep in context: ${turn.previousStudent.slice(0, 350)}` : "",
    "When the student challenges your previous answer, reconsider it independently and correct mistakes instead of defending them.",
    "Do not ask a routine follow-up after every navigation/support response; for teaching, offer at most one relevant next step.",
  ].filter(Boolean).join("\n");
};

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(repositoryRoot, "functions/functionz/app.js");
let source = fs.readFileSync(sourcePath, "utf8");

const replaceOnce = (before, after, label) => {
  if (source.includes(after)) return;
  if (!source.includes(before)) {
    throw new Error(`Custom speaking reply patch anchor missing: ${label}`);
  }
  source = source.replace(before, after);
};

replaceOnce(
  `  "Correct only the 1-2 most important mistakes per turn. Keep replies short and phone-friendly.",
  "For C1 useful replies, use this compact pattern: short natural response; 'Besser / C1-Version:' with one upgraded sentence; 'Nützlicher Ausdruck:' with one strong C1 phrase and English meaning; one deeper follow-up question. Do not only correct; upgrade.",`,
  `  "Correct the 1-2 most important mistakes per turn without interrupting the natural conversation.",
  "Every useful learner turn must include an improved German version, even when the original sentence is understandable. Adapt the upgrade to the selected CEFR level: A2 = simple and correct; B1 = connected and natural; B2 = stronger connectors and expression; C1 = advanced, precise and idiomatic.",`,
  "level-aware coaching rule",
);

replaceOnce(
  `    "Main goal: improve Sprechen confidence through back-and-forth communication.",
    "Reply mostly in German, with short English support only when it prevents confusion.",
    "Always ask exactly one friendly German follow-up question to keep the speaking flow active unless the session has ended.",
    "Keep concise: maximum 6 short lines.",`,
  `    "Main goal: improve Sprechen confidence through natural back-and-forth communication and clear language coaching.",
    "Reply mostly in German, with short English support only when it prevents confusion.",
    "Use this reliable structure for every learner message: 'Antwort:' with a natural conversational response; 'Korrektur:' with the 1-2 most important fixes or a brief confirmation that the sentence is correct; 'Bessere Version:' with a complete improved German version of the learner's message; 'Nützlicher Ausdruck:' with one reusable German phrase and a short English meaning; 'Frage:' with exactly one friendly German follow-up question.",
    "Do not skip 'Bessere Version:', even for greetings or short correct messages. Do not return only a question.",
    "Keep the complete reply around 80-140 words and below 1000 characters so the full response can also be generated as audio.",
    "When the session has ended, omit the follow-up question and close with a short summary instead.",`,
  "structured custom reply format",
);

replaceOnce(
  `      reply = await createChatCompletion(chatMessages, { temperature: 0.6, max_tokens: 360 });`,
  `      reply = await createChatCompletion(chatMessages, { temperature: 0.55, max_tokens: 520 });`,
  "custom chat completion budget",
);

fs.writeFileSync(sourcePath, source, "utf8");
console.log("Applied structured custom speaking reply style.");

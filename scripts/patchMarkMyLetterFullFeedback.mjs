import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const replaceInFile = (relativePath, before, after) => {
  const filePath = path.join(root, relativePath);
  let source = fs.readFileSync(filePath, "utf8");
  if (source.includes(after)) return;
  if (!source.includes(before)) throw new Error(`Missing Mark My Letter patch anchor in ${relativePath}`);
  fs.writeFileSync(filePath, source.replace(before, after), "utf8");
};

replaceInFile(
  "functions/functionz/app.js",
  "const feedback = await createChatCompletion(messages, { temperature: 0.1, max_tokens: 1200 });",
  "const feedback = await createChatCompletion(messages, { temperature: 0.1, max_tokens: 2000 });",
);

replaceInFile(
  "web/src/components/LetterPracticePage.js",
  'import WritingFeedbackCard from "./WritingFeedbackCard";',
  'import WritingFeedbackCard from "./WritingFeedbackCardFull";',
);

console.log("Applied Mark My Letter full feedback upgrade.");

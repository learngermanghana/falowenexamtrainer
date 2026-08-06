import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const replacements = [
  {
    file: "web/src/components/A2Day2PersonenBeschreibenWorkbookPage.js",
    before: 'hoerenAudioUrl="https://youtu.be/5ttnGcZWo-Q"',
    after: 'hoerenAudioUrl="https://youtu.be/iB-yVVqI1DQ"',
    label: "A2 Day 2 teacher lecture video",
  },
  {
    file: "web/src/data/a1TeacherVideoResources.js",
    before: '[11, "7", "Understanding Time", "https://youtu.be/qrkQJc5kQJQ"],',
    after: '[11, "7", "Understanding Time", "https://youtu.be/8FnvD8LQEu0"],',
    label: "A1 Day 11 teacher lecture video",
  },
];

for (const { file, before, after, label } of replacements) {
  const filePath = path.join(root, file);
  let source = fs.readFileSync(filePath, "utf8");
  if (!source.includes(after)) {
    if (!source.includes(before)) {
      throw new Error(`Could not find the current ${label} entry in ${file}.`);
    }
    source = source.replace(before, after);
    fs.writeFileSync(filePath, source, "utf8");
  }
}

console.log("Updated A2 Day 2 and A1 Day 11 teacher lecture videos.");

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/components/GeneralHome.js");
let source = fs.readFileSync(targetPath, "utf8");

const replaceOnce = (before, after, label) => {
  if (source.includes(after)) return;
  if (!source.includes(before)) throw new Error(`Could not patch ${label}: source anchor was not found.`);
  source = source.replace(before, after);
};

replaceOnce(
  'import HomeMetrics from "./HomeMetrics";',
  'import HomeMetrics from "./HomeMetrics";\nimport ClassParticipationCard from "./ClassParticipationCard";',
  "GeneralHome Class Participation import",
);

replaceOnce(
  '      <HomeMetrics studentProfile={metricsStudentProfile} />',
  '      <HomeMetrics studentProfile={metricsStudentProfile} />\n\n      <ClassParticipationCard />',
  "GeneralHome Class Participation card",
);

if (!source.includes('import ClassParticipationCard from "./ClassParticipationCard";')) {
  throw new Error("Class Participation import is missing after patch.");
}
if (!source.includes("<ClassParticipationCard />")) {
  throw new Error("Class Participation dashboard card is missing after patch.");
}

fs.writeFileSync(targetPath, source, "utf8");
console.log("Student Class Participation card is wired into the Falowen dashboard.");

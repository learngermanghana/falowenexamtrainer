import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentImport = 'import A2Days26To28LearningUpgrade from "./A2Days26To28LearningUpgrade";';
let day28UsesIsolatedTabs = false;

function patchFile(relativePath, transform) {
  const filePath = path.join(root, relativePath);
  const source = fs.readFileSync(filePath, "utf8");
  const updated = transform(source);
  fs.writeFileSync(filePath, updated, "utf8");
}

patchFile("web/src/components/A2LegacyStandardWorkbookNavigationImpl.js", (source) => {
  let updated = source;
  if (!updated.includes(componentImport)) {
    const anchor = 'import { A2B1GrammarNotesTab } from "./A2B1WorkbookGrammarNotes";';
    if (!updated.includes(anchor)) throw new Error("A2 legacy grammar import anchor was not found.");
    updated = updated.replace(anchor, `${anchor}\n${componentImport}`);
  }

  const oldGrammar = '<A2B1GrammarNotesTab level="A2" day={config.day} />';
  const newGrammar = '<><A2Days26To28LearningUpgrade day={config.day} /><A2B1GrammarNotesTab level="A2" day={config.day} /></>';
  if (!updated.includes(newGrammar)) {
    if (!updated.includes(oldGrammar)) throw new Error("A2 legacy grammar panel anchor was not found.");
    updated = updated.replace(oldGrammar, newGrammar);
  }
  return updated;
});

patchFile("web/src/components/A2Day27DigitaleKommunikationWorkbookPage.js", (source) => {
  let updated = source;
  if (!updated.includes(componentImport)) {
    const importAnchors = [
      'import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";',
      'import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";',
    ];
    const anchor = importAnchors.find((candidate) => updated.includes(candidate));
    if (!anchor) throw new Error("A2 Day 27 learning import anchor was not found.");
    updated = updated.replace(anchor, `${anchor}\n${componentImport}`);
  }

  const mount = '<A2Days26To28LearningUpgrade day={27} />';
  if (!updated.includes(mount)) {
    const legacyAnchor = '      <A2B1WorkbookGuidance level="A2" />';
    const standardizedAnchor = 'const speakingContent = <>';
    if (updated.includes(legacyAnchor)) {
      updated = updated.replace(legacyAnchor, `${legacyAnchor}\n      ${mount}`);
    } else if (updated.includes(standardizedAnchor)) {
      updated = updated.replace(standardizedAnchor, `${standardizedAnchor}\n  ${mount}`);
    } else {
      throw new Error("A2 Day 27 learning mount anchor was not found.");
    }
  }
  return updated;
});

patchFile("web/src/components/A2Day28UeberDieZukunftSprechenWorkbookPage.js", (source) => {
  if (source.includes("WorkbookTabNav") && !source.includes("<A2B1WorkbookGuidance")) {
    day28UsesIsolatedTabs = true;
    return source;
  }

  let updated = source;
  if (!updated.includes(componentImport)) {
    const anchor = 'import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";';
    if (!updated.includes(anchor)) throw new Error("A2 Day 28 guidance import anchor was not found.");
    updated = updated.replace(anchor, `${anchor}\n${componentImport}`);
  }
  const mount = '<A2Days26To28LearningUpgrade day={28} />';
  if (!updated.includes(mount)) {
    const anchor = '      <A2B1WorkbookGuidance />';
    if (!updated.includes(anchor)) throw new Error("A2 Day 28 guidance mount was not found.");
    updated = updated.replace(anchor, `${anchor}\n      ${mount}`);
  }
  return updated;
});

const legacy = fs.readFileSync(path.join(root, "web/src/components/A2LegacyStandardWorkbookNavigationImpl.js"), "utf8");
const day27 = fs.readFileSync(path.join(root, "web/src/components/A2Day27DigitaleKommunikationWorkbookPage.js"), "utf8");
const day28 = fs.readFileSync(path.join(root, "web/src/components/A2Day28UeberDieZukunftSprechenWorkbookPage.js"), "utf8");
if (!legacy.includes("<A2Days26To28LearningUpgrade day={config.day} />")) throw new Error("A2 Day 26 learning block is not wired into the legacy grammar panel.");
if (!day27.includes("<A2Days26To28LearningUpgrade day={27} />")) throw new Error("A2 Day 27 learning block is missing.");
if (!day28UsesIsolatedTabs && !day28.includes("<A2Days26To28LearningUpgrade day={28} />")) throw new Error("A2 Day 28 learning block is missing.");
console.log("Wired A2 Days 26-28 concise learning blocks into their workbook pages.");

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const workbookTargets = [
  ["web/src/components/C2Day1GuidedWorkbookPage.js", "1"],
  ["web/src/components/C2Days2To5GuidedWorkbookPage.js", "day"],
  ["web/src/components/C2Days6To11GuidedWorkbookPage.js", "day"],
  ["web/src/components/C2Days12To18GuidedWorkbookPage.js", "day"],
  ["web/src/components/C2Days19To24GuidedWorkbookPage.js", "day"],
  ["web/src/components/C2Days25To28GuidedWorkbookPage.js", "day"],
];

const count = (source, needle) => source.split(needle).length - 1;

function replaceTab(source, tab, next, replacement, file) {
  const pattern = new RegExp(
    `\\{active\\s*===\\s*"${tab}"\\s*\\?[\\s\\S]*?(?=\\{active\\s*===\\s*"${next}"\\s*\\?)`,
  );
  if (!pattern.test(source)) {
    throw new Error(`C2 page ownership: could not isolate ${tab} → ${next} in ${file}`);
  }
  return source.replace(pattern, replacement);
}

for (const [relative, dayExpr] of workbookTargets) {
  const file = path.join(root, relative);
  let source = fs.readFileSync(file, "utf8");

  const grammar = `{active === "learn" ? <C2StandardGrammarPanel day={${dayExpr}} completed={progress.learnDone} onCompleteChange={(learnDone)=>setProgress(p=>({...p,learnDone}))}/> : null}`;
  const speak = `{active === "speak" ? <C2StandardSpeakPanel day={${dayExpr}} completed={progress.speakDone} onCompleteChange={(speakDone)=>setProgress(p=>({...p,speakDone}))}/> : null}`;
  const write = `{active === "write" ? <C2StandardWritePanel day={${dayExpr}} completed={progress.writeDone} onCompleteChange={(writeDone)=>setProgress(p=>({...p,writeDone}))}/> : null}`;

  source = replaceTab(source, "learn", "speak", grammar, relative);
  source = replaceTab(source, "speak", "write", speak, relative);
  source = replaceTab(source, "write", "finish", write, relative);
  source = source
    .replaceAll('learn:"1. Learn"', 'learn:"1. Grammar"')
    .replaceAll('label="Learn"', 'label="Grammar"')
    .replaceAll('>Learn: {', '>Grammar: {')
    .replaceAll('Complete Learn, Speak, Write', 'Complete Grammar, Speak, Write');

  if (count(source, 'active === "learn" ? <C2StandardGrammarPanel') !== 1) {
    throw new Error(`${relative}: Grammar must mount exactly once and only on Learn/Grammar.`);
  }
  if (count(source, 'active === "speak" ? <C2StandardSpeakPanel') !== 1) {
    throw new Error(`${relative}: Speak must mount exactly once and only on Speak.`);
  }
  if (count(source, 'active === "write" ? <C2StandardWritePanel') !== 1) {
    throw new Error(`${relative}: Write must mount exactly once and only on Write.`);
  }

  fs.writeFileSync(file, source, "utf8");
}

const panelPath = path.join(root, "web/src/components/C2StandardExamPanels.js");
let panel = fs.readFileSync(panelPath, "utf8");

panel = panel
  .replace(
    'Section title="Umformung · Methode für die heutige Schreibaufgabe"',
    'Section title="Grammar · Umformungsstrukturen"',
  )
  .replace(
    'Section title="Argumentation · Sprache für die heutige Stellungnahme"',
    'Section title="Grammar · Argumentationsstrukturen"',
  )
  .replace(
    '"Ich kann die heutige Struktur erklären und sie bewusst in Sprechen oder Schreiben einsetzen."',
    '"Ich kann die heutige Struktur erklären und korrekt anwenden."',
  );

const grammarStart = panel.indexOf("export function C2StandardGrammarPanel");
const speakStart = panel.indexOf("export function C2StandardSpeakPanel");
const opinionWriteStart = panel.indexOf("function OpinionWrite");
const reformulationWriteStart = panel.indexOf("function ReformulationWrite");
const writePanelStart = panel.indexOf("export function C2StandardWritePanel");

if ([grammarStart, speakStart, opinionWriteStart, reformulationWriteStart, writePanelStart].some((i) => i < 0)) {
  throw new Error("C2 page ownership: shared panel boundaries are missing.");
}

const grammarBlock = panel.slice(grammarStart, speakStart);
const speakBlock = panel.slice(speakStart, opinionWriteStart);
const writeBlock = panel.slice(opinionWriteStart, writePanelStart);

[
  "heutige Schreibaufgabe",
  "heutige Stellungnahme",
  "d.reformulations.map",
].forEach((forbidden) => {
  if (grammarBlock.includes(forbidden)) {
    throw new Error(`C2 Grammar contains Write-owned content: ${forbidden}`);
  }
});

[
  "C2StandardGrammarPanel",
  "C2StandardWritePanel",
  "REFORMULATION_FAMILIES",
  "d.grammar",
].forEach((forbidden) => {
  if (speakBlock.includes(forbidden)) {
    throw new Error(`C2 Speak contains another page's content: ${forbidden}`);
  }
});

[
  "C2StandardGrammarPanel",
  "C2StandardSpeakPanel",
  "REFORMULATION_FAMILIES",
  "d.grammar",
  "grammarFocus",
  "r.model",
  "Musterlösung",
  "EmbeddedSpeechPracticePanel",
].forEach((forbidden) => {
  if (writeBlock.includes(forbidden)) {
    throw new Error(`C2 Write contains another page's content: ${forbidden}`);
  }
});

fs.writeFileSync(panelPath, panel, "utf8");
console.log("C2 Days 1-28 page ownership enforced: Grammar only Grammar, Speak only Speak, Write only Write.");


const navPath = path.join(root, "web/src/components/StandardWorkbookComponents.js");
let nav = fs.readFileSync(navPath, "utf8");
const c2TabsAnchor = `export const STANDARD_WORKBOOK_TABS = A2_B1_WORKBOOK_TABS;`;
if (!nav.includes("export const C2_WORKBOOK_TABS")) {
  if (!nav.includes(c2TabsAnchor)) throw new Error("C2 page ownership: tab definition anchor missing.");
  nav = nav.replace(
    c2TabsAnchor,
    `export const C2_WORKBOOK_TABS = B2_C1_WORKBOOK_TABS.map((tab) =>
  tab.key === "learn" ? { ...tab, label: "Grammar", description: "Learn" } : tab
);

${c2TabsAnchor}`,
  );
}
nav = nav.replace(
  "      tabs={B2_C1_WORKBOOK_TABS}",
  '      tabs={String(level || "").toUpperCase() === "C2" ? C2_WORKBOOK_TABS : B2_C1_WORKBOOK_TABS}',
);
if (!nav.includes('label: "Grammar"') || !nav.includes('String(level || "").toUpperCase() === "C2"')) {
  throw new Error("C2 page ownership: C2 Grammar tab label was not applied.");
}
fs.writeFileSync(navPath, nav, "utf8");

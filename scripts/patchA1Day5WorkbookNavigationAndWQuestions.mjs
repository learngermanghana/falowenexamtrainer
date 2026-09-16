import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workbookFile = path.join(root, "web/src/components/A1Day5IntroducingYourselfArticlesWorkbookPage.js");
const appFile = path.join(root, "web/src/App.js");

const replaceOnce = ({ source, before, after, label, already = null }) => {
  if ((typeof already === "string" && source.includes(already)) || (typeof already === "function" && already(source))) {
    return source;
  }
  if (!source.includes(before)) {
    throw new Error(`A1 Day 5 workbook patch anchor missing: ${label}`);
  }
  return source.replace(before, after);
};

let workbook = fs.readFileSync(workbookFile, "utf8");

workbook = replaceOnce({
  source: workbook,
  before: "<div>Your Teil 6 sentences are saved for your tutor and class after you post them.</div>",
  after: "<div>Your Teil 5 sentences are saved for your tutor and class after you post them.</div>",
  label: "progress Teil 6 label",
  already: "<div>Your Teil 5 sentences are saved for your tutor and class after you post them.</div>",
});

workbook = replaceOnce({
  source: workbook,
  before: '<SectionCard title="Teil 4 · Mini Dialogue" subtitle="Read and practise the short conversation.">',
  after: '<SectionCard title="Teil 4 · W-Fragen" subtitle="Practise W-question word order, the model dialogue, and the correct question words.">',
  label: "Teil 4 title",
  already: '<SectionCard title="Teil 4 · W-Fragen"',
});

workbook = replaceOnce({
  source: workbook,
  before: `        </RevealAnswer>\n      </SectionCard>\n\n      <SectionCard title="Teil 5 · W-Words" subtitle="Choose the correct question word.">\n        <div style={infoBoxStyle}>`,
  after: `        </RevealAnswer>\n\n        <div style={{ display: "grid", gap: 6, marginTop: 4 }}>\n          <h3 style={{ margin: 0, fontSize: 18 }}>W-Words practice</h3>\n          <p style={{ margin: 0, color: "#4b5563" }}>Choose the correct question word.</p>\n        </div>\n        <div style={infoBoxStyle}>`,
  label: "merge Teil 4 and Teil 5",
  already: (source) => source.includes("W-Words practice") && !source.includes('title="Teil 5 · W-Words"'),
});

workbook = replaceOnce({
  source: workbook,
  before: '<SectionCard title="Teil 6 · Scrambled Sentences" subtitle="Rearrange the words to form correct German sentences and mark each as a statement or question.">',
  after: '<SectionCard title="Teil 5 · Scrambled Sentences" subtitle="Rearrange the words to form correct German sentences and mark each as a statement or question.">',
  label: "renumber scrambled sentences",
  already: '<SectionCard title="Teil 5 · Scrambled Sentences"',
});

fs.writeFileSync(workbookFile, workbook, "utf8");

let app = fs.readFileSync(appFile, "utf8");
const day5WorkbookPath = "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook";
app = replaceOnce({
  source: app,
  before: `      {location.pathname.startsWith("/campus/course/") ? (\n        <CampusQuickNavigation`,
  after: `      {location.pathname.startsWith("/campus/course/") &&\n      location.pathname !== "${day5WorkbookPath}" ? (\n        <CampusQuickNavigation`,
  label: "top CampusQuickNavigation condition",
  already: `location.pathname !== "${day5WorkbookPath}"`,
});
fs.writeFileSync(appFile, app, "utf8");

if (workbook.includes("Teil 6 ·")) {
  throw new Error("A1 Day 5 workbook still contains a Teil 6 heading after patching.");
}
if (!workbook.includes('title="Teil 4 · W-Fragen"') || !workbook.includes('title="Teil 5 · Scrambled Sentences"')) {
  throw new Error("A1 Day 5 workbook section numbering did not resolve to five parts.");
}
if (!app.includes(`location.pathname !== "${day5WorkbookPath}"`)) {
  throw new Error("A1 Day 5 top navigation suppression was not applied.");
}

console.log("Patched A1 Day 5: one workbook navigation, merged W-Fragen section, five parts total.");

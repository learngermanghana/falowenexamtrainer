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
  before: "  gap: 18,\n  paddingBottom: 32,",
  after: "  gap: 12,\n  paddingBottom: 32,",
  label: "compact page spacing",
  already: "  gap: 12,\n  paddingBottom: 32,",
});

workbook = replaceOnce({
  source: workbook,
  before: "  gap: 14,\n  padding: 16,\n};",
  after: "  gap: 12,\n  padding: 16,\n  marginBottom: 0,\n};",
  label: "compact card spacing",
  already: "  marginBottom: 0,\n};",
});

workbook = replaceOnce({
  source: workbook,
  before: 'const heroImage =\n  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80";\n\n',
  after: "",
  label: "remove Day 5 hero image source",
  already: (source) => !source.includes("const heroImage ="),
});

workbook = replaceOnce({
  source: workbook,
  before: `      <header style={{ ...cardStyle, overflow: "hidden", padding: 0 }}>\n        <img\n          src={heroImage}\n          alt="Students learning German together"\n          style={{ width: "100%", height: "clamp(180px, 30vw, 240px)", objectFit: "cover", display: "block" }}\n        />\n        <div style={{ padding: 16, display: "grid", gap: 12 }}>`,
  after: `      <header style={{ ...cardStyle }}>\n        <div style={{ display: "grid", gap: 8 }}>`,
  label: "compact Day 5 workbook header",
  already: '<header style={{ ...cardStyle }}>\n        <div style={{ display: "grid", gap: 8 }}>',
});

workbook = replaceOnce({
  source: workbook,
  before: "<div>Your Teil 6 sentences are saved for your tutor and class after you post them.</div>",
  after: "<div>Your Teil 5 sentences are saved for your tutor and class after you post them.</div>",
  label: "progress Teil 6 label",
  already: "<div>Your Teil 5 sentences are saved for your tutor and class after you post them.</div>",
});

workbook = replaceOnce({
  source: workbook,
  before: `          <div style={infoBoxStyle}>\n            <strong>Progress</strong>\n            <div style={{ lineHeight: 1.7 }}>\n              <div>Article genders: {articleScore}/{articleWords.length}</div>\n              <div>W-words: {wWordScore}/{wWordQuestions.length}</div>\n              <div>Your introduction in Teil 3 is saved to your class profile and class discussion.</div>\n              <div>Your Teil 5 sentences are saved for your tutor and class after you post them.</div>\n            </div>\n          </div>`,
  after: `          <div style={{ ...infoBoxStyle, padding: 10, gap: 6 }}>\n            <strong>Progress</strong>\n            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", color: "#334155" }}>\n              <span>Articles: {articleScore}/{articleWords.length}</span>\n              <span>W-words: {wWordScore}/{wWordQuestions.length}</span>\n            </div>\n          </div>`,
  label: "compact Day 5 progress summary",
  already: "<span>Articles: {articleScore}/{articleWords.length}</span>",
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
  after: `        </RevealAnswer>\n\n        <div style={{ ...boxBase, padding: 12 }}>\n          <div style={{ display: "grid", gap: 4 }}>\n            <h3 style={{ margin: 0, fontSize: 18 }}>W-Words practice</h3>\n            <p style={{ margin: 0, color: "#4b5563" }}>Choose the correct question word.</p>\n          </div>\n        </div>\n        <div style={infoBoxStyle}>`,
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

if (workbook.includes("heroImage") || workbook.includes("Students learning German together")) {
  throw new Error("A1 Day 5 workbook still contains the oversized hero image.");
}
if (workbook.includes("Teil 6 ·")) {
  throw new Error("A1 Day 5 workbook still contains a Teil 6 heading after patching.");
}
if (!workbook.includes('title="Teil 4 · W-Fragen"') || !workbook.includes('title="Teil 5 · Scrambled Sentences"')) {
  throw new Error("A1 Day 5 workbook section numbering did not resolve to five parts.");
}
if (!workbook.includes("<span>Articles: {articleScore}/{articleWords.length}</span>")) {
  throw new Error("A1 Day 5 compact progress summary was not applied.");
}
if (!app.includes(`location.pathname !== "${day5WorkbookPath}"`)) {
  throw new Error("A1 Day 5 top navigation suppression was not applied.");
}

console.log("Patched A1 Day 5: compact header, one workbook navigation, merged W-Fragen section, five parts total.");

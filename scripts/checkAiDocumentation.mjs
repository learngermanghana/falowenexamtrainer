#!/usr/bin/env node
// Source/links contract for Falowen AI docs; no requests, credentials or paid APIs.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mustHave = [
  "AGENTS.md",
  "docs/ai/README.md", "docs/ai/architecture.md",
  "docs/ai/content-source-of-truth.md",
  "docs/ai/teaching-and-marking-rules.md",
  "docs/ai/student-data-and-privacy.md",
  "docs/ai/mcp-plugin-reference.md",
  "docs/workflows/music-and-lyrics.md",
  "docs/workflows/exam-and-assignment-publishing.md",
  "docs/workflows/deployment-and-rollback.md",
  "docs/chatgpt-falowen-companion.md", "docs/assessment-task-sync.md",
  "docs/music-recording-timings.md", "docs/mock-factory-a1-c2.md",
  "web/public/llms.txt", "web/public/falowen-help.md",
  "web/public/falowen-navigation.json", "scripts/generateFalowenCourseMap.mjs",
];
const errors=[];
function file(rel) {
  const target=path.resolve(root,rel);
  if (!target.startsWith(root+path.sep)) { errors.push("Escapes repo: "+rel); return ""; }
  try {return fs.readFileSync(target,"utf8");}
  catch {errors.push("Missing: "+rel); return "";}
}
for (const rel of mustHave) file(rel);
const controlled=["AGENTS.md",...mustHave.filter(p=>p.startsWith("docs/ai/")||p.startsWith("docs/workflows/"))];
for (const rel of controlled) {
  const body=file(rel);
  // Validate local relative Markdown links. Remote URLs are intentionally not fetched.
  for (const match of body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const dest=match[1].split("#")[0].split("?")[0].trim();
    if (!dest||dest.startsWith("https:")||dest.startsWith("http:")||dest.startsWith("mailto:")) continue;
    if (dest.startsWith("/")) {errors.push(rel+": absolute filesystem-style Markdown link "+dest);continue;}
    const resolved=path.resolve(root,path.dirname(rel),decodeURIComponent(dest));
    if (!resolved.startsWith(root+path.sep)||!fs.existsSync(resolved)) errors.push(rel+": broken link "+dest);
  }
}
const llms=file("web/public/llms.txt");
const help=file("web/public/falowen-help.md");
let nav;
try {nav=JSON.parse(file("web/public/falowen-navigation.json"));}
catch(e){errors.push("Invalid public navigation JSON: "+e.message);}
const llmsDate=llms.match(/^Last reviewed:\s*(\d{1,2} [A-Za-z]+ \d{4})/m)?.[1];
const helpDate=help.match(/^Last reviewed:\s*\*\*(\d{1,2} [A-Za-z]+ \d{4})\*\*/m)?.[1];
if (!llmsDate||!helpDate||Number.isNaN(Date.parse(llmsDate))||Number.isNaN(Date.parse(helpDate))) {
  errors.push("Missing public AI help reviewed dates");
} else {
  const l=new Date(llmsDate).toISOString().slice(0,10);
  const h=new Date(helpDate).toISOString().slice(0,10);
  if (l!==h||l!==nav?.lastReviewed) errors.push("Public AI reviewed date mismatch between llms.txt / help / navigation.json");
}
if (!/music\.falowen\.app/.test(llms)||!/falowen-course-map\.json/.test(llms)) errors.push("Public AI discovery missing Music or generated course map");
if (!nav?.currentGuidance?.music?.publicSite || !nav?.sourceOfTruth?.courseMap) errors.push("Navigation missing Music or course-map references");
if (!/get_my_falowen_lesson_content/.test(file("docs/ai/mcp-plugin-reference.md"))) errors.push("Missing documented Companion lesson-content tool");
if (!/estimated/i.test(file("docs/workflows/music-and-lyrics.md"))) errors.push("Music guide must distinguish estimated cue timing");
if (errors.length) {
  console.error("Falowen AI documentation check FAILED:\n"+errors.map(x=>" - "+x).join("\n"));
  process.exitCode=1;
} else {
  console.log("Falowen AI documentation checks passed ("+controlled.length+" AI guides, valid references and public review stamps).");
}

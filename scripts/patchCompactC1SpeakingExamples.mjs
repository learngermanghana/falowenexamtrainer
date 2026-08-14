import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "web/src/components/CompactC1LessonPage.js");
let source = fs.readFileSync(file, "utf8");

const before = '          <ul style={listStyle}>{branches.map((branch) => <li key={branch.id || branch.title}><strong>{branch.title}:</strong> {(branch.keywords || []).join(", ")}</li>)}</ul>';
const after = `          <div style={{ display: "grid", gap: 10 }}>
            {branches.map((branch, index) => (
              <article key={branch.id || branch.title} style={{ border: "1px solid #c7d2fe", borderRadius: 14, padding: 12, background: "#fff", display: "grid", gap: 7 }}>
                <strong>{index + 1}. {branch.title}</strong>
                {(branch.keywords || []).length ? <div style={{ color: "#475569", fontWeight: 700 }}>{branch.keywords.join(" • ")}</div> : null}
                {branch.prompt ? <div><strong>Was ist damit gemeint?</strong> {branch.prompt}</div> : null}
                {branch.example ? <div style={{ color: "#3730a3" }}><strong>Beispiel:</strong> {branch.example}</div> : null}
                {branch.starter ? <div style={{ borderLeft: "4px solid #818cf8", paddingLeft: 10 }}><strong>Möglicher Satzanfang:</strong> {branch.starter}</div> : null}
              </article>
            ))}
          </div>`;

if (!source.includes(after)) {
  if (!source.includes(before)) throw new Error("Compact C1 speaking keyword-list anchor not found.");
  source = source.replace(before, after);
}

if (!source.includes("Was ist damit gemeint?")) throw new Error("Compact C1 speaking guidance was not installed.");
if (!source.includes("Möglicher Satzanfang:")) throw new Error("Compact C1 speaking starter was not installed.");

fs.writeFileSync(file, source, "utf8");
console.log("Compact C1 Speak now shows keywords, guiding prompts, examples and sentence starters.");

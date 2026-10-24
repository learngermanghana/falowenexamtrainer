import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(repoRoot, "web", "src", "components", "B1WritingWorkspace.js");

let source = fs.readFileSync(targetPath, "utf8");

const importAnchor = 'import B1InlineWritingAnalyser from "./B1InlineWritingAnalyser";';
const a2TemplateImport = 'import { A2_FORMAL_LETTER_TEMPLATE, A2_INFORMAL_LETTER_TEMPLATE } from "./A2WritingWorkspaceSupport";';

if (!source.includes(a2TemplateImport)) {
  if (!source.includes(importAnchor)) {
    throw new Error("A2 writing template patch anchor missing: analyser import");
  }
  source = source.replace(importAnchor, `${importAnchor}\n${a2TemplateImport}`);
}

const workspaceAnchor = "export default function B1WritingWorkspace({ writingContext = {} }) {";
const controlsMarker = 'data-a2-template-insert-controls="true"';

if (!source.includes(controlsMarker)) {
  if (!source.includes(workspaceAnchor)) {
    throw new Error("A2 writing template patch anchor missing: workspace export");
  }

  const helperBlock = `const replaceA2LetterTemplateSafely = (currentText, nextTemplate) => {
  const current = String(currentText || "");
  const trimmed = current.trim();
  const knownTemplate = [A2_FORMAL_LETTER_TEMPLATE, A2_INFORMAL_LETTER_TEMPLATE]
    .some((template) => trimmed === template.trim());

  if (trimmed && !knownTemplate && trimmed !== nextTemplate.trim()) {
    const shouldReplace = typeof window === "undefined" || typeof window.confirm !== "function"
      ? true
      : window.confirm("This will replace your current A2 draft with the selected letter template. Continue?");
    if (!shouldReplace) return currentText;
  }

  return nextTemplate;
};

const A2LetterTemplateInsertControls = ({ onInsertTemplate }) => (
  <div
    data-a2-template-insert-controls="true"
    style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}
  >
    <span style={{ color: "#475569", fontWeight: 700 }}>Insert a letter template:</span>
    <button
      type="button"
      onClick={() => onInsertTemplate(A2_FORMAL_LETTER_TEMPLATE)}
      style={{ ...styles.secondaryButton, borderRadius: 999 }}
    >
      Insert Formal Letter Template
    </button>
    <button
      type="button"
      onClick={() => onInsertTemplate(A2_INFORMAL_LETTER_TEMPLATE)}
      style={{ ...styles.secondaryButton, borderRadius: 999 }}
    >
      Insert Informal Letter Template
    </button>
  </div>
);`;

  source = source.replace(workspaceAnchor, `${helperBlock}\n\n${workspaceAnchor}`);
}

const analyserAnchor = `        <B1InlineWritingAnalyser
          text={germanDraft}`;
const insertedControls = `        {level === "A2" ? (
          <A2LetterTemplateInsertControls
            onInsertTemplate={(template) =>
              setGermanDraft((current) => replaceA2LetterTemplateSafely(current, template))
            }
          />
        ) : null}

`;

if (!source.includes("replaceA2LetterTemplateSafely(current, template)")) {
  if (!source.includes(analyserAnchor)) {
    throw new Error("A2 writing template patch anchor missing: German draft analyser");
  }
  source = source.replace(analyserAnchor, `${insertedControls}${analyserAnchor}`);
}

for (const required of [
  a2TemplateImport,
  controlsMarker,
  "Insert Formal Letter Template",
  "Insert Informal Letter Template",
  'level === "A2"',
  "replaceA2LetterTemplateSafely(current, template)",
]) {
  if (!source.includes(required)) {
    throw new Error(`A2 writing template patch assertion failed: ${required}`);
  }
}

fs.writeFileSync(targetPath, source);
console.log("Restored A2 Teil 2 formal/informal template insert controls.");

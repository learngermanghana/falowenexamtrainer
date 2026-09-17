import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const replaceOnce = (source, before, after, label) => {
  if (source.includes(after)) return source;
  if (!source.includes(before)) {
    throw new Error(`Could not patch ${label}: source anchor was not found.`);
  }
  return source.replace(before, after);
};

const standardWorkbookPath = path.join(root, "web/src/components/StandardWorkbookComponents.js");
let standardWorkbook = fs.readFileSync(standardWorkbookPath, "utf8");

if (!standardWorkbook.includes('from "./WorkbookSubmissionCaptureRuntime"')) {
  standardWorkbook = replaceOnce(
    standardWorkbook,
    'import { A2B1GrammarNotesTab } from "./A2B1WorkbookGrammarNotes";',
    'import { A2B1GrammarNotesTab } from "./A2B1WorkbookGrammarNotes";\nimport WorkbookSubmissionCaptureRuntime from "./WorkbookSubmissionCaptureRuntime";',
    "workbook mapped submission runtime import",
  );
}

if (!standardWorkbook.includes("<WorkbookSubmissionCaptureRuntime")) {
  standardWorkbook = replaceOnce(
    standardWorkbook,
    `      </nav>\n\n      {integratesLegacyGrammar && renderLegacyGrammarPanel && activeTab === "grammar" && legacyGrammarContext ? (`,
    `      </nav>\n\n      {legacyGrammarContext ? (\n        <WorkbookSubmissionCaptureRuntime context={legacyGrammarContext} activeTab={activeTab} />\n      ) : null}\n\n      {integratesLegacyGrammar && renderLegacyGrammarPanel && activeTab === "grammar" && legacyGrammarContext ? (`,
    "workbook mapped submission runtime mount",
  );
}

const standardMarkers = [
  'from "./WorkbookSubmissionCaptureRuntime"',
  "<WorkbookSubmissionCaptureRuntime context={legacyGrammarContext} activeTab={activeTab} />",
];
standardMarkers.forEach((marker) => {
  if (!standardWorkbook.includes(marker)) throw new Error(`Mapped submission marker missing: ${marker}`);
});
fs.writeFileSync(standardWorkbookPath, standardWorkbook, "utf8");

const analyserPath = path.join(root, "web/src/components/B1InlineWritingAnalyser.js");
let analyser = fs.readFileSync(analyserPath, "utf8");

analyser = replaceOnce(
  analyser,
  'import React, { useState } from "react";',
  'import React, { useEffect, useRef, useState } from "react";',
  "writing analyser latest-text hooks",
);

if (!analyser.includes("const latestTextRef = useRef")) {
  analyser = replaceOnce(
    analyser,
    `  const [error, setError] = useState("");\n  const resolvedLevel = String(level || "B1").toUpperCase() === "A2" ? "A2" : "B1";`,
    `  const [error, setError] = useState("");\n  const [analysedText, setAnalysedText] = useState("");\n  const latestTextRef = useRef(String(text || ""));\n  const resolvedLevel = String(level || "B1").toUpperCase() === "A2" ? "A2" : "B1";\n\n  useEffect(() => {\n    latestTextRef.current = String(text || "");\n  }, [text]);`,
    "writing analyser latest text ref",
  );
}

analyser = replaceOnce(
  analyser,
  `    const draft = String(text || "").trim();`,
  `    const draft = String(latestTextRef.current || "").trim();`,
  "writing analyser snapshot",
);

if (!analyser.includes("Your text changed while analysis was running")) {
  analyser = replaceOnce(
    analyser,
    `      setFeedbackData(result);`,
    `      const latestDraft = String(latestTextRef.current || "").trim();\n      if (latestDraft !== draft) {\n        setFeedbackData(null);\n        setAnalysedText("");\n        setError(\n          "Your text changed while analysis was running. Your latest version is still saved for Submit. Click Analyse my text again to analyse the newest version.",\n        );\n        return;\n      }\n      setAnalysedText(draft);\n      setFeedbackData(result);`,
    "writing analyser stale response guard",
  );
}

analyser = replaceOnce(
  analyser,
  `          draft={text}`,
  `          draft={analysedText || text}`,
  "writing analyser feedback snapshot",
);

const analyserMarkers = [
  "const latestTextRef = useRef",
  "Your text changed while analysis was running",
  "draft={analysedText || text}",
];
analyserMarkers.forEach((marker) => {
  if (!analyser.includes(marker)) throw new Error(`Writing analyser mapped-submit marker missing: ${marker}`);
});
fs.writeFileSync(analyserPath, analyser, "utf8");

const profilePath = path.join(root, "web/src/components/a2B1WorkbookSectionProfile.js");
let profile = fs.readFileSync(profilePath, "utf8");
if (!profile.includes('21: Object.freeze({ listening: false, part4: null, part4Submission: "none" })')) {
  profile = replaceOnce(
    profile,
    `  B1: Object.freeze({}),`,
    `  B1: Object.freeze({\n    21: Object.freeze({ listening: false, part4: null, part4Submission: "none" }),\n  }),`,
    "B1 Day 21 no-Teil-4 profile",
  );
}
if (!profile.includes('21: Object.freeze({ listening: false, part4: null, part4Submission: "none" })')) {
  throw new Error("B1 Day 21 still requires a nonexistent Teil 4.");
}
fs.writeFileSync(profilePath, profile, "utf8");

console.log(
  "A2/B1 workbook answers now map into Submit: Teil 2 autosaves, Teil 3/4 options are clickable, stale analysis cannot replace newer text, and B1 Day 21 no longer requires Teil 4.",
);

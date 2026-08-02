import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workbookPath = path.join(
  root,
  "web/src/components/A2Day25TagesablaufWorkbookPage.js",
);

let source = fs.readFileSync(workbookPath, "utf8");

const oldGuidanceImport =
  'import { WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";';
const standardGuidanceImport =
  'import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";';

if (source.includes(oldGuidanceImport)) {
  source = source.replace(oldGuidanceImport, standardGuidanceImport);
}

source = source.replace('  { key: "submit", label: "Submit" },\n', "");

const headerAnchor = `        <p style={{ margin: 0, color: "#4b5563" }}>Tab {activeIndex + 1} of {tabs.length}</p>
      </div>

      {activeTab === "sprechen" && (`;
const standardHeader = `        <p style={{ margin: 0, color: "#4b5563" }}>Tab {activeIndex + 1} of {tabs.length}</p>
      </div>

      <A2B1WorkbookGuidance />

      {activeTab === "sprechen" && (`;

if (!source.includes("<A2B1WorkbookGuidance />")) {
  if (!source.includes(headerAnchor)) {
    throw new Error("Could not find the A2 Day 25 navigation insertion point.");
  }
  source = source.replace(headerAnchor, standardHeader);
}

const legacySubmitPanel = `
      {activeTab === "submit" && (
        <div style={card}>
          <h2 style={sectionTitle}>Submit Workbook</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            After Falowen Radio and Teil 1–4, submit your required writing and reading answers in the assignment submission area.
          </p>
          <p style={{ margin: 0, color: "#475569" }}>
            This workbook has no Hören assignment.
          </p>
          <WorkbookSubmissionReminder />
          <a href="/campus/course?submitWork=1" style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}>
            Open submission area
          </a>
        </div>
      )}`;

if (source.includes(legacySubmitPanel)) {
  source = source.replace(legacySubmitPanel, "");
}

if (!source.includes(standardGuidanceImport)) {
  throw new Error("A2 Day 25 does not import the shared standard workbook navigation.");
}
if (!source.includes("<A2B1WorkbookGuidance />")) {
  throw new Error("A2 Day 25 does not mount the shared standard workbook navigation.");
}
if (source.includes('{ key: "submit", label: "Submit" }')) {
  throw new Error("A2 Day 25 still exposes its legacy native Submit tab.");
}
if (source.includes('activeTab === "submit"')) {
  throw new Error("A2 Day 25 still renders its legacy Submit panel.");
}
if (source.includes("Open submission area")) {
  throw new Error("A2 Day 25 still links to the old course-level submission area.");
}

fs.writeFileSync(workbookPath, source);
console.log("A2 Day 25 now uses the standard Day 26-style workbook navigation.");

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const targetPath = path.join(root, "web/src/components/A2Day22DieWochePlanungWorkbookPage.js");
let source = fs.readFileSync(targetPath, "utf8");

const replaceOnce = (from, to, label) => {
  if (source.includes(to)) return;
  if (!source.includes(from)) throw new Error(`Could not patch A2 Day 22 ${label}.`);
  source = source.replace(from, to);
};

replaceOnce(
  'import React, { useMemo, useState } from "react";',
  'import React, { useState } from "react";',
  "React imports",
);

replaceOnce(
  'import AppBackButton from "./navigation/AppBackButton";',
  `import AppBackButton from "./navigation/AppBackButton";\nimport ContextualAssignmentSubmissionPage from "./ContextualAssignmentSubmissionPage";\nimport { A2_B1_WORKBOOK_TABS_WITH_GRAMMAR, WorkbookTabNav } from "./StandardWorkbookComponents";`,
  "native navigation imports",
);

const legacyTabs = `const tabs = [
  { key: "grammar", label: "Grammar" },
  { key: "sprechen", label: "Teil 1 · Sprechen" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
  { key: "references", label: "5. Ref" },
];`;
replaceOnce(legacyTabs, "const tabs = A2_B1_WORKBOOK_TABS_WITH_GRAMMAR;", "shared tab contract");

if (source.includes("function TabButton(")) {
  source = source.replace(/function TabButton\([\s\S]*?\n}\n\nconst A2Day22DieWochePlanungWorkbookPage/, "const A2Day22DieWochePlanungWorkbookPage");
}

source = source.replace(
  '  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);\n',
  "",
);

source = source.replace(
  '<div style={{ ...styles.container, display: "grid", gap: 16 }}>',
  '<div data-a2-day22-native-workbook="true" style={{ ...styles.container, display: "grid", gap: 16 }}>',
);

source = source.replace(
  `          4-part workbook: Sprechen, Schreiben, Lesen und Hören. Complete each Teil and submit your final answers in the
          submission area (not on this page).`,
  `          4-part workbook: Sprechen, Schreiben, Lesen und Hören. Complete each Teil, use Ref when needed, and submit
          the required final work through the native Submit tab.`,
);

const legacyNav = `        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => (
            <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </TabButton>
          ))}
        </div>

        <p style={{ margin: 0, color: "#4b5563" }}>
          Tab {activeIndex + 1} of {tabs.length}
        </p>`;
const nativeNav = `        <div style={{ position: "sticky", top: 0, zIndex: 20 }}>
          <WorkbookTabNav
            activeTab={activeTab}
            onChange={setActiveTab}
            tabs={tabs}
            ariaLabel="A2 Day 22 workbook sections"
          />
        </div>`;
replaceOnce(legacyNav, nativeNav, "shared WorkbookTabNav");

const promptReplacements = [
  ['prompt: "Aufgabe 1"', 'prompt: "Aufgabe 1 · Gülcan schreibt Sonja, dass ..."'],
  ['prompt: "Aufgabe 2"', 'prompt: "Aufgabe 2 · In der ersten Woche haben andere Studierende ..."'],
  ['prompt: "Aufgabe 3"', 'prompt: "Aufgabe 3 · In der Wohngemeinschaft ..."'],
  ['prompt: "Aufgabe 4"', 'prompt: "Aufgabe 4 · Gülcan findet es wichtig, ..."'],
  ['prompt: "Aufgabe 5"', 'prompt: "Aufgabe 5 · Während Sonjas Besuch ..."'],
];
for (const [from, to] of promptReplacements) {
  if (!source.includes(to)) source = source.replace(from, to);
}

source = source.replace(
  '<h2 style={{ margin: 0 }}>Teil 4 · Hören (Exercise)</h2>',
  '<h2 style={{ margin: 0 }}>Teil 4 · Hören · Goethe Self-Check</h2>',
);

const oldListeningCopy = `          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Please be aware that this is a Goethe-standard Hörverstehen (listening) test, and the answers are already
            provided in the YouTube video. You are responsible for checking your own answers.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            The only parts that will be officially evaluated by the school are Lesen (reading) and Schreiben (writing).
            You must mark your own Hören (listening) results.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            This process will require significant motivation and self-discipline on your part to be effective. Thank you,
            and good luck!
          </p>`;
const selfCheckCopy = `          <p style={{ margin: 0, lineHeight: 1.7, fontWeight: 700, color: "#1e3a8a" }}>
            Watch the Goethe past-paper video and check your answers there. Teil 4 is self-check practice and is not
            submitted. The school evaluates only Teil 2 · Schreiben and Teil 3 · Lesen for this workbook.
          </p>`;
replaceOnce(oldListeningCopy, selfCheckCopy, "Goethe self-check copy");

source = source.replace(
  `            </a>
          <WorkbookSubmissionReminder />
          </div>`,
  `            </a>
          </div>`,
);

const legacyFinalSubmission = `      <section style={{ ...cardStyle, border: "1px solid #bfdbfe", background: "#eff6ff" }}>
        <h2 style={{ margin: 0 }}>Final Submission</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          After you complete all Teile, submit your final answers in the submission area. Do not submit answers directly
          on this workbook page.
        </p>
        <a href="/campus/course?submitWork=1" target="_blank" rel="noreferrer" style={{ ...styles.button, width: "fit-content" }}>
          Go to Submission Area
        </a>
      </section>

`;
source = source.replace(legacyFinalSubmission, "");

const referencesBlock = `      {activeTab === "references" && (
        <WorkbookReferenceAnswers level="A2" lesson={{ title: "A2Day22DieWochePlanung", level: "A2", workbookId: "A2Day22DieWochePlanung" }} workbookId="A2Day22DieWochePlanung" />
      )}`;
const submitBlock = `${referencesBlock}

      {activeTab === "submit" && (
        <section style={sectionStyle}>
          <h2 style={{ margin: 0 }}>Submit Workbook · Day 22</h2>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            Submit Teil 2 · Schreiben and Teil 3 · Lesen. Teil 4 · Hören is Goethe self-check practice and is not submitted.
          </p>
          <ContextualAssignmentSubmissionPage
            submissionContext={{
              level: "A2",
              day: 22,
              chapter: "8.22",
              assignmentKey: "A2-8.22",
              canonicalAssignmentKey: "A2-8.22",
              workbookId: "A2Day22DieWochePlanung",
            }}
          />
        </section>
      )}`;
replaceOnce(referencesBlock, submitBlock, "native Submit tab");

const requiredMarkers = [
  'data-a2-day22-native-workbook="true"',
  "A2_B1_WORKBOOK_TABS_WITH_GRAMMAR",
  "<WorkbookTabNav",
  'ariaLabel="A2 Day 22 workbook sections"',
  "<ContextualAssignmentSubmissionPage",
  'assignmentKey: "A2-8.22"',
  "Teil 4 · Hören · Goethe Self-Check",
  "Aufgabe 1 · Gülcan schreibt Sonja, dass ...",
];
for (const marker of requiredMarkers) {
  if (!source.includes(marker)) throw new Error(`A2 Day 22 native workbook marker missing: ${marker}`);
}
if (source.includes("function TabButton(")) throw new Error("A2 Day 22 still owns a private tab-button implementation.");
if (source.includes("Go to Submission Area")) throw new Error("A2 Day 22 still links to the legacy external submission area.");
if (source.includes("<h2 style={{ margin: 0 }}>Final Submission</h2>")) throw new Error("A2 Day 22 still renders the legacy final-submission panel.");

fs.writeFileSync(targetPath, source, "utf8");
console.log("A2 Day 22 now uses shared native workbook navigation and route-locked submission.");

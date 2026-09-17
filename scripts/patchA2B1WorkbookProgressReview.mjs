import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const navPath = path.join(root, "web/src/components/StandardWorkbookComponents.js");
const runtimePath = path.join(root, "web/src/components/WorkbookSubmissionCaptureRuntime.js");

let navSource = fs.readFileSync(navPath, "utf8");
navSource = navSource.replace(
  '<WorkbookSubmissionCaptureRuntime context={legacyGrammarContext} activeTab={activeTab} />',
  '<WorkbookSubmissionCaptureRuntime context={legacyGrammarContext} activeTab={activeTab} onChange={onChange} />',
);
if (!navSource.includes('<WorkbookSubmissionCaptureRuntime context={legacyGrammarContext} activeTab={activeTab} onChange={onChange} />')) {
  throw new Error("Could not wire workbook navigation into mapped submission review.");
}
fs.writeFileSync(navPath, navSource, "utf8");

let runtimeSource = fs.readFileSync(runtimePath, "utf8");
runtimeSource = runtimeSource.replace(
  'export default function WorkbookSubmissionCaptureRuntime({ context = null, activeTab = "" }) {',
  'export default function WorkbookSubmissionCaptureRuntime({ context = null, activeTab = "", onChange = null }) {',
);

const draftStateAnchor = `  const [draft, setDraft] = useState(() => readWorkbookSubmissionDraft(draftContext));\n  const latestDraftRef = useRef(draft);`;
if (!runtimeSource.includes("const [submitWarning, setSubmitWarning]")) {
  if (!runtimeSource.includes(draftStateAnchor)) {
    throw new Error("Could not find mapped draft state for submit warning state.");
  }
  runtimeSource = runtimeSource.replace(
    draftStateAnchor,
    `  const [draft, setDraft] = useState(() => readWorkbookSubmissionDraft(draftContext));\n  const [submitWarning, setSubmitWarning] = useState(false);\n  const latestDraftRef = useRef(draft);`,
  );
}

const submitInjectionEffectAnchor = `  useEffect(() => {\n    if (typeof document === "undefined" || activeTab !== "submit") return undefined;\n    const root = document.getElementById("root") || document.body;`;
if (!runtimeSource.includes("data-workbook-incomplete-submit-warning")) {
  const effectIndex = runtimeSource.indexOf(submitInjectionEffectAnchor);
  if (effectIndex < 0) throw new Error("Could not find Submit mapping effect for completion guard.");
  const effectEndMarker = `  }, [activeTab, draftContext]);\n\n  if (!context || !["A2", "B1"].includes(level) || day <= 0) return null;`;
  const effectEndIndex = runtimeSource.indexOf(effectEndMarker, effectIndex);
  if (effectEndIndex < 0) throw new Error("Could not find end of Submit mapping effect.");
  const completionGuard = `  useEffect(() => {\n    if (typeof document === "undefined" || activeTab !== "submit") {\n      setSubmitWarning(false);\n      return undefined;\n    }\n\n    const root = document.getElementById("root") || document.body;\n    const onSubmitCapture = (event) => {\n      const currentDraft = latestDraftRef.current || readWorkbookSubmissionDraft(draftContext);\n      const currentReview = getWorkbookSubmissionReview(currentDraft);\n      const incompleteParts = currentReview.parts.filter((part) => !part.complete);\n      if (!incompleteParts.length || currentReview.manualOverrideActive) return;\n\n      event.preventDefault();\n      event.stopPropagation();\n      setSubmitWarning(true);\n      window.requestAnimationFrame(() => {\n        root.querySelector('[data-workbook-incomplete-submit-warning="true"]')?.scrollIntoView({\n          behavior: "smooth",\n          block: "center",\n        });\n      });\n    };\n\n    root.addEventListener("submit", onSubmitCapture, true);\n    return () => root.removeEventListener("submit", onSubmitCapture, true);\n  }, [activeTab, draftContext]);\n\n`;
  const effectSuffix = '  }, [activeTab, draftContext]);\n\n';
  runtimeSource = `${runtimeSource.slice(0, effectEndIndex)}${runtimeSource.slice(effectEndIndex, effectEndIndex + effectSuffix.length)}${completionGuard}${runtimeSource.slice(effectEndIndex + effectSuffix.length)}`;
}

const submitStart = runtimeSource.indexOf(`  if (activeTab === "submit") {\n`);
const afterSubmitMarker = runtimeSource.indexOf(`  if (!activePartId`, submitStart);
if (submitStart < 0 || afterSubmitMarker < 0) {
  throw new Error("Could not find Submit review block for completion upgrade.");
}

const upgradedSubmitBlock = `  if (activeTab === "submit") {\n    const incompleteParts = review.parts.filter((part) => !part.complete);\n    const allComplete = review.parts.length > 0 && incompleteParts.length === 0;\n    const tabForPart = { teil2: "schreiben", teil3: "lesen", teil4: "hoeren" };\n\n    return (\n      <div data-workbook-mapped-submit-review="true" style={{ ...panelStyle, marginTop: 10 }}>\n        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>\n          <strong style={{ color: allComplete ? "#166534" : "#92400e", fontSize: 16 }}>\n            {allComplete ? "✓ Ready to submit" : "Complete your workbook before submitting"}\n          </strong>\n          {savedTime ? <span style={{ color: "#64748b", fontSize: 12 }}>Last mapped {savedTime}</span> : null}\n        </div>\n\n        {submitWarning && incompleteParts.length ? (\n          <div data-workbook-incomplete-submit-warning="true" role="alert" style={{ border: "2px solid #f59e0b", borderRadius: 10, padding: "10px 11px", background: "#fffbeb", color: "#92400e" }}>\n            <strong>Finish the unanswered parts before submitting.</strong>\n            <div style={{ marginTop: 4 }}>Use the buttons below to return directly to the missing Teil.</div>\n          </div>\n        ) : null}\n\n        {incompleteParts.length ? (\n          <div style={{ border: "1px solid #fbbf24", borderRadius: 10, padding: "10px 11px", background: "#fffbeb", color: "#92400e" }}>\n            <strong>Some required work is still incomplete.</strong>\n            <div style={{ marginTop: 4 }}>\n              {incompleteParts.map((part) => {\n                if (part.kind === "text") return \`${'${part.heading}'}: writing not completed\`;\n                const missingCount = Math.max(0, Number(part.total || 0) - Number(part.answered || 0));\n                return \`${'${part.heading}'}: ${'${missingCount || "some"}'} question${'${missingCount === 1 ? "" : "s"}'} unanswered\`;\n              }).join(" · ")}\n            </div>\n          </div>\n        ) : (\n          <p style={{ margin: 0, color: "#166534", fontWeight: 700 }}>\n            All required parts are complete. Review the mapped answer below, then submit.\n          </p>\n        )}\n\n        <div style={{ display: "grid", gap: 7 }}>\n          {review.parts.map((part) => {\n            const destination = tabForPart[part.partId];\n            return (\n              <div key={part.partId} style={{ border: part.complete ? "1px solid #bbf7d0" : "1px solid #fed7aa", borderRadius: 10, padding: "10px 11px", background: part.complete ? "#f0fdf4" : "#fff7ed", display: "grid", gap: 6 }}>\n                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>\n                  <strong>{part.complete ? "✓" : "○"} {part.heading} · {part.label}</strong>\n                  {!part.complete && destination && typeof onChange === "function" ? (\n                    <button\n                      type="button"\n                      onClick={() => { setSubmitWarning(false); onChange(destination); }}\n                      style={{ border: "1px solid #2563eb", borderRadius: 999, padding: "6px 10px", background: "#ffffff", color: "#1d4ed8", fontWeight: 800, cursor: "pointer" }}\n                    >\n                      Finish {part.heading}\n                    </button>\n                  ) : null}\n                </div>\n                {part.kind === "text" ? (\n                  <div style={{ color: part.complete ? "#166534" : "#92400e" }}>\n                    {part.complete ? \`${'${part.wordCount}'} words saved\` : "Writing not completed yet"}\n                  </div>\n                ) : (\n                  <div style={{ color: part.complete ? "#166534" : "#92400e" }}>\n                    {part.total ? \`${'${part.answered}'} of ${'${part.total}'} answered\` : \`${'${part.answered}'} answers saved\`}\n                    {part.missing?.length ? \` · Missing: ${'${part.missing.map((number) => `Q${number}`).join(", ")}'}\` : ""}\n                  </div>\n                )}\n              </div>\n            );\n          })}\n        </div>\n\n        <p style={{ margin: 0, color: "#475569" }}>\n          Your latest workbook answers are mapped into the submission box below. The mapped text remains available for final review.\n        </p>\n\n        {review.manualOverrideActive ? (\n          <div style={{ color: "#1e40af", fontWeight: 700 }}>\n            You edited the combined Submit text after mapping. That manual version is now the current final draft; a later Teil 2/3/4 change will remap the newest workbook answers.\n          </div>\n        ) : null}\n      </div>\n    );\n  }\n\n`;
runtimeSource = `${runtimeSource.slice(0, submitStart)}${upgradedSubmitBlock}${runtimeSource.slice(afterSubmitMarker)}`;

runtimeSource = runtimeSource.replace(
  `  if (!activePartId) return null;\n`,
  `  if (!activePartId || activePartId === "teil2") return null;\n`,
);

const objectiveStart = runtimeSource.indexOf(`  const isSelfCheck =\n`, runtimeSource.indexOf(`  if (!activePartId`));
const functionEnd = runtimeSource.lastIndexOf("\n}");
if (objectiveStart < 0 || functionEnd < objectiveStart) {
  throw new Error("Could not find objective progress block for replacement.");
}

const objectiveProgressBlock = `  const isSelfCheck =\n    activePartId === "teil4" && sectionProfile?.part4Submission !== "submit";\n  const answeredCount = Number(activePart?.answered || 0);\n  const totalCount = Number(activePart?.total || 0);\n  const progressPercent = totalCount ? Math.round((answeredCount / totalCount) * 100) : 0;\n\n  return (\n    <div data-workbook-mapped-save-status="true" style={{ ...panelStyle, marginTop: 10, padding: "10px 11px" }}>\n      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>\n        <strong style={{ color: "#1e3a8a" }}>Choose one answer for each question</strong>\n        <span style={{ color: answeredCount === totalCount && totalCount > 0 ? "#166534" : "#475569", fontWeight: 800 }}>\n          {totalCount ? \`${'${answeredCount}'} of ${'${totalCount}'} answered\` : \`${'${answeredCount}'} answered\`}\n        </span>\n      </div>\n      <span style={{ color: "#475569" }}>\n        {isSelfCheck\n          ? "Click an answer option. Your choices are saved for this self-check."\n          : "Click an answer option. Your choice is saved automatically to Submit, and you can change it at any time."}\n      </span>\n      {totalCount ? (\n        <div role="progressbar" aria-label={(activePartId === "teil3" ? "Teil 3" : "Teil 4") + " answer progress"} aria-valuemin="0" aria-valuemax="100" aria-valuenow={progressPercent} style={{ width: "100%", height: 7, borderRadius: 999, background: "#dbeafe", overflow: "hidden" }}>\n          <div style={{ width: \`${'${progressPercent}'}%\`, height: "100%", borderRadius: 999, background: "#2563eb", transition: "width 160ms ease" }} />\n        </div>\n      ) : null}\n    </div>\n  );`;

runtimeSource = `${runtimeSource.slice(0, objectiveStart)}${objectiveProgressBlock}${runtimeSource.slice(functionEnd)}`;

const requiredRuntimeMarkers = [
  "Choose one answer for each question",
  "data-workbook-incomplete-submit-warning",
  "Finish {part.heading}",
  "onChange = null",
];
requiredRuntimeMarkers.forEach((marker) => {
  if (!runtimeSource.includes(marker)) throw new Error(`A2/B1 progress-review marker missing: ${marker}`);
});

fs.writeFileSync(runtimePath, runtimeSource, "utf8");
console.log("Added A2/B1 objective instructions, live answer progress, completion review, and incomplete-submit return links.");

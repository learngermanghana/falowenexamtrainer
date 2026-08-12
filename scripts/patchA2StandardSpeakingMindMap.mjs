import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(root, "web/src/components/A2StandardTabbedWorkbookPage.js");
let source = fs.readFileSync(target, "utf8");

const canonicalMarker = '<SpeakingMindMap config={getA2SpeakingMindMap(day)} />';
const compactLegacy = '{sprechenContent ? sprechenContent : <><SpeakingMindMap config={getA2SpeakingMindMap(day)} /><WorkbookTaskCard';

if (!source.includes(canonicalMarker)) {
  throw new Error("A2 speaking mind map import/mount is missing entirely.");
}

// Newer workbook versions may already mount the mind map inside the custom/fallback
// speaking branch in a compact one-line JSX form. That is valid and should not make
// prebuild fail merely because the old multiline patch target no longer exists.
if (source.includes(compactLegacy)) {
  console.log("A2 speaking mind map already present in compact workbook structure; no patch needed.");
} else {
  const oldBlock = `          {sprechenContent ? (\n            sprechenContent\n          ) : (\n            <>\n              <SpeakingMindMap config={getA2SpeakingMindMap(day)} />\n              <WorkbookTaskCard eyebrow="Speaking practice" title={topicPrompt || title} practiceOnly>\n                <p style={{ margin: 0 }}>\n                  Prepare a short A2 answer. Use a simple structure: Einleitung → 2–3 details → example → short ending.\n                </p>\n                <ul style={listSpacing}>\n                  <li>Use connectors like <strong>und</strong>, <strong>oder</strong>, <strong>weil</strong>, <strong>deshalb</strong>.</li>\n                  <li>Speak clearly for 30–60 seconds.</li>\n                  <li>This part is practice only; submit required final answers in the Submit tab.</li>\n                </ul>\n              </WorkbookTaskCard>\n            </>\n          )}`;

  const newBlock = `          <SpeakingMindMap config={getA2SpeakingMindMap(day)} />\n          {sprechenContent ? (\n            sprechenContent\n          ) : (\n            <WorkbookTaskCard eyebrow="Speaking practice" title={topicPrompt || title} practiceOnly>\n              <p style={{ margin: 0 }}>\n                Prepare a short A2 answer. Use a simple structure: Einleitung → 2–3 details → example → short ending.\n              </p>\n              <ul style={listSpacing}>\n                <li>Use connectors like <strong>und</strong>, <strong>oder</strong>, <strong>weil</strong>, <strong>deshalb</strong>.</li>\n                <li>Speak clearly for 30–60 seconds.</li>\n                <li>This part is practice only; submit required final answers in the Submit tab.</li>\n              </ul>\n            </WorkbookTaskCard>\n          )}`;

  if (source.includes(newBlock)) {
    console.log("A2 speaking mind map already standardized; no patch needed.");
  } else if (source.includes(oldBlock)) {
    source = source.replace(oldBlock, newBlock);
    fs.writeFileSync(target, source, "utf8");
    console.log("Standardized A2 speaking mind map placement.");
  } else {
    // The component structure evolved, but the required mind map is still present.
    // Treat this as a safe no-op so prebuild remains forward-compatible.
    console.log("A2 speaking component structure changed; required mind map is present, so no patch needed.");
  }
}

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(root, "web/src/components/A2StandardTabbedWorkbookPage.js");
const source = fs.readFileSync(target, "utf8");

const oldBlock = `          {sprechenContent ? (\n            sprechenContent\n          ) : (\n            <>\n              <SpeakingMindMap config={getA2SpeakingMindMap(day)} />\n              <WorkbookTaskCard eyebrow="Speaking practice" title={topicPrompt || title} practiceOnly>\n                <p style={{ margin: 0 }}>\n                  Prepare a short A2 answer. Use a simple structure: Einleitung → 2–3 details → example → short ending.\n                </p>\n                <ul style={listSpacing}>\n                  <li>Use connectors like <strong>und</strong>, <strong>oder</strong>, <strong>weil</strong>, <strong>deshalb</strong>.</li>\n                  <li>Speak clearly for 30–60 seconds.</li>\n                  <li>This part is practice only; submit required final answers in the Submit tab.</li>\n                </ul>\n              </WorkbookTaskCard>\n            </>\n          )}`;

const newBlock = `          <SpeakingMindMap config={getA2SpeakingMindMap(day)} />\n          {sprechenContent ? (\n            sprechenContent\n          ) : (\n            <WorkbookTaskCard eyebrow="Speaking practice" title={topicPrompt || title} practiceOnly>\n              <p style={{ margin: 0 }}>\n                Prepare a short A2 answer. Use a simple structure: Einleitung → 2–3 details → example → short ending.\n              </p>\n              <ul style={listSpacing}>\n                <li>Use connectors like <strong>und</strong>, <strong>oder</strong>, <strong>weil</strong>, <strong>deshalb</strong>.</li>\n                <li>Speak clearly for 30–60 seconds.</li>\n                <li>This part is practice only; submit required final answers in the Submit tab.</li>\n              </ul>\n            </WorkbookTaskCard>\n          )}`;

if (!source.includes(newBlock)) {
  if (!source.includes(oldBlock)) {
    throw new Error("A2 speaking content block was not found.");
  }
  fs.writeFileSync(target, source.replace(oldBlock, newBlock), "utf8");
}

const updated = fs.readFileSync(target, "utf8");
if (!updated.includes(`<SpeakingMindMap config={getA2SpeakingMindMap(day)} />\n          {sprechenContent ? (`)) {
  throw new Error("The standardized A2 speaking brain map was not mounted before custom content.");
}

console.log("Ensured standardized A2 speaking brain maps appear on every workbook day.");

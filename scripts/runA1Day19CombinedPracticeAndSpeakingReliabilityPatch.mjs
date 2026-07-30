import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptsDir, "..");
const patchPath = path.join(scriptsDir, "patchA1Day19CombinedPracticeAndSpeakingReliability.mjs");
let source = fs.readFileSync(patchPath, "utf8");

// The patch writes a React template literal into SpeakingPage. Escape only
// unescaped expressions so repeated pretest/prebuild runs remain idempotent.
const escaped = source.replace(/(?<!\\)\$\{transcript\}/g, "\\${transcript}");
if (escaped !== source) fs.writeFileSync(patchPath, escaped);

await import(`${pathToFileURL(patchPath).href}?run=${Date.now()}`);

// The original panel already contains another softPanel, so a broad
// replacement marker can make the patch believe the hardcoded video was
// removed. Finish that one range with a unique resource-owned marker.
const panelPath = path.join(root, "web/src/components/A1ExamSpeakingPracticePanel.js");
let panel = fs.readFileSync(panelPath, "utf8");
const videoStart = "    {showVideo ? (";
const videoEnd = "    ) : null}\n\n    <div style={softPanel}>";
if (panel.includes(videoStart)) {
  const startIndex = panel.indexOf(videoStart);
  const endIndex = panel.indexOf(videoEnd, startIndex);
  if (endIndex < 0) throw new Error("Could not finish removing the hardcoded Day 19 AI video.");
  const resourceNote = `    <div data-ai-video-resource-note="true" style={softPanel}>\n      <strong>AI video</strong>\n      <span>The Goethe A1 speaking video is provided in the lesson materials as the official Chapter 5.9 AI-video resource.</span>\n    </div>\n\n    <div style={softPanel}>`;
  panel = `${panel.slice(0, startIndex)}${resourceNote}${panel.slice(endIndex + videoEnd.length)}`;
  fs.writeFileSync(panelPath, panel);
}

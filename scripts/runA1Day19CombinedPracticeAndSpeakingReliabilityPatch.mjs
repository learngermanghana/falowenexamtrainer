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

// PR #2323 constrained every course Goethe Free Chat to a viewport-height box
// with its own transcript scroller. That kept the composer visible, but it also
// cropped long A2-C1 conversations and forced learners to scroll inside a small
// nested box. Restore normal document flow while keeping recording controls at
// their natural content size.
const freeChatPath = path.join(root, "web/src/components/GoetheFreeChatPage.js");
let freeChat = fs.readFileSync(freeChatPath, "utf8");

const fixedChatSection = `<section style={{ height: "min(760px, 76vh)", minHeight: 540, maxHeight: 760, overflow: "hidden", display: "grid", gridTemplateRows: "minmax(0, 1fr) auto", background: "#e5e7eb" }}>`;
const originalChatSection = `<section style={{ minHeight: 540, display: "grid", gridTemplateRows: "1fr auto", background: "#e5e7eb" }}>`;
const flowingChatSection = `<section data-goethe-free-chat-conversation="page-flow" style={{ minHeight: 540, display: "grid", gridTemplateRows: "auto auto", background: "#e5e7eb" }}>`;

if (freeChat.includes(fixedChatSection)) {
  freeChat = freeChat.replace(fixedChatSection, flowingChatSection);
} else if (freeChat.includes(originalChatSection)) {
  freeChat = freeChat.replace(originalChatSection, flowingChatSection);
} else if (!freeChat.includes(flowingChatSection)) {
  throw new Error("Could not restore Goethe Free Chat page-flow section.");
}

const fixedMessageScroller = `<div style={{ padding: 16, display: "grid", gap: 12, overflowY: "auto", minHeight: 0, alignContent: "start" }}>`;
const originalMessageScroller = `<div style={{ padding: 16, display: "grid", gap: 12, overflowY: "auto", alignContent: "start" }}>`;
const flowingMessages = `<div data-goethe-free-chat-messages="page-flow" style={{ padding: 16, display: "grid", gap: 12, overflow: "visible", alignContent: "start" }}>`;

if (freeChat.includes(fixedMessageScroller)) {
  freeChat = freeChat.replace(fixedMessageScroller, flowingMessages);
} else if (freeChat.includes(originalMessageScroller)) {
  freeChat = freeChat.replace(originalMessageScroller, flowingMessages);
} else if (!freeChat.includes(flowingMessages)) {
  throw new Error("Could not restore Goethe Free Chat message page flow.");
}

const originalRecordControls = `<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>\n              <button type="button" style={{ ...styles.primaryButton, background: "#047857" }} onClick={isRecording ? stopRecording : startRecording} disabled={loading || isEnded}>`;
const stableRecordControls = `<div data-goethe-free-chat-record-controls="stable" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>\n              <button type="button" style={{ ...styles.primaryButton, background: "#047857", alignSelf: "flex-start", flex: "0 0 auto", minHeight: 44 }} onClick={isRecording ? stopRecording : startRecording} disabled={loading || isEnded}>`;

if (freeChat.includes(originalRecordControls)) {
  freeChat = freeChat.replace(originalRecordControls, stableRecordControls);
} else if (!freeChat.includes(stableRecordControls)) {
  throw new Error("Could not stabilize Goethe Free Chat recording controls.");
}

fs.writeFileSync(freeChatPath, freeChat);

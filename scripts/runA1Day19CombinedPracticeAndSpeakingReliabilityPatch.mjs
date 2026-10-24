import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptsDir, "..");
const patchPath = path.join(scriptsDir, "patchA1Day19CombinedPracticeAndSpeakingReliability.mjs");
const freeChatPath = path.join(root, "web/src/components/GoetheFreeChatPage.js");

const fixedChatSection = `<section style={{ height: "min(760px, 76vh)", minHeight: 540, maxHeight: 760, overflow: "hidden", display: "grid", gridTemplateRows: "minmax(0, 1fr) auto", background: "#e5e7eb" }}>`;
const originalChatSection = `<section style={{ minHeight: 540, display: "grid", gridTemplateRows: "1fr auto", background: "#e5e7eb" }}>`;
const flowingChatSection = `<section data-goethe-free-chat-conversation="page-flow" style={{ minHeight: 540, display: "grid", gridTemplateRows: "auto auto", background: "#e5e7eb" }}>`;
const fixedMessageScroller = `<div style={{ padding: 16, display: "grid", gap: 12, overflowY: "auto", minHeight: 0, alignContent: "start" }}>`;
const originalMessageScroller = `<div style={{ padding: 16, display: "grid", gap: 12, overflowY: "auto", alignContent: "start" }}>`;
const flowingMessages = `<div data-goethe-free-chat-messages="page-flow" style={{ padding: 16, display: "grid", gap: 12, overflow: "visible", alignContent: "start" }}>`;
const originalRecordControls = `<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>\n              <button type="button" style={{ ...styles.primaryButton, background: "#047857" }} onClick={isRecording ? stopRecording : startRecording} disabled={loading || isEnded}>`;
const stableRecordControls = `<div data-goethe-free-chat-record-controls="stable" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>\n              <button type="button" style={{ ...styles.primaryButton, background: "#047857", alignSelf: "flex-start", flex: "0 0 auto", minHeight: 44 }} onClick={isRecording ? stopRecording : startRecording} disabled={loading || isEnded}>`;

// The course Goethe Free Chat had its own design before the Exams Room
// recording-panel fix. Normalize any earlier page-flow/stable-control rewrite
// back to that original design before the legacy patch runs, so the patch stays
// rerunnable and can still add transcript retry/status behaviour.
if (fs.existsSync(freeChatPath)) {
  let preparedFreeChat = fs.readFileSync(freeChatPath, "utf8");
  preparedFreeChat = preparedFreeChat.replace(flowingChatSection, originalChatSection);
  preparedFreeChat = preparedFreeChat.replace(flowingMessages, originalMessageScroller);
  preparedFreeChat = preparedFreeChat.replace(stableRecordControls, originalRecordControls);
  fs.writeFileSync(freeChatPath, preparedFreeChat);
}

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

// The fixed-height layout belongs only to the Exams Room Goethe examiner chat.
// Keep the Free Chat's original layout and compact Record button while retaining
// the transcript retry and transcript-status changes applied above.
let freeChat = fs.readFileSync(freeChatPath, "utf8");
freeChat = freeChat.replace(fixedChatSection, originalChatSection);
freeChat = freeChat.replace(flowingChatSection, originalChatSection);
freeChat = freeChat.replace(fixedMessageScroller, originalMessageScroller);
freeChat = freeChat.replace(flowingMessages, originalMessageScroller);
freeChat = freeChat.replace(stableRecordControls, originalRecordControls);

if (!freeChat.includes(originalChatSection)) {
  throw new Error("Could not restore the original Goethe Free Chat section.");
}
if (!freeChat.includes(originalMessageScroller)) {
  throw new Error("Could not restore the original Goethe Free Chat message area.");
}
if (!freeChat.includes(originalRecordControls)) {
  throw new Error("Could not restore the original Goethe Free Chat recording controls.");
}

fs.writeFileSync(freeChatPath, freeChat);

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const paths = {
  page: path.join(root, "web/src/components/VerbotenErlaubtPage.js"),
  panel: path.join(root, "web/src/components/A1ExamSpeakingPracticePanel.js"),
  autoMount: path.join(root, "web/src/components/A1CoursePracticeAutoMount.js"),
  override: path.join(root, "web/src/data/a1LessonVideoResourceOverrides.js"),
  speakingAudio: path.join(root, "web/src/lib/speakingAudio.js"),
  speakingPage: path.join(root, "web/src/components/SpeakingPage.js"),
  freeChat: path.join(root, "web/src/components/GoetheFreeChatPage.js"),
};

const read = (file) => fs.readFileSync(file, "utf8");
const write = (file, content) => fs.writeFileSync(file, content);

const replaceOnce = (source, before, after, label) => {
  if (source.includes(after)) return source;
  if (!source.includes(before)) throw new Error(`Could not find ${label}.`);
  return source.replace(before, after);
};

const replaceRange = (source, start, end, replacement, label) => {
  if (source.includes(replacement)) return source;
  const startIndex = source.indexOf(start);
  if (startIndex < 0) throw new Error(`Could not find ${label} start.`);
  const endIndex = source.indexOf(end, startIndex + start.length);
  if (endIndex < 0) throw new Error(`Could not find ${label} end.`);
  return `${source.slice(0, startIndex)}${replacement}${source.slice(endIndex + end.length)}`;
};

let page = read(paths.page);
page = replaceOnce(
  page,
  `{knowledgeQuestions.map((question, index) => {\n          const selected = answers[index];`,
  `{knowledgeQuestions.map((question, index) => {\n          const rule = knowledgeRules[index];\n          const selected = answers[index];`,
  "combined rule lookup",
);
page = replaceOnce(
  page,
  `              <strong style={{ color: palette.ink }}>{index + 1}. {question.prompt}</strong>`,
  `              <div\n                data-combined-rule-question={index + 1}\n                style={{\n                  background: examMode ? "#f8fafc" : palette.indigoSoft,\n                  border: "1px solid #c7d2fe",\n                  borderRadius: 13,\n                  display: "grid",\n                  gap: 5,\n                  padding: 11,\n                }}\n              >\n                <span style={{ color: palette.indigo, fontSize: 11, fontWeight: 900, letterSpacing: ".06em", textTransform: "uppercase" }}>Rule {index + 1}</span>\n                <strong style={{ color: palette.ink, lineHeight: 1.5 }}>{rule?.german}</strong>\n                {!examMode && rule?.english ? <span style={{ color: palette.muted, fontSize: 13, lineHeight: 1.45 }}>{rule.english}</span> : null}\n              </div>\n              <strong style={{ color: palette.ink }}>{question.prompt}</strong>`,
  "combined rule card",
);
page = replaceRange(
  page,
  `        <div style={{ border: "1px solid #c7d2fe", borderRadius: 18, background: "linear-gradient(135deg,#eef2ff,#f8fafc)", padding: 16, display: "grid", gap: 12 }}>`,
  `        </div>\n        {!examMode ? (`,
  `        <Callout>\n          <strong>One card, one decision</strong>\n          <span>Read each rule and answer its matching question immediately below it. You no longer need to scroll between two repeated lists.</span>\n        </Callout>\n        {!examMode ? (`,
  "separate rules list",
);
page = page.replace(
  `: "Read the short rules. Green ✓ means allowed. Red ✕ means forbidden. Then answer the questions below."}`,
  `: "Read one short rule and answer its matching question on the same card. Green ✓ means allowed. Red ✕ means forbidden."}`,
);
write(paths.page, page);

let panel = read(paths.panel);
panel = panel.replace('const AI_VIDEO_ID = "gprnEZtMUPM";\n', "");
panel = panel.replace('const A1ExamSpeakingPracticePanel = ({ showVideo = true }) => (', 'const A1ExamSpeakingPracticePanel = () => (');
panel = replaceRange(
  panel,
  `    {showVideo ? (`,
  `    ) : null}\n\n    <div style={softPanel}>`,
  `    <div style={softPanel}>`,
  "hardcoded speaking video",
);
panel = panel.replace('title: "Watch the AI lesson",', 'title: "Complete the AI video step",');
panel = panel.replace('text: "See how Teil 1, Teil 2 and Teil 3 work before you start.",', 'text: "Open the lesson AI-video resource before you start the workbook practice.",');
panel = panel.replace(
  `        You do not need to leave the course book to practise. Watch the AI lesson,\n        choose a real Goethe A1 speaking prompt below, and send your answer for`,
  `        You do not need to leave the course book to practise. Complete the AI-video\n        step in the lesson materials, choose a real Goethe A1 speaking prompt below, and send your answer for`,
);
write(paths.panel, panel);

let autoMount = read(paths.autoMount);
autoMount = autoMount.replace('const A1_DAY_19_AI_VIDEO_URL = "https://youtu.be/gprnEZtMUPM";\n', "");
autoMount = replaceOnce(
  autoMount,
  `  const aiVideo = videos.find((video) => !isTeacherLectureResource(video))\n    || (Number(practice.day) === 19\n      ? {\n          url: A1_DAY_19_AI_VIDEO_URL,\n          title: "Goethe A1 Speaking Practice · AI video",\n          description: "AI-supported exam practice for Teil 1, Teil 2 and Teil 3.",\n        }\n      : null);`,
  `  const aiVideo = videos.find((video) => !isTeacherLectureResource(video)) || null;`,
  "Day 19 AI-video fallback",
);
autoMount = autoMount.replace(
  `\n  const duplicateVideoLink = Array.from(container?.querySelectorAll?.("a") || []).find((link) =>\n    String(link.getAttribute("href") || link.href || "").includes("gprnEZtMUPM"),\n  );\n  duplicateVideoLink?.closest("article")?.remove();`,
  "",
);
write(paths.autoMount, autoMount);

let override = read(paths.override);
const overrideKey = 'key: "a1-day19-goethe-speaking-practice-ai-video"';
const overrideIndex = override.indexOf(overrideKey);
if (overrideIndex < 0) throw new Error("Could not find Day 19 AI-video override.");
const overrideWindow = override.slice(overrideIndex, overrideIndex + 420);
if (overrideWindow.includes('chapter: "13"')) {
  override = `${override.slice(0, overrideIndex)}${overrideWindow.replace('chapter: "13"', 'chapter: "5.9"')}${override.slice(overrideIndex + overrideWindow.length)}`;
}
write(paths.override, override);

let speakingAudio = read(paths.speakingAudio);
if (!speakingAudio.includes("analyzeSpeakingAudioWithTranscriptRetry")) {
  const anchor = `export async function playAudioElement(audioElement) {`;
  const helper = `export async function analyzeSpeakingAudioWithTranscriptRetry({ analyze, payload, retryDelayMs = 250 } = {}) {\n  if (typeof analyze !== "function") throw new TypeError("A speaking audio analyzer is required.");\n  const firstResponse = await analyze(payload);\n  if (String(firstResponse?.transcript || "").trim()) return firstResponse;\n\n  if (retryDelayMs > 0) {\n    await new Promise((resolve) => setTimeout(resolve, retryDelayMs));\n  }\n\n  return analyze({ ...payload, transcriptionRetry: true });\n}\n\n${anchor}`;
  if (!speakingAudio.includes(anchor)) throw new Error("Could not find speaking audio helper anchor.");
  speakingAudio = speakingAudio.replace(anchor, helper);
}
write(paths.speakingAudio, speakingAudio);

let speakingPage = read(paths.speakingPage);
speakingPage = replaceOnce(
  speakingPage,
  `  SPEAKING_AUDIO_MIN_SECONDS as MIN_RECORDING_SECONDS,\n  buildRecordedAudioBlob,`,
  `  SPEAKING_AUDIO_MIN_SECONDS as MIN_RECORDING_SECONDS,\n  analyzeSpeakingAudioWithTranscriptRetry,\n  buildRecordedAudioBlob,`,
  "SpeakingPage retry import",
);
speakingPage = speakingPage.replace(
  `          duration,\n          createdAt: new Date().toISOString(),`,
  `          duration,\n          transcript: "",\n          transcriptionState: "pending",\n          createdAt: new Date().toISOString(),`,
);
speakingPage = replaceOnce(
  speakingPage,
  `            const response = await analyzeAudio({\n              audioBlob: blob,\n              teil: "Custom chat",\n              level: selectedLevel,\n              question: "Free custom speaking conversation",\n              userId,\n              idToken,\n              durationSeconds: duration,\n            });`,
  `            const response = await analyzeSpeakingAudioWithTranscriptRetry({\n              analyze: analyzeAudio,\n              payload: {\n                audioBlob: blob,\n                teil: "Custom chat",\n                level: selectedLevel,\n                question: "Free custom speaking conversation",\n                userId,\n                idToken,\n                durationSeconds: duration,\n              },\n            });`,
  "custom speaking transcript retry",
);
speakingPage = replaceOnce(
  speakingPage,
  `            if (!transcript) {\n              appendCustomCoachText("I could not hear a clear sentence. Please try recording again or type your message.");\n              return;\n            }\n\n            setCustomChatMessages((current) => current.map((message) => (\n              message.id === voiceMessage.id ? { ...message, transcript } : message\n            )));`,
  `            if (!transcript) {\n              setCustomChatMessages((current) => current.map((message) => (\n                message.id === voiceMessage.id ? { ...message, transcriptionState: "failed" } : message\n              )));\n              appendCustomCoachText("Falowen could not transcribe this recording after a retry. Play it back, then record again or type your message.");\n              return;\n            }\n\n            setCustomChatMessages((current) => current.map((message) => (\n              message.id === voiceMessage.id ? { ...message, transcript, transcriptionState: "done" } : message\n            )));`,
  "custom speaking transcript state",
);
speakingPage = replaceOnce(
  speakingPage,
  `            const response = await analyzeAudio({\n              audioBlob: blob,\n              teil: selectedQuestion.teilLabel || selectedQuestion.teilId || "",\n              level: selectedLevel,\n              question: selectedQuestion.text || selectedQuestion.topicPrompt || "",\n              userId,\n              idToken,\n              durationSeconds: duration,\n            });`,
  `            const response = await analyzeSpeakingAudioWithTranscriptRetry({\n              analyze: analyzeAudio,\n              payload: {\n                audioBlob: blob,\n                teil: selectedQuestion.teilLabel || selectedQuestion.teilId || "",\n                level: selectedLevel,\n                question: selectedQuestion.text || selectedQuestion.topicPrompt || "",\n                userId,\n                idToken,\n                durationSeconds: duration,\n              },\n            });`,
  "exam speaking transcript retry",
);
speakingPage = replaceOnce(
  speakingPage,
  `            if (transcript) {\n              appendCoachText(\`Transcript I heard: ${transcript}\`);\n            }`,
  `            setChatMessages((current) => current.map((message) => (\n              message.id === voiceMessage.id\n                ? { ...message, transcript, transcriptionState: transcript ? "done" : "failed" }\n                : message\n            )));\n            if (transcript) {\n              appendCoachText(\`Transcript I heard: ${transcript}\`);\n            } else {\n              appendCoachText("Falowen could not transcribe this recording after a retry. Your audio is still available; play it back and record again.");\n            }`,
  "exam speaking transcript state",
);
const stableSection = `<section\n                style={{\n                  background: "#E5E7EB",\n                  display: "grid",\n                  gridTemplateRows: "minmax(0, 1fr) auto",\n                  height: isCompactViewport ? "min(680px, 78vh)" : "min(760px, 76vh)",\n                  minHeight: isCompactViewport ? 480 : 580,\n                  maxHeight: isCompactViewport ? 680 : 760,\n                  overflow: "hidden",\n                }}\n              >`;
speakingPage = speakingPage.replaceAll(
  `<section style={{ background: "#E5E7EB", minHeight: isCompactViewport ? 480 : 580, display: "grid", gridTemplateRows: "1fr auto" }}>`,
  stableSection,
);
speakingPage = speakingPage.replaceAll(
  `<div style={{ padding: 16, overflowY: "auto", display: "grid", gap: 12 }}>`,
  `<div style={{ padding: 16, overflowY: "auto", minHeight: 0, display: "grid", gap: 12, alignContent: "start" }}>`,
);
const transcriptStatus = `{message.transcript ? (\n                              <span style={{ fontSize: 12, lineHeight: 1.5 }}>You said: {message.transcript}</span>\n                            ) : message.transcriptionState === "failed" ? (\n                              <span role="status" style={{ fontSize: 12, lineHeight: 1.5, color: "#FEF3C7" }}>Transcript unavailable — record again.</span>\n                            ) : (\n                              <span style={{ fontSize: 12, lineHeight: 1.5 }}>Transcribing…</span>\n                            )}`;
speakingPage = replaceOnce(
  speakingPage,
  `                            <audio\n                              ref={(node) => {\n                                if (node) {\n                                  audioRefs.current[message.id] = node;\n                                  node.onended = () => setPlayingMessageId("");\n                                  node.onerror = () => { setPlayingMessageId(""); setPlaybackError("This device cannot play the recording format. Please record again."); };\n                                }\n                              }}\n                              src={message.audioUrl}\n                            />\n                          </div>`,
  `                            <audio\n                              ref={(node) => {\n                                if (node) {\n                                  audioRefs.current[message.id] = node;\n                                  node.onended = () => setPlayingMessageId("");\n                                  node.onerror = () => { setPlayingMessageId(""); setPlaybackError("This device cannot play the recording format. Please record again."); };\n                                }\n                              }}\n                              src={message.audioUrl}\n                            />\n                            ${transcriptStatus}\n                          </div>`,
  "custom audio transcript display",
);
speakingPage = replaceOnce(
  speakingPage,
  `                          <audio\n                            ref={(node) => {\n                              if (node) {\n                                audioRefs.current[message.id] = node;\n                                node.onended = () => setPlayingMessageId("");\n                                  node.onerror = () => { setPlayingMessageId(""); setPlaybackError("This device cannot play the recording format. Please record again."); };\n                              }\n                            }}\n                            src={message.audioUrl}\n                          />\n                        </div>`,
  `                          <audio\n                            ref={(node) => {\n                              if (node) {\n                                audioRefs.current[message.id] = node;\n                                node.onended = () => setPlayingMessageId("");\n                                  node.onerror = () => { setPlayingMessageId(""); setPlaybackError("This device cannot play the recording format. Please record again."); };\n                              }\n                            }}\n                            src={message.audioUrl}\n                          />\n                          ${transcriptStatus}\n                        </div>`,
  "exam audio transcript display",
);
write(paths.speakingPage, speakingPage);

let freeChat = read(paths.freeChat);
freeChat = replaceOnce(
  freeChat,
  `  SPEAKING_AUDIO_MIN_SECONDS,\n  buildRecordedAudioBlob,`,
  `  SPEAKING_AUDIO_MIN_SECONDS,\n  analyzeSpeakingAudioWithTranscriptRetry,\n  buildRecordedAudioBlob,`,
  "free chat retry import",
);
freeChat = freeChat.replace(
  `          transcript: "",\n          createdAt: new Date().toISOString(),`,
  `          transcript: "",\n          transcriptionState: "pending",\n          createdAt: new Date().toISOString(),`,
);
freeChat = replaceOnce(
  freeChat,
  `          const response = await analyzeAudio({\n            audioBlob: blob,\n            teil: "Custom chat",\n            level,\n            question: topic || "Free custom speaking conversation",\n            userId,\n            idToken,\n            durationSeconds: duration,\n          });`,
  `          const response = await analyzeSpeakingAudioWithTranscriptRetry({\n            analyze: analyzeAudio,\n            payload: {\n              audioBlob: blob,\n              teil: "Custom chat",\n              level,\n              question: topic || "Free custom speaking conversation",\n              userId,\n              idToken,\n              durationSeconds: duration,\n            },\n          });`,
  "free chat transcript retry",
);
freeChat = replaceOnce(
  freeChat,
  `          if (!transcript) {\n            appendCoachText("I could not hear a clear sentence. Please try recording again or type your message.");\n            return;\n          }\n\n          setMessages((current) => current.map((message) => (\n            message.id === voiceMessage.id ? { ...message, transcript } : message\n          )));`,
  `          if (!transcript) {\n            setMessages((current) => current.map((message) => (\n              message.id === voiceMessage.id ? { ...message, transcriptionState: "failed" } : message\n            )));\n            appendCoachText("Falowen could not transcribe this recording after a retry. Play it back, then record again or type your message.");\n            return;\n          }\n\n          setMessages((current) => current.map((message) => (\n            message.id === voiceMessage.id ? { ...message, transcript, transcriptionState: "done" } : message\n          )));`,
  "free chat transcript state",
);
freeChat = replaceOnce(
  freeChat,
  `<section style={{ minHeight: 540, display: "grid", gridTemplateRows: "1fr auto", background: "#e5e7eb" }}>`,
  `<section style={{ height: "min(760px, 76vh)", minHeight: 540, maxHeight: 760, overflow: "hidden", display: "grid", gridTemplateRows: "minmax(0, 1fr) auto", background: "#e5e7eb" }}>`,
  "free chat stable height",
);
freeChat = replaceOnce(
  freeChat,
  `<div style={{ padding: 16, display: "grid", gap: 12, overflowY: "auto", alignContent: "start" }}>`,
  `<div style={{ padding: 16, display: "grid", gap: 12, overflowY: "auto", minHeight: 0, alignContent: "start" }}>`,
  "free chat message scroller",
);
freeChat = replaceOnce(
  freeChat,
  `{message.transcript ? <span style={{ fontSize: 12, lineHeight: 1.5 }}>You said: {message.transcript}</span> : <span style={{ fontSize: 12 }}>Transcribing…</span>}`,
  `{message.transcript ? (\n                          <span style={{ fontSize: 12, lineHeight: 1.5 }}>You said: {message.transcript}</span>\n                        ) : message.transcriptionState === "failed" ? (\n                          <span role="status" style={{ fontSize: 12, lineHeight: 1.5 }}>Transcript unavailable — record again.</span>\n                        ) : (\n                          <span style={{ fontSize: 12 }}>Transcribing…</span>\n                        )}`,
  "free chat transcript status",
);
write(paths.freeChat, freeChat);

console.log("Applied A1 Day 19 combined practice and speaking reliability patch.");

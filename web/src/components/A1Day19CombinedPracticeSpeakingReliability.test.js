import fs from "node:fs";
import path from "node:path";
import React from "react";
import { render, screen } from "@testing-library/react";
import A1ExamSpeakingPracticePanel from "./A1ExamSpeakingPracticePanel";
import { applyA1LessonVideoResourceOverrides } from "../data/a1LessonVideoResourceOverrides";
import { getAdditionalLessonVideoResources } from "../data/additionalLessonVideoResources";

jest.mock("./SpeakingPage", () => () => <div data-testid="speaking-page" />);

const source = (relativePath) => fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

describe("A1 Day 19 combined practice and speaking reliability", () => {
  test("owns the YouTube lesson as a Chapter 5.9 AI-video resource", () => {
    const dictionary = applyA1LessonVideoResourceOverrides({});
    const overrideVideo = dictionary.A1[19].videoResources.find((video) => video.url.includes("gprnEZtMUPM"));
    const additionalVideo = getAdditionalLessonVideoResources("A1", 19).find((video) => video.url.includes("gprnEZtMUPM"));

    expect(overrideVideo).toEqual(expect.objectContaining({ chapter: "5.9", title: expect.stringContaining("AI video") }));
    expect(additionalVideo).toEqual(expect.objectContaining({ chapter: "5.9", title: expect.stringContaining("AI video") }));
  });

  test("does not hardcode the AI video inside the workbook speaking panel", () => {
    render(<A1ExamSpeakingPracticePanel />);

    expect(screen.getByTestId("speaking-page")).toBeVisible();
    expect(screen.queryByTitle(/AI video/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Open video on YouTube/i })).not.toBeInTheDocument();
    expect(source("src/components/A1ExamSpeakingPracticePanel.js")).not.toContain("gprnEZtMUPM");
    expect(source("src/components/A1CoursePracticeAutoMount.js")).not.toContain("A1_DAY_19_AI_VIDEO_URL");
  });

  test("keeps the fixed recording panel only in Exams Room and preserves the original Free Chat design", () => {
    const speakingPage = source("src/components/SpeakingPage.js");
    const freeChat = source("src/components/GoetheFreeChatPage.js");

    expect(speakingPage).toContain("analyzeSpeakingAudioWithTranscriptRetry");
    expect(speakingPage).toContain('transcriptionState: "failed"');
    expect(speakingPage).toContain('gridTemplateRows: "minmax(0, 1fr) auto"');
    expect(speakingPage).toContain('maxHeight: isCompactViewport ? 680 : 760');
    expect(speakingPage).toContain("Transcript unavailable — record again.");

    expect(freeChat).toContain("analyzeSpeakingAudioWithTranscriptRetry");
    expect(freeChat).toContain("Transcript unavailable — record again.");
    expect(freeChat).toContain('<section style={{ minHeight: 540, display: "grid", gridTemplateRows: "1fr auto", background: "#e5e7eb" }}>');
    expect(freeChat).toContain('<div style={{ padding: 16, display: "grid", gap: 12, overflowY: "auto", alignContent: "start" }}>');
    expect(freeChat).toContain('<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>');
    expect(freeChat).toContain('style={{ ...styles.primaryButton, background: "#047857" }}');

    expect(freeChat).not.toContain('data-goethe-free-chat-conversation="page-flow"');
    expect(freeChat).not.toContain('data-goethe-free-chat-messages="page-flow"');
    expect(freeChat).not.toContain('data-goethe-free-chat-record-controls="stable"');
    expect(freeChat).not.toContain('height: "min(760px, 76vh)"');
    expect(freeChat).not.toContain('maxHeight: 760');
    expect(freeChat).not.toContain('flex: "0 0 auto"');
    expect(freeChat).not.toContain('minHeight: 44');
  });
});

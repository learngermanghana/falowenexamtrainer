import React from "react";
import { isA2WritingRequired } from "../data/a2WritingSchedule";
import { isB1WritingRequired } from "../data/b1WritingSchedule";

const shell = {
  border: "2px solid #c7d2fe",
  borderRadius: 16,
  padding: 14,
  background: "linear-gradient(135deg, #eef2ff, #ffffff)",
  display: "grid",
  gap: 10,
};

const item = {
  border: "1px solid #dbeafe",
  borderRadius: 12,
  padding: 11,
  background: "#ffffff",
  display: "grid",
  gap: 5,
  lineHeight: 1.6,
};

const challenges = {
  A2: [
    {
      title: "1 · Find two clues",
      text: "Choose two questions. For each one, find two details in the text that support the correct answer. Do not rely on one matching word only.",
    },
    {
      title: "2 · Reject a distractor",
      text: "Choose one wrong answer option and point to the detail in the text that proves it cannot be correct.",
    },
    {
      title: "3 · Change the situation",
      text: "Choose one question and imagine one detail in the text changes. Which answer would become correct then? Explain the change in one short sentence.",
    },
  ],
  B1: [
    {
      title: "1 · Evidence, not keywords",
      text: "Choose two questions and justify each answer with evidence from different parts of the text. A repeated keyword alone is not enough.",
    },
    {
      title: "2 · Main idea vs. detail",
      text: "Identify one sentence that gives the main idea and one sentence that is only supporting detail. Be ready to explain the difference.",
    },
    {
      title: "3 · Eliminate a distractor",
      text: "Choose the most convincing wrong option from one question. Explain precisely why the text rules it out.",
    },
    {
      title: "4 · Paraphrase",
      text: "Choose one important sentence from the text and express the same meaning in different German words.",
    },
  ],
};

export const isNoWritingReadingChallengeDay = (level, day) => {
  const normalizedLevel = String(level || "").toUpperCase();
  if (normalizedLevel === "A2") return !isA2WritingRequired(day);
  if (normalizedLevel === "B1") return !isB1WritingRequired(day);
  return false;
};

export default function A2B1NoWritingReadingChallenge({ level, day }) {
  const normalizedLevel = String(level || "").toUpperCase();
  if (!isNoWritingReadingChallengeDay(normalizedLevel, day)) return null;
  const prompts = challenges[normalizedLevel] || [];
  if (!prompts.length) return null;

  return (
    <section data-no-writing-reading-challenge="true" style={shell}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#4338ca", textTransform: "uppercase", letterSpacing: ".05em" }}>
            Second pass · Reading challenge
          </div>
          <h3 style={{ margin: "3px 0 0" }}>Go beyond finding the obvious answer</h3>
        </div>
        <span style={{ borderRadius: 999, padding: "5px 9px", background: "#e0e7ff", color: "#3730a3", fontSize: 12, fontWeight: 900 }}>
          No extra submission
        </span>
      </div>
      <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
        This is a no-Schreiben lesson, so Lesen should do more of the thinking work. Complete these checks after the multiple-choice questions and be ready to explain your evidence in class.
      </p>
      <div style={{ display: "grid", gap: 8 }}>
        {prompts.map((prompt) => (
          <div key={prompt.title} style={item}>
            <strong>{prompt.title}</strong>
            <span>{prompt.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

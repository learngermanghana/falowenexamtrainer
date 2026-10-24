import React, { useState } from "react";
import { styles } from "../styles";

export const A2_FORMAL_LETTER_TEMPLATE = `Sehr geehrte Damen und Herren,
Sehr geehrte Frau [Name] / Sehr geehrter Herr [Name],

ich schreibe Ihnen, weil [Grund].

Ich möchte Ihnen mitteilen, dass [Information 1]. Außerdem [Information 2].

Könnten Sie mir bitte [Bitte oder Frage]?

Vielen Dank im Voraus.

Mit freundlichen Grüßen
[Ihr Name]`;

export const A2_INFORMAL_LETTER_TEMPLATE = `Liebe/r [Name],
Hallo [Name],

wie geht es dir? Ich hoffe, es geht dir gut.

Ich schreibe dir, weil [Grund].

Ich möchte dir erzählen, dass [Information 1]. Außerdem [Information 2].

Wie geht es dir? / Was meinst du dazu? / Kannst du mir bitte antworten?

Ich freue mich auf deine Antwort.

Viele Grüße
[Dein Name]`;

const LETTER_TYPES = [
  {
    key: "informal",
    label: "Informal letter",
    useFor: "Use this for a friend, family member or someone you know personally.",
    template: A2_INFORMAL_LETTER_TEMPLATE,
  },
  {
    key: "formal",
    label: "Formal letter",
    useFor: "Use this for a company, school, landlord, office, course provider or an unknown person.",
    template: A2_FORMAL_LETTER_TEMPLATE,
  },
];

const panelStyle = {
  border: "1px solid #bfdbfe",
  borderRadius: 14,
  padding: 14,
  background: "#f8fbff",
  display: "grid",
  gap: 12,
};

const planningStyle = {
  ...panelStyle,
  borderColor: "#c4b5fd",
  background: "#faf5ff",
};

const textareaStyle = {
  width: "100%",
  minHeight: 150,
  border: "1px solid #a78bfa",
  borderRadius: 12,
  padding: 12,
  fontSize: 16,
  lineHeight: 1.7,
  resize: "vertical",
  boxSizing: "border-box",
  background: "#fff",
};

const pointsPlaceholder = `Write simple points first. English is okay here.

1. Why am I writing?
2. Who am I writing to?
3. What information must I include?
4. What question or request do I have?
5. How will I end the letter?

Example:
1. tell Felix about my work and family
2. Felix is my friend, so use informal German
3. my job is interesting; my sister has a new baby
4. ask what is new with him
5. say I look forward to his answer`;

export function A2WritingPlanner() {
  const [planningNotes, setPlanningNotes] = useState("");

  return (
    <div data-a2-writing-workspace="true" style={{ display: "grid", gap: 14 }}>
      <section style={planningStyle}>
        <div style={{ display: "grid", gap: 5 }}>
          <span style={{ ...styles.badge, width: "fit-content", background: "#ede9fe", color: "#5b21b6" }}>
            Step 1
          </span>
          <strong>Write your points first</strong>
          <p style={{ margin: 0, color: "#5b21b6", lineHeight: 1.65 }}>
            English is okay in this box. Plan the required points before you begin the German letter.
          </p>
        </div>
        <textarea
          value={planningNotes}
          onChange={(event) => setPlanningNotes(event.target.value)}
          placeholder={pointsPlaceholder}
          aria-label="A2 writing points in English"
          style={textareaStyle}
          inputMode="text"
          autoCapitalize="sentences"
          autoCorrect="on"
        />
      </section>

      <section style={{ ...panelStyle, borderColor: "#86efac", background: "#f0fdf4" }}>
        <strong>Step 2 · Write and analyse below</strong>
        <p style={{ margin: 0, color: "#166534", lineHeight: 1.65 }}>
          Write your German text directly in the analysis box below. The same box is used for writing and feedback, so you do not need to copy your draft.
        </p>
      </section>
    </div>
  );
}

const TemplateCard = ({ type }) => (
  <section style={panelStyle}>
    <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e40af" }}>
      {type.label.toUpperCase()}
    </span>
    <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>{type.useFor}</p>
    <pre
      style={{
        margin: 0,
        whiteSpace: "pre-wrap",
        overflowWrap: "anywhere",
        fontFamily: "inherit",
        lineHeight: 1.7,
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: 12,
      }}
    >
      {type.template}
    </pre>
  </section>
);

export function A2LetterTemplateCheatSheet() {
  return (
    <div data-a2-letter-template-cheat-sheet="true" style={{ display: "grid", gap: 14 }}>
      <section style={{ ...panelStyle, background: "#eff6ff" }}>
        <strong>Choose the correct register</strong>
        <ul style={{ margin: 0, paddingLeft: 22, lineHeight: 1.75 }}>
          <li><strong>Informal:</strong> use <em>du, dir, dich, dein</em> for friends and family.</li>
          <li><strong>Formal:</strong> use <em>Sie, Ihnen, Ihr</em> for offices, companies and unknown people.</li>
          <li>Answer every required point from the task.</li>
          <li>Use a greeting, reason, clear details, a question or request, and a closing.</li>
        </ul>
      </section>

      {LETTER_TYPES.map((type) => <TemplateCard key={type.key} type={type} />)}
    </div>
  );
}

export const __TESTING__ = {
  LETTER_TYPES,
  pointsPlaceholder,
};

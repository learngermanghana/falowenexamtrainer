import React, { useMemo, useState } from "react";
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

const draftTextareaStyle = {
  ...textareaStyle,
  minHeight: 310,
  borderColor: "#93c5fd",
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

const replaceTemplateSafely = ({ draft, nextTemplate, setDraft }) => {
  const current = String(draft || "").trim();
  const knownTemplate = LETTER_TYPES.some((type) => current === type.template.trim());

  if (current && !knownTemplate && current !== nextTemplate.trim()) {
    const shouldReplace = window.confirm(
      "This will replace your current A2 draft with the selected template. Continue?"
    );
    if (!shouldReplace) return false;
  }

  setDraft(nextTemplate);
  return true;
};

export function A2WritingPlanner() {
  const [planningNotes, setPlanningNotes] = useState("");
  const [letterType, setLetterType] = useState("informal");
  const [draft, setDraft] = useState(A2_INFORMAL_LETTER_TEMPLATE);
  const selectedType = useMemo(
    () => LETTER_TYPES.find((type) => type.key === letterType) || LETTER_TYPES[0],
    [letterType]
  );

  const chooseType = (type) => {
    if (!replaceTemplateSafely({ draft, nextTemplate: type.template, setDraft })) return;
    setLetterType(type.key);
  };

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(draft);
    } catch {
      const helper = document.createElement("textarea");
      helper.value = draft;
      helper.setAttribute("readonly", "true");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
    }
  };

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

      <section style={panelStyle}>
        <div style={{ display: "grid", gap: 5 }}>
          <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e40af" }}>
            Step 2
          </span>
          <strong>Choose and edit the correct letter template</strong>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
            Replace every bracket such as [Name], [Grund] and [Information]. Keep the language simple and clear.
          </p>
        </div>

        <div
          role="group"
          aria-label="Choose A2 letter type"
          style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}
        >
          {LETTER_TYPES.map((type) => {
            const active = type.key === letterType;
            return (
              <button
                key={type.key}
                type="button"
                onClick={() => chooseType(type)}
                style={{
                  ...(active ? styles.primaryButton : styles.secondaryButton),
                  minHeight: 48,
                  fontWeight: 850,
                }}
              >
                {type.label}
              </button>
            );
          })}
        </div>

        <div style={{ border: "1px solid #fed7aa", borderRadius: 12, padding: 12, background: "#fffbeb" }}>
          <strong>{selectedType.label}</strong>
          <p style={{ margin: "5px 0 0", color: "#92400e", lineHeight: 1.6 }}>{selectedType.useFor}</p>
        </div>

        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={selectedType.template}
          aria-label="A2 German letter draft"
          style={draftTextareaStyle}
          inputMode="text"
          autoCapitalize="sentences"
          autoCorrect="on"
        />

        <button type="button" onClick={copyDraft} style={{ ...styles.secondaryButton, width: "fit-content" }}>
          Copy my draft
        </button>
      </section>

      <section style={{ ...panelStyle, borderColor: "#86efac", background: "#f0fdf4" }}>
        <span style={{ ...styles.badge, width: "fit-content", background: "#dcfce7", color: "#166534" }}>
          Step 3
        </span>
        <strong>Use Mark My Letter below</strong>
        <p style={{ margin: 0, color: "#166534", lineHeight: 1.65 }}>
          Copy your completed German draft into Mark My Letter. Review the score and corrections before you copy the final version to the Submit tab.
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

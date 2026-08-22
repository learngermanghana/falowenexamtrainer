import React, { useMemo, useState } from "react";
import { getWritingCheatSheet } from "../data/writingCheatSheets";
import { styles } from "../styles";
import B1InlineWritingAnalyser from "./B1InlineWritingAnalyser";

const textareaStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  background: "#fff",
  color: "#111827",
  font: "inherit",
  lineHeight: 1.7,
  padding: 12,
  resize: "vertical",
};

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
  border: "1px solid #bfdbfe",
  background: "#f8fafc",
  boxShadow: "none",
};

const templateIds = [
  ["b1-opinion-text-template", "Insert Opinion Essay Template"],
  ["b1-formal-letter-template", "Insert Formal Letter Template"],
  ["b1-informal-letter-template", "Insert Informal Letter Template"],
];

const B1_DAY5_EMAIL_STRUCTURE = [
  ["Betreff", "Anfrage wegen eines Besichtigungstermins"],
  ["Anrede", "Sehr geehrte Frau … / Sehr geehrter Herr …"],
  ["Grund", "Ich interessiere mich für Ihre Wohnung und würde sie gern besichtigen."],
  ["Termin", "Wäre Samstag um 14 Uhr möglich?"],
  ["Bestätigung", "Könnten Sie mir den Termin bitte per E-Mail bestätigen?"],
  ["Kontakt", "Sie erreichen mich unter …"],
  ["Schluss", "Mit freundlichen Grüßen"],
];

const B1_DAY5_PHRASE_GROUPS = [
  {
    title: "Interesse zeigen",
    items: [
      "Ich interessiere mich sehr für die Wohnung.",
      "Ihre Anzeige hat mein Interesse geweckt.",
      "Ich würde die Wohnung gern besichtigen.",
    ],
  },
  {
    title: "Termin vorschlagen",
    items: [
      "Wäre Samstag um 14 Uhr möglich?",
      "Alternativ könnte ich am Montagabend kommen.",
      "Welcher Termin würde Ihnen passen?",
    ],
  },
  {
    title: "Informationen erfragen",
    items: [
      "Sind Haustiere erlaubt?",
      "Wie hoch sind die Nebenkosten?",
      "Welche Unterlagen soll ich mitbringen?",
    ],
  },
  {
    title: "Bestätigung erbitten",
    items: [
      "Bitte bestätigen Sie mir den Termin per E-Mail.",
      "Sie erreichen mich unter …",
      "Vielen Dank im Voraus.",
    ],
  },
];

const B1_DAY5_CHECKLIST = [
  "Höfliche Anrede und passenden Schluss verwenden.",
  "Mindestens eine Konjunktiv-II-Form benutzen.",
  "In indirekten Fragen das Verb ans Ende setzen.",
  "Einen konkreten Termin oder eine Alternative nennen.",
  "Um Bestätigung bitten und Kontaktdaten angeben.",
];

export const writingTemplateToText = (template) => {
  if (!template?.items?.length) return "";
  return template.items
    .map((item) => `${item.phrase}:\n${item.meaning}`)
    .join("\n\n")
    .trim();
};

export const appendWritingTemplate = (currentText, template) => {
  const templateText = writingTemplateToText(template);
  if (!templateText) return String(currentText || "");
  const current = String(currentText || "").trimEnd();
  return current ? `${current}\n\n${templateText}` : templateText;
};

const B1Day5WritingCheatSheet = () => (
  <div
    data-testid="b1-day5-writing-cheat-sheet"
    data-b1-day5-writing-cheat-sheet="true"
    style={{ border: "1px solid #93c5fd", borderRadius: 14, padding: 12, background: "#fff", display: "grid", gap: 12 }}
  >
    <div>
      <strong style={{ color: "#1e3a8a" }}>Day 5 · Der Besichtigungstermin</strong>
      <p style={{ margin: "4px 0 0", color: "#475569", lineHeight: 1.6 }}>
        Use this exact support for Teil 2 Schreiben. Keep the Grammar tab for grammar rules and exercises only.
      </p>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
      {B1_DAY5_PHRASE_GROUPS.map((group) => (
        <div key={group.title} style={{ border: "1px solid #dbeafe", borderRadius: 12, padding: 10, background: "#f8fafc" }}>
          <strong>{group.title}</strong>
          <ul style={{ margin: "7px 0 0", paddingLeft: 20, lineHeight: 1.65 }}>
            {group.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      ))}
    </div>

    <div style={{ border: "1px solid #dbeafe", borderRadius: 12, padding: 10, background: "#f8fafc" }}>
      <strong>E-Mail-Struktur</strong>
      <ol style={{ margin: "7px 0 0", paddingLeft: 22, lineHeight: 1.7 }}>
        {B1_DAY5_EMAIL_STRUCTURE.map(([label, example]) => (
          <li key={label}><strong>{label}:</strong> {example}</li>
        ))}
      </ol>
    </div>

    <div style={{ border: "1px solid #bbf7d0", borderRadius: 12, padding: 10, background: "#f0fdf4" }}>
      <strong>Final check</strong>
      <ul style={{ margin: "7px 0 0", paddingLeft: 20, lineHeight: 1.65 }}>
        {B1_DAY5_CHECKLIST.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  </div>
);

const B1WritingSupport = ({ onInsertTemplate, day }) => {
  const normalizedDay = Number(day) || 1;
  const sections = getWritingCheatSheet("B1", normalizedDay);
  const quickSections = sections.filter((section) =>
    ["b1-connectors", "b1-message-phrases"].includes(section.id),
  );
  const templates = Object.fromEntries(
    sections.filter((section) => templateIds.some(([id]) => id === section.id)).map((section) => [section.id, section]),
  );

  return (
    <div data-b1-writing-cheat-sheet="always-visible" style={{ display: "grid", gap: 12 }}>
      <div style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 12, background: "#eff6ff", display: "grid", gap: 10 }}>
        <div>
          <strong style={{ color: "#1e3a8a" }}>B1 Writing Cheat Sheet</strong>
          <p style={{ margin: "4px 0 0", color: "#475569", lineHeight: 1.6 }}>
            Use the phrases below while writing. The template buttons insert a complete structure directly into the German text box.
          </p>
        </div>

        {normalizedDay === 5 ? <B1Day5WritingCheatSheet /> : null}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          {quickSections.map((section) => (
            <div key={section.id} style={{ border: "1px solid #dbeafe", borderRadius: 12, padding: 10, background: "#fff", display: "grid", gap: 6 }}>
              <strong>{section.title.replace(/^B1 vocabulary group · /, "")}</strong>
              {section.items.map((item) => (
                <div key={`${section.id}-${item.phrase}`} style={{ lineHeight: 1.55 }}>
                  <strong>{item.phrase}</strong>
                  <span style={{ color: "#64748b" }}> — {item.meaning}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div data-b1-template-insert-controls="true" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {templateIds.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => onInsertTemplate(templates[id])}
            style={{ ...styles.secondaryButton, borderRadius: 999 }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function B1WritingWorkspace({ writingContext = {} }) {
  const [pointsDraft, setPointsDraft] = useState("");
  const [germanDraft, setGermanDraft] = useState("");
  const level = String(writingContext.level || writingContext.courseLevel || "B1").toUpperCase() === "A2" ? "A2" : "B1";
  const supportItems = writingContext.supportStructure?.length
    ? writingContext.supportStructure
    : writingContext.taskPoints || [];

  const planningPlaceholder = useMemo(() => {
    if (!supportItems.length) return "Write your short ideas in English or German here...";
    return supportItems.map((item, index) => `${index + 1}. ${item} → ...`).join("\n");
  }, [supportItems]);

  return (
    <div data-a2-b1-writing-workspace="standard" style={{ display: "grid", gap: 14 }}>
      <section style={cardStyle} aria-label={`${level} writing planning points`}>
        <div>
          <h3 style={{ margin: 0 }}>Stichpunkte / ideas</h3>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            Write short ideas before you start the German text. English is okay in this planning box.
          </p>
        </div>

        {supportItems.length ? (
          <div>
            <strong>Points you must cover</strong>
            <ul style={{ margin: "8px 0 0", paddingLeft: 22, lineHeight: 1.7 }}>
              {supportItems.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <textarea
          aria-label={`${level} planning points`}
          value={pointsDraft}
          onChange={(event) => setPointsDraft(event.target.value)}
          placeholder={planningPlaceholder}
          style={{ ...textareaStyle, minHeight: 140 }}
        />
      </section>

      <section style={cardStyle} aria-label={`${level} German writing`}>
        <div>
          <h3 style={{ margin: 0 }}>Write your German text</h3>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            Turn your points into one complete German text. When you finish, analyse the same text below.
          </p>
        </div>

        {level === "B1" ? (
          <B1WritingSupport
            day={writingContext.day}
            onInsertTemplate={(template) => setGermanDraft((current) => appendWritingTemplate(current, template))}
          />
        ) : null}

        <textarea
          aria-label={`${level} German writing draft`}
          value={germanDraft}
          onChange={(event) => setGermanDraft(event.target.value)}
          placeholder={writingContext.draftPlaceholder || "Write your complete German text here..."}
          style={{ ...textareaStyle, minHeight: 260 }}
        />

        <B1InlineWritingAnalyser
          text={germanDraft}
          level={level}
          taskTitle={writingContext.taskTitle || `${level} writing task`}
        />
      </section>
    </div>
  );
}

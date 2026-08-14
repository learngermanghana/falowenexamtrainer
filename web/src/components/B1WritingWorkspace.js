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

const B1WritingSupport = ({ onInsertTemplate }) => {
  const sections = getWritingCheatSheet("B1", 1);
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

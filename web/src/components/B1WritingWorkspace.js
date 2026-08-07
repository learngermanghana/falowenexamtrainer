import React, { useMemo, useState } from "react";
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

export default function B1WritingWorkspace({ writingContext = {} }) {
  const [pointsDraft, setPointsDraft] = useState("");
  const [germanDraft, setGermanDraft] = useState("");
  const level = String(writingContext.level || writingContext.courseLevel || "B1").toUpperCase() === "A2" ? "A2" : "B1";
  const supportItems = writingContext.supportStructure?.length
    ? writingContext.supportStructure
    : writingContext.taskPoints || [];

  const planningPlaceholder = useMemo(() => {
    if (!supportItems.length) {
      return "Write your ideas in English or German first.\n1. Main point ...\n2. Reason ...\n3. Example ...";
    }
    return supportItems.map((item, index) => `${index + 1}. ${item} → write your idea here`).join("\n");
  }, [supportItems]);

  return (
    <div data-a2-b1-writing-workspace="standard" style={{ display: "grid", gap: 14 }}>
      <section style={cardStyle} aria-label={`${level} writing planning points`}>
        <div>
          <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e40af" }}>
            Step 1 · Plan your points
          </span>
          <h3 style={{ margin: "8px 0 4px" }}>Stichpunkte / ideas</h3>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            Write short ideas before you start the German text. English is okay in this planning box.
          </p>
        </div>

        {writingContext.taskTitle ? (
          <div style={{ border: "1px solid #bfdbfe", borderRadius: 12, padding: 12, background: "#fff" }}>
            <strong>Writing task</strong>
            <p style={{ margin: "6px 0 0", lineHeight: 1.7 }}>{writingContext.taskTitle}</p>
          </div>
        ) : null}

        {supportItems.length ? (
          <ul style={{ margin: 0, paddingLeft: 22, lineHeight: 1.7 }}>
            {supportItems.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
          </ul>
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
          <span style={{ ...styles.badge, width: "fit-content", background: "#fef3c7", color: "#92400e" }}>
            Step 2 · Schreiben
          </span>
          <h3 style={{ margin: "8px 0 4px" }}>Write your German text</h3>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            Turn your points into one complete German text. When you finish, analyse the same text below.
          </p>
        </div>

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

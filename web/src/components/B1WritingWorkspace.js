import React, { useState } from "react";
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

  return (
    <div data-a2-b1-writing-workspace="standard" style={{ display: "grid", gap: 14 }}>
      <section style={cardStyle} aria-label={`${level} writing planning points`}>
        <div>
          <h3 style={{ margin: 0 }}>Stichpunkte / ideas</h3>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            Write short ideas before you start the German text. English is okay in this planning box.
          </p>
        </div>

        <textarea
          aria-label={`${level} planning points`}
          value={pointsDraft}
          onChange={(event) => setPointsDraft(event.target.value)}
          placeholder="Write your short ideas in English or German here..."
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

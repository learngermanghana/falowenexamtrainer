import React, { useState } from "react";
import { styles } from "../styles";

const copyToClipboard = async (text) => {
  if (!text) {
    return false;
  }
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  return true;
};

const WorkbookSection = ({ title, intro, entries }) => {
  const [copyStatus, setCopyStatus] = useState({});

  const handleCopy = async (entryId, text, label) => {
    setCopyStatus((prev) => ({ ...prev, [entryId]: "" }));
    try {
      await copyToClipboard(text);
      setCopyStatus((prev) => ({ ...prev, [entryId]: `${label} copied ✅` }));
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [entryId]: "" }));
      }, 1500);
    } catch (error) {
      console.error("Copy failed", error);
      setCopyStatus((prev) => ({ ...prev, [entryId]: "Copy failed" }));
      setTimeout(() => {
        setCopyStatus((prev) => ({ ...prev, [entryId]: "" }));
      }, 2000);
    }
  };

  return (
    <section style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div>
        <h2 style={{ margin: 0 }}>{title}</h2>
        {intro ? (
          <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
            {intro}
          </p>
        ) : null}
      </div>
      <div style={{ display: "grid", gap: 16 }}>
        {entries.map((entry) => (
          <div key={entry.id} style={{ display: "grid", gap: 10 }}>
            {entry.label ? <h3 style={{ margin: "2px 0 0" }}>{entry.label}</h3> : null}
            <textarea
              readOnly
              value={entry.text}
              rows={entry.rows ?? 4}
              style={{ ...styles.textArea, margin: 0 }}
            />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={() => handleCopy(entry.id, entry.text, "Text")}
              >
                Copy text
              </button>
              {entry.translation ? (
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => handleCopy(entry.id, entry.translation, "Translation")}
                >
                  Copy translation
                </button>
              ) : null}
              {copyStatus[entry.id] ? (
                <span style={{ fontSize: 13, color: "#059669" }}>{copyStatus[entry.id]}</span>
              ) : null}
            </div>
            {entry.translation ? (
              <p style={{ margin: 0, color: "#4b5563" }}>{entry.translation}</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorkbookSection;

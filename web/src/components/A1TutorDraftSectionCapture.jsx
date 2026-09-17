import React, { useEffect } from "react";
import { styles } from "../styles";
import {
  getA1TutorDraftProfile,
  getA1TutorDraftSectionProgress,
} from "../data/a1TutorDraftProfiles";
import { useA1TutorWorkbookDraft } from "./A1TutorWorkbookDraftContext";

const statusText = (saveState) => {
  if (saveState === "saving") return "Saving draft…";
  if (saveState === "saved") return "Draft saved on this device.";
  return "Draft saves automatically on this device.";
};

const ChoiceControl = ({ item, value, onChange, groupName }) => (
  <fieldset
    style={{
      border: "1px solid #dbeafe",
      borderRadius: 12,
      padding: "10px 12px",
      display: "grid",
      gap: 8,
      minWidth: 0,
    }}
  >
    <legend style={{ fontWeight: 900, padding: "0 5px" }}>Question {item.number}</legend>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {item.choices.map((choice) => {
        const selected = String(value || "") === choice;
        return (
          <label
            key={choice}
            style={{
              alignItems: "center",
              border: `2px solid ${selected ? "#2563eb" : "#cbd5e1"}`,
              borderRadius: 999,
              background: selected ? "#eff6ff" : "#ffffff",
              color: selected ? "#1d4ed8" : "#334155",
              cursor: "pointer",
              display: "inline-flex",
              fontWeight: 800,
              gap: 7,
              minHeight: 42,
              padding: "7px 11px",
            }}
          >
            <input
              type="radio"
              name={groupName}
              value={choice}
              checked={selected}
              onChange={() => onChange(choice)}
              style={{ width: 18, height: 18, margin: 0 }}
            />
            <span>{choice}</span>
          </label>
        );
      })}
    </div>
  </fieldset>
);

const ShortControl = ({ item, value, onChange }) => (
  <label style={{ display: "grid", gap: 6, fontWeight: 800 }}>
    <span>Question {item.number}</span>
    <input
      type="text"
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
      placeholder={item.placeholder || "Type your answer"}
      style={{
        ...styles.input,
        minHeight: 44,
        fontSize: 16,
      }}
    />
  </label>
);

export default function A1TutorDraftSectionCapture({ sectionKey }) {
  const draftContext = useA1TutorWorkbookDraft();
  const assignmentKey = draftContext?.assignmentKey || "";
  const draft = draftContext?.draft;
  const saveState = draftContext?.saveState;
  const updateAnswer = draftContext?.updateAnswer;
  const updateSectionText = draftContext?.updateSectionText;
  const profile = getA1TutorDraftProfile(assignmentKey);
  const sectionProfile = profile?.sections?.[sectionKey];
  const savedSection = draft?.sections?.[sectionKey] || {};
  const progress = getA1TutorDraftSectionProgress({ assignmentKey, sectionKey, draft });
  const label = sectionProfile?.label || sectionKey.replace("teil-", "Teil ");

  useEffect(() => {
    if (!sectionProfile?.embeddedWriting || !updateSectionText || typeof document === "undefined") return undefined;
    let textarea = null;
    let lastObservedValue = null;
    let attempts = 0;
    let interval = null;

    const syncValue = (allowEmpty = false) => {
      if (!textarea?.isConnected) return;
      const value = textarea.value || "";
      if (value === lastObservedValue) return;
      lastObservedValue = value;
      const storedValue = String(savedSection.text || "");
      if (!allowEmpty && !value) return;
      if (value === storedValue) return;
      updateSectionText(sectionKey, value);
    };

    const handleInput = () => syncValue(true);

    const bind = () => {
      attempts += 1;
      const panels = Array.from(document.querySelectorAll('[data-a1-course-book-letter-practice="true"]'));
      const panel = panels.find((candidate) =>
        String(candidate.getAttribute("data-writing-task-id") || "").includes(sectionKey),
      );
      const nextTextarea = panel?.querySelector("textarea") || null;
      if (nextTextarea && nextTextarea !== textarea) {
        textarea?.removeEventListener("input", handleInput);
        textarea = nextTextarea;
        lastObservedValue = null;
        textarea.addEventListener("input", handleInput);
        syncValue(false);
      }
      if (attempts > 40 && !textarea && interval) {
        window.clearInterval(interval);
        interval = null;
      }
    };

    bind();
    interval = window.setInterval(() => {
      bind();
      syncValue(false);
    }, 500);

    return () => {
      if (interval) window.clearInterval(interval);
      textarea?.removeEventListener("input", handleInput);
    };
  }, [savedSection.text, sectionKey, sectionProfile?.embeddedWriting, updateSectionText]);

  if (!draftContext || !sectionProfile || sectionProfile.readOnly || sectionProfile.required === false) return null;

  return (
    <section
      data-a1-tutor-draft-capture={sectionKey}
      data-assignment-key={assignmentKey}
      style={{
        ...styles.card,
        border: "2px solid #93c5fd",
        background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 78%)",
        display: "grid",
        gap: 12,
        marginTop: 16,
      }}
    >
      <div style={{ display: "grid", gap: 5 }}>
        <span style={{ color: "#1d4ed8", fontSize: 12, fontWeight: 900, letterSpacing: ".04em", textTransform: "uppercase" }}>
          Assignment draft · Not submitted
        </span>
        <h3 style={{ margin: 0 }}>Your {label} answers</h3>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
          Work here is saved as a draft. Your tutor receives it only after you open <strong>Review &amp; Submit</strong> and press the final Submit Assignment button.
        </p>
      </div>

      {sectionProfile.embeddedWriting ? (
        <div
          style={{
            border: "1px solid #a7f3d0",
            borderRadius: 12,
            background: "#ecfdf5",
            color: "#065f46",
            padding: "10px 12px",
            lineHeight: 1.6,
          }}
        >
          <strong>Use the Mark My Letter box above.</strong> Its latest text is also saved into this assignment draft automatically.
        </div>
      ) : sectionProfile.writing ? (
        <label style={{ display: "grid", gap: 7, fontWeight: 800 }}>
          <span>Your writing</span>
          <textarea
            value={savedSection.text || ""}
            onChange={(event) => updateSectionText(sectionKey, event.target.value)}
            placeholder={sectionProfile.placeholder || "Write your answer here"}
            rows={8}
            style={{ ...styles.textArea, fontSize: 16, lineHeight: 1.65 }}
          />
        </label>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {sectionProfile.items.map((item) => (
            item.type === "choice" ? (
              <ChoiceControl
                key={item.number}
                item={item}
                value={savedSection.answers?.[item.number]}
                onChange={(value) => updateAnswer(sectionKey, item.number, value)}
                groupName={`a1-draft-${assignmentKey}-${sectionKey}-${item.number}`}
              />
            ) : (
              <ShortControl
                key={item.number}
                item={item}
                value={savedSection.answers?.[item.number]}
                onChange={(value) => updateAnswer(sectionKey, item.number, value)}
              />
            )
          ))}
        </div>
      )}

      <div
        aria-live="polite"
        style={{
          alignItems: "center",
          display: "flex",
          gap: 10,
          justifyContent: "space-between",
          flexWrap: "wrap",
          borderTop: "1px solid #dbeafe",
          paddingTop: 10,
          color: progress?.complete ? "#166534" : "#475569",
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        <span>
          {progress?.total === 1 && (sectionProfile.writing || sectionProfile.embeddedWriting)
            ? (progress.complete ? "Writing saved" : "Writing still required")
            : `${progress?.completed || 0} of ${progress?.total || 0} answered`}
        </span>
        <span>{statusText(saveState)}</span>
      </div>
    </section>
  );
}

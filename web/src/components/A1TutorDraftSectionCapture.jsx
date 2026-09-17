import React, { useEffect, useRef, useState } from "react";
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

const normalizeChoiceText = (value = "") =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const resolveChoiceFromText = (text = "", choices = []) => {
  const raw = String(text || "").replace(/\s+/g, " ").trim();
  if (!raw) return "";

  const alphaPrefix = raw.match(/^([A-H])\s*[).:\-]\s*/i)?.[1]?.toUpperCase() || "";
  const alphaChoices = choices.filter((choice) => /^[A-H]$/i.test(String(choice || "").trim()));
  if (alphaPrefix && alphaChoices.length) {
    const match = alphaChoices.find((choice) => String(choice).toUpperCase() === alphaPrefix);
    if (match) return match;
  }

  const withoutPrefix = raw.replace(/^[A-H]\s*[).:\-]\s*/i, "").trim();
  const normalizedRaw = normalizeChoiceText(raw);
  const normalizedWithoutPrefix = normalizeChoiceText(withoutPrefix);

  return choices.find((choice) => {
    const normalizedChoice = normalizeChoiceText(choice);
    return normalizedChoice === normalizedRaw || normalizedChoice === normalizedWithoutPrefix;
  }) || "";
};

const findQuestionRoot = ({ sectionRoot, captureRoot, number, choices }) => {
  const stems = Array.from(sectionRoot.querySelectorAll("strong")).filter(
    (node) => !captureRoot?.contains(node),
  );
  const stem = stems.find((node) =>
    new RegExp(`^\\s*${number}\\s*[).:\-]`).test(String(node.textContent || "").trim()),
  );
  if (!stem) return null;

  let candidate = stem.parentElement;
  while (candidate && candidate !== sectionRoot) {
    const optionNodes = Array.from(candidate.querySelectorAll("span, label, button, li, p")).filter(
      (node) => !captureRoot?.contains(node) && resolveChoiceFromText(node.textContent, choices),
    );
    if (optionNodes.length >= 2) return candidate;
    candidate = candidate.parentElement;
  }

  return stem.parentElement;
};

const applyChoicePresentation = (node, selected) => {
  node.setAttribute("role", "radio");
  node.setAttribute("tabindex", "0");
  node.setAttribute("aria-checked", selected ? "true" : "false");
  node.setAttribute("data-a1-clickable-answer", "true");
  Object.assign(node.style, {
    display: "block",
    border: selected ? "2px solid #2563eb" : "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "10px 12px",
    background: selected ? "#eff6ff" : "#ffffff",
    color: selected ? "#1e3a8a" : "#0f172a",
    fontWeight: selected ? "800" : "600",
    cursor: "pointer",
    outlineOffset: "2px",
  });
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
              aria-label={`Question ${item.number}: ${choice}`}
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
  const captureRef = useRef(null);
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
  const choiceItems = sectionProfile?.items?.filter((item) => item.type === "choice") || [];
  const shortItems = sectionProfile?.items?.filter((item) => item.type === "short") || [];
  const [boundChoiceNumbers, setBoundChoiceNumbers] = useState([]);
  const [choiceBindingChecked, setChoiceBindingChecked] = useState(false);

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

  useEffect(() => {
    if (!choiceItems.length || !updateAnswer || typeof document === "undefined") {
      setBoundChoiceNumbers([]);
      setChoiceBindingChecked(Boolean(sectionProfile));
      return undefined;
    }

    const captureRoot = captureRef.current;
    const sectionRoot = captureRoot?.closest?.("[data-workbook-section]");
    if (!sectionRoot) {
      setChoiceBindingChecked(true);
      return undefined;
    }

    let cleanups = [];
    let observer = null;
    let frame = null;

    const bindChoices = () => {
      cleanups.forEach((cleanup) => cleanup());
      cleanups = [];
      const nextBound = [];

      choiceItems.forEach((item) => {
        const questionRoot = findQuestionRoot({
          sectionRoot,
          captureRoot: captureRef.current,
          number: item.number,
          choices: item.choices,
        });
        if (!questionRoot) return;

        const nodesByChoice = new Map();
        Array.from(questionRoot.querySelectorAll("span, label, button, li, p")).forEach((node) => {
          if (captureRef.current?.contains(node)) return;
          const choice = resolveChoiceFromText(node.textContent, item.choices);
          if (choice && !nodesByChoice.has(choice)) nodesByChoice.set(choice, node);
        });

        if (nodesByChoice.size !== item.choices.length) return;
        nextBound.push(item.number);

        const originalGroupRole = questionRoot.getAttribute("role");
        const originalGroupLabel = questionRoot.getAttribute("aria-label");
        questionRoot.setAttribute("role", "radiogroup");
        questionRoot.setAttribute("aria-label", `Question ${item.number}`);
        cleanups.push(() => {
          if (originalGroupRole === null) questionRoot.removeAttribute("role");
          else questionRoot.setAttribute("role", originalGroupRole);
          if (originalGroupLabel === null) questionRoot.removeAttribute("aria-label");
          else questionRoot.setAttribute("aria-label", originalGroupLabel);
        });

        nodesByChoice.forEach((node, choice) => {
          const originalStyle = node.getAttribute("style");
          const originalRole = node.getAttribute("role");
          const originalTabIndex = node.getAttribute("tabindex");
          const originalAriaChecked = node.getAttribute("aria-checked");
          const originalData = node.getAttribute("data-a1-clickable-answer");

          const repaint = (selectedChoice = savedSection.answers?.[item.number]) => {
            applyChoicePresentation(node, String(selectedChoice || "") === String(choice));
          };

          const choose = () => {
            updateAnswer(sectionKey, item.number, choice);
            nodesByChoice.forEach((otherNode, otherChoice) => {
              applyChoicePresentation(otherNode, String(otherChoice) === String(choice));
            });
          };
          const onClick = (event) => {
            event.preventDefault();
            choose();
          };
          const onKeyDown = (event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            choose();
          };

          repaint();
          node.addEventListener("click", onClick);
          node.addEventListener("keydown", onKeyDown);
          cleanups.push(() => {
            node.removeEventListener("click", onClick);
            node.removeEventListener("keydown", onKeyDown);
            if (originalStyle === null) node.removeAttribute("style");
            else node.setAttribute("style", originalStyle);
            if (originalRole === null) node.removeAttribute("role");
            else node.setAttribute("role", originalRole);
            if (originalTabIndex === null) node.removeAttribute("tabindex");
            else node.setAttribute("tabindex", originalTabIndex);
            if (originalAriaChecked === null) node.removeAttribute("aria-checked");
            else node.setAttribute("aria-checked", originalAriaChecked);
            if (originalData === null) node.removeAttribute("data-a1-clickable-answer");
            else node.setAttribute("data-a1-clickable-answer", originalData);
          });
        });
      });

      nextBound.sort((left, right) => left - right);
      setBoundChoiceNumbers((current) =>
        current.join(",") === nextBound.join(",") ? current : nextBound,
      );
      setChoiceBindingChecked(true);
    };

    frame = window.requestAnimationFrame(bindChoices);
    observer = new MutationObserver(() => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(bindChoices);
    });
    observer.observe(sectionRoot, { childList: true, subtree: true });

    return () => {
      observer?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [choiceItems, savedSection.answers, sectionKey, sectionProfile, updateAnswer]);

  if (!draftContext || !sectionProfile || sectionProfile.readOnly || sectionProfile.required === false) return null;

  const allChoiceItemsBound = choiceItems.length > 0 && choiceItems.every((item) => boundChoiceNumbers.includes(item.number));
  const choiceOnlySection = choiceItems.length > 0 && shortItems.length === 0 && !sectionProfile.writing && !sectionProfile.embeddedWriting;
  const fallbackChoiceItems = choiceBindingChecked
    ? choiceItems.filter((item) => !boundChoiceNumbers.includes(item.number))
    : [];

  if (choiceOnlySection && allChoiceItemsBound) {
    return (
      <div
        ref={captureRef}
        data-a1-tutor-draft-capture={sectionKey}
        data-assignment-key={assignmentKey}
        aria-live="polite"
        style={{
          borderTop: "1px solid #dbeafe",
          marginTop: 14,
          paddingTop: 10,
          color: progress?.complete ? "#166534" : "#475569",
          display: "flex",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: "wrap",
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        <span>{progress?.completed || 0} of {progress?.total || 0} answered · Tap an answer above to change it.</span>
        <span>{statusText(saveState)}</span>
      </div>
    );
  }

  return (
    <section
      ref={captureRef}
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
          {choiceItems.length
            ? "For multiple-choice questions, tap the answer directly beside the question above. Typed answers stay in the fields below. Everything saves as a draft until you submit."
            : "Work here is saved as a draft. Your tutor receives it only after you open Review & Submit and press the final Submit Assignment button."}
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
          {shortItems.map((item) => (
            <ShortControl
              key={item.number}
              item={item}
              value={savedSection.answers?.[item.number]}
              onChange={(value) => updateAnswer(sectionKey, item.number, value)}
            />
          ))}
          {fallbackChoiceItems.length ? (
            <div style={{ display: "grid", gap: 10 }}>
              <p style={{ margin: 0, color: "#92400e", lineHeight: 1.55 }}>
                These legacy choices could not be attached safely to the question text above, so use the controls here.
              </p>
              {fallbackChoiceItems.map((item) => (
                <ChoiceControl
                  key={item.number}
                  item={item}
                  value={savedSection.answers?.[item.number]}
                  onChange={(value) => updateAnswer(sectionKey, item.number, value)}
                  groupName={`a1-draft-${assignmentKey}-${sectionKey}-${item.number}`}
                />
              ))}
            </div>
          ) : null}
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

export const __TESTING__ = { normalizeChoiceText, resolveChoiceFromText };

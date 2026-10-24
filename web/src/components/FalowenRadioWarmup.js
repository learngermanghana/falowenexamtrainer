import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getLessonRadioResource } from "../data/lessonRadioDictionary";
import { styles } from "../styles";
import FalowenRadioTabContent from "./FalowenRadioTabContent";

const SUPPORTED_LEVELS = new Set(["A2", "B1", "B2", "C1"]);

const resolveRouteLesson = () => {
  if (typeof window === "undefined") {
    return { level: "", day: "", mode: "" };
  }

  const path = String(window.location.pathname || "");
  const lessonMatch = path.match(
    /^\/campus\/course\/lesson\/(A2|B1|B2|C1)\/(\d+)\/?$/i,
  );

  if (lessonMatch) {
    return {
      level: lessonMatch[1].toUpperCase(),
      day: lessonMatch[2],
      mode: "lesson",
    };
  }

  const workbookMatch = path.match(
    /^\/campus\/course\/(A2|B1|B2|C1)-day-(\d+)-.*-workbook\/?$/i,
  );

  if (workbookMatch) {
    return {
      level: workbookMatch[1].toUpperCase(),
      day: workbookMatch[2],
      mode: "workbook",
    };
  }

  return { level: "", day: "", mode: "" };
};

const tabText = (element) => String(element?.textContent || "").trim();

const FalowenRadioWarmup = ({
  level: explicitLevel = "",
  day: explicitDay = "",
  onContinue,
  actionLabel,
}) => {
  const routeLesson = resolveRouteLesson();
  const level = String(explicitLevel || routeLesson.level || "")
    .trim()
    .toUpperCase();
  const day = Number(explicitDay || routeLesson.day || 0);
  const radio = getLessonRadioResource(level, day);
  const enabled = SUPPORTED_LEVELS.has(level) && Boolean(radio?.youtubeId);
  const workbookMode = routeLesson.mode === "workbook";

  const [open, setOpen] = useState(true);
  const [tabMount, setTabMount] = useState(null);
  const [contentMount, setContentMount] = useState(null);
  const originalTabButtonsRef = useRef([]);
  const countLabelRef = useRef(null);
  const currentPositionRef = useRef(1);

  useEffect(() => {
    if (!enabled || !workbookMode || typeof document === "undefined") {
      return undefined;
    }

    const speakingButton = Array.from(document.querySelectorAll("button")).find(
      (button) => /^Teil 1\b/i.test(tabText(button)),
    );

    if (!speakingButton?.parentElement) return undefined;

    const tabRow = speakingButton.parentElement;
    if (tabRow.getAttribute("data-falowen-radio-mounted") === "true") {
      return undefined;
    }

    const originalButtons = Array.from(tabRow.children).filter(
      (element) => element.tagName === "BUTTON" && /^Teil [1-4]\b/i.test(tabText(element)),
    );

    if (!originalButtons.length) return undefined;

    const topCard = tabRow.parentElement;
    const container = topCard?.parentElement;
    if (!topCard || !container) return undefined;

    const countLabel = tabRow.nextElementSibling;
    const newTabMount = document.createElement("span");
    const newContentMount = document.createElement("div");

    newTabMount.style.display = "contents";
    newContentMount.setAttribute("data-falowen-radio-content", "true");
    tabRow.insertBefore(newTabMount, tabRow.firstChild);
    container.insertBefore(newContentMount, topCard.nextSibling);
    tabRow.setAttribute("data-falowen-radio-mounted", "true");

    originalTabButtonsRef.current = originalButtons;
    countLabelRef.current = countLabel;
    setTabMount(newTabMount);
    setContentMount(newContentMount);

    const updateCount = () => {
      if (!countLabelRef.current) return;
      const text = `Tab ${currentPositionRef.current} of ${originalButtons.length + 1}`;
      if (countLabelRef.current.textContent !== text) {
        countLabelRef.current.textContent = text;
      }
    };

    const handleOriginalTabClick = (event) => {
      const index = originalButtons.indexOf(event.currentTarget);
      currentPositionRef.current = Math.max(2, index + 2);
      setOpen(false);
      window.setTimeout(updateCount, 0);
    };

    originalButtons.forEach((button) =>
      button.addEventListener("click", handleOriginalTabClick),
    );

    const observer = new MutationObserver(updateCount);
    if (countLabel) {
      observer.observe(countLabel, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    }

    updateCount();

    return () => {
      observer.disconnect();
      originalButtons.forEach((button) =>
        button.removeEventListener("click", handleOriginalTabClick),
      );
      tabRow.removeAttribute("data-falowen-radio-mounted");
      newTabMount.remove();
      newContentMount.remove();
    };
  }, [enabled, workbookMode]);

  useEffect(() => {
    if (!enabled || !workbookMode || !tabMount || !contentMount || !open) {
      return undefined;
    }

    currentPositionRef.current = 1;
    if (countLabelRef.current) {
      countLabelRef.current.textContent = `Tab 1 of ${originalTabButtonsRef.current.length + 1}`;
    }

    const tabRow = originalTabButtonsRef.current[0]?.parentElement;
    if (tabRow) tabRow.setAttribute("data-falowen-radio-active", "true");

    const style = document.createElement("style");
    style.setAttribute("data-falowen-radio-style", "true");
    style.textContent = `
      [data-falowen-radio-active="true"] > button {
        border-color: #d1d5db !important;
        background: #fff !important;
        color: #111827 !important;
      }
      [data-falowen-radio-active="true"] [data-falowen-radio-tab="true"] {
        border-color: #2563eb !important;
        background: #eff6ff !important;
        color: #1d4ed8 !important;
      }
    `;
    document.head.appendChild(style);

    const hiddenSiblings = [];
    let sibling = contentMount.nextElementSibling;

    while (sibling) {
      hiddenSiblings.push({ element: sibling, display: sibling.style.display });
      sibling.style.display = "none";
      sibling = sibling.nextElementSibling;
    }

    return () => {
      if (tabRow) tabRow.removeAttribute("data-falowen-radio-active");
      style.remove();
      hiddenSiblings.forEach(({ element, display }) => {
        element.style.display = display;
      });
    };
  }, [contentMount, enabled, open, tabMount, workbookMode]);

  if (!enabled) return null;

  if (!workbookMode) {
    return (
      <section aria-label={`Falowen Radio warm-up for ${level} Day ${day}`}>
        <FalowenRadioTabContent
          level={level}
          day={day}
          onContinue={onContinue}
          actionLabel={actionLabel}
        />
      </section>
    );
  }

  const handleContinue = () => {
    currentPositionRef.current = 2;
    setOpen(false);
    window.setTimeout(() => originalTabButtonsRef.current[0]?.click(), 0);
  };

  const radioTab = tabMount
    ? createPortal(
        <button
          type="button"
          data-falowen-radio-tab="true"
          onClick={() => {
            currentPositionRef.current = 1;
            setOpen(true);
          }}
          style={{
            ...styles.secondaryButton,
            borderColor: open ? "#2563eb" : "#d1d5db",
            background: open ? "#eff6ff" : "#fff",
            color: open ? "#1d4ed8" : "#111827",
          }}
        >
          🎙️ Falowen Radio
        </button>,
        tabMount,
      )
    : null;

  const radioContent = contentMount && open
    ? createPortal(
        <section aria-label={`Falowen Radio warm-up for ${level} Day ${day}`}>
          <FalowenRadioTabContent
            level={level}
            day={day}
            onContinue={handleContinue}
            actionLabel="Continue to Teil 1 · Sprechen →"
          />
        </section>,
        contentMount,
      )
    : null;

  return (
    <>
      {radioTab}
      {radioContent}
    </>
  );
};

export default FalowenRadioWarmup;

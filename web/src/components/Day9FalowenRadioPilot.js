import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { styles } from "../styles";
import FalowenRadioWarmup from "./FalowenRadioWarmup";

const PILOT_PATH = "/campus/course/a2-day-9-urlaub-workbook";

const Day9FalowenRadioPilot = () => {
  const isPilotPage =
    typeof window !== "undefined" &&
    String(window.location.pathname || "")
      .replace(/\/+$/, "")
      .toLowerCase() === PILOT_PATH;

  const [open, setOpen] = useState(isPilotPage);
  const [tabMount, setTabMount] = useState(null);
  const sectionRef = useRef(null);
  const originalTabButtonsRef = useRef([]);
  const countLabelRef = useRef(null);
  const currentPositionRef = useRef(1);

  useEffect(() => {
    if (!isPilotPage || typeof document === "undefined") return undefined;

    const speakingButton = Array.from(document.querySelectorAll("button")).find((button) =>
      String(button.textContent || "").trim().startsWith("Teil 1 · Sprechen")
    );

    if (!speakingButton?.parentElement) return undefined;

    const tabRow = speakingButton.parentElement;
    const originalButtons = Array.from(tabRow.querySelectorAll("button"));
    const countLabel = tabRow.nextElementSibling;
    const mount = document.createElement("span");

    mount.style.display = "contents";
    tabRow.insertBefore(mount, tabRow.firstChild);

    originalTabButtonsRef.current = originalButtons;
    countLabelRef.current = countLabel;
    setTabMount(mount);

    const updateCount = () => {
      if (!countLabelRef.current) return;
      const text = `Tab ${currentPositionRef.current} of 5`;
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

    originalButtons.forEach((button) => button.addEventListener("click", handleOriginalTabClick));

    const observer = new MutationObserver(updateCount);
    if (countLabel) {
      observer.observe(countLabel, { childList: true, characterData: true, subtree: true });
    }

    updateCount();

    return () => {
      observer.disconnect();
      originalButtons.forEach((button) => button.removeEventListener("click", handleOriginalTabClick));
      mount.remove();
    };
  }, [isPilotPage]);

  useEffect(() => {
    if (!isPilotPage || !tabMount || !open) return undefined;

    currentPositionRef.current = 1;
    if (countLabelRef.current) countLabelRef.current.textContent = "Tab 1 of 5";

    const speakingButton = originalTabButtonsRef.current[0];
    const tabRow = speakingButton?.parentElement;
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

    const section = sectionRef.current;
    const hiddenSiblings = [];
    let sibling = section?.nextElementSibling;

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
  }, [isPilotPage, open, tabMount]);

  if (!isPilotPage) return null;

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
        tabMount
      )
    : null;

  return (
    <>
      {radioTab}
      {open && (
        <section ref={sectionRef} aria-label="Falowen Radio warm-up">
          <FalowenRadioWarmup level="A2" day={9} onContinue={handleContinue} />
        </section>
      )}
    </>
  );
};

export default Day9FalowenRadioPilot;

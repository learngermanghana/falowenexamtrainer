import React, { useEffect, useRef } from "react";
import A1Day5IntroducingYourselfArticlesWorkbookPageLegacy from "./A1Day5IntroducingYourselfArticlesWorkbookPageLegacy";

const DAY_5_TITLE = "Personal Information, Articles, Adjectives and W-Questions";
const DAY_5_SCOPE = "Articles · Adjectives · Personal information · Dialogues · W-questions · Sentence building";

const updateDay5Heading = (root) => {
  if (!root) return;

  const heading = Array.from(root.querySelectorAll("h1")).find((element) =>
    element.textContent?.includes("Introducing Yourself and Articles")
  );
  if (heading && heading.textContent !== DAY_5_TITLE) {
    heading.textContent = DAY_5_TITLE;
  }

  const subtitle = Array.from(root.querySelectorAll("p")).find((element) =>
    element.textContent?.includes("Chapter 1.2 · Interactive workbook")
  );
  if (subtitle && !root.querySelector("[data-day5-scope='true']")) {
    const scope = document.createElement("p");
    scope.dataset.day5Scope = "true";
    scope.textContent = DAY_5_SCOPE;
    scope.style.margin = "0";
    scope.style.lineHeight = "1.6";
    scope.style.color = "#4b5563";
    scope.style.fontSize = "14px";
    subtitle.insertAdjacentElement("afterend", scope);
  }
};

export default function A1Day5IntroducingYourselfArticlesWorkbookPage() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    updateDay5Heading(root);
    const observer = new MutationObserver(() => updateDay5Heading(root));
    observer.observe(root, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef}>
      <A1Day5IntroducingYourselfArticlesWorkbookPageLegacy />
    </div>
  );
}

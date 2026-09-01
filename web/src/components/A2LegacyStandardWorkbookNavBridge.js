import React, { useEffect, useMemo, useState } from "react";
import ContextualAssignmentSubmissionPage from "./ContextualAssignmentSubmissionPage";
import {
  A2_B1_WORKBOOK_TABS_WITH_GRAMMAR,
  WorkbookTabNav,
} from "./StandardWorkbookComponents";
import { styles } from "../styles";

const normalizeLabel = (value = "") => String(value || "").replace(/\s+/g, " ").trim();

const tabMatchers = {
  grammar: (label) => label === "Grammar",
  sprechen: (label) => label.startsWith("Teil 1"),
  schreiben: (label) => label.startsWith("Teil 2"),
  lesen: (label) => label.startsWith("Teil 3"),
  hoeren: (label) => label.startsWith("Teil 4"),
  references: (label) => label === "Ref" || label.endsWith(" Ref") || label.includes("Ref"),
  submit: (label) => label === "Submit" || label.startsWith("Submit "),
};

const getLegacyButtons = (root) => Array.from(root?.querySelectorAll("button") || []);

const findLegacyButton = (root, tabKey) => {
  const matcher = tabMatchers[tabKey];
  if (!matcher) return null;
  return getLegacyButtons(root).find((button) => matcher(normalizeLabel(button.textContent))) || null;
};

const hideLegacyNavigation = (root) => {
  if (!root) return;

  const labelledNav = root.querySelector('[aria-label="Workbook parts navigation"]');
  if (labelledNav) labelledNav.style.display = "none";

  const buttonGroups = Array.from(root.querySelectorAll("div"));
  buttonGroups.forEach((group) => {
    const directButtons = Array.from(group.children || []).filter((child) => child.tagName === "BUTTON");
    if (directButtons.length < 5) return;
    const labels = directButtons.map((button) => normalizeLabel(button.textContent));
    const looksLikeWorkbookNav = labels.some((label) => label === "Grammar")
      && labels.some((label) => label.startsWith("Teil 1"))
      && labels.some((label) => label.startsWith("Teil 4"));
    if (!looksLikeWorkbookNav) return;

    group.style.display = "none";
    const status = group.nextElementSibling;
    if (status?.tagName === "P") {
      const statusText = normalizeLabel(status.textContent);
      if (/^Tab \d+ of \d+$/i.test(statusText) || /^\d+\./.test(statusText)) {
        status.style.display = "none";
      }
    }
  });
};

export default function A2LegacyStandardWorkbookNavBridge({
  legacyRootRef,
  day,
  chapter,
  workbookId,
}) {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [legacyHasSubmit, setLegacyHasSubmit] = useState(true);

  const submissionContext = useMemo(() => {
    const assignmentKey = `A2-${chapter}`;
    return {
      level: "A2",
      day,
      assignmentKey,
      canonicalAssignmentKey: assignmentKey,
      workbookId,
    };
  }, [chapter, day, workbookId]);

  useEffect(() => {
    const root = legacyRootRef?.current;
    if (!root) return undefined;

    const sync = () => {
      hideLegacyNavigation(root);
      setLegacyHasSubmit(Boolean(findLegacyButton(root, "submit")));
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [legacyRootRef]);

  useEffect(() => {
    const root = legacyRootRef?.current;
    if (!root) return;
    const usingFallbackSubmit = activeTab === "submit" && !legacyHasSubmit;
    root.style.display = usingFallbackSubmit ? "none" : "block";
  }, [activeTab, legacyHasSubmit, legacyRootRef]);

  const changeTab = (nextTab) => {
    setActiveTab(nextTab);
    const root = legacyRootRef?.current;
    const legacyButton = findLegacyButton(root, nextTab);
    if (legacyButton) legacyButton.click();
  };

  return (
    <>
      <div
        style={{
          ...styles.card,
          position: "sticky",
          top: 0,
          zIndex: 40,
          padding: 10,
          marginBottom: 16,
          background: "rgba(255,255,255,0.98)",
          boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
        }}
      >
        <WorkbookTabNav
          activeTab={activeTab}
          onChange={changeTab}
          tabs={A2_B1_WORKBOOK_TABS_WITH_GRAMMAR}
          ariaLabel={`A2 Day ${day} workbook sections`}
          renderLegacyGrammarPanel={false}
        />
      </div>

      {activeTab === "submit" && !legacyHasSubmit ? (
        <div style={{ ...styles.container, display: "grid", gap: 16 }}>
          <div style={{ ...styles.card, display: "grid", gap: 12 }}>
            <ContextualAssignmentSubmissionPage submissionContext={submissionContext} />
          </div>
        </div>
      ) : null}
    </>
  );
}

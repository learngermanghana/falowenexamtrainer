import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
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

const getLegacyButtons = (root) => Array.from(root?.querySelectorAll("button") || [])
  .filter((button) => !button.closest("[data-workbook-tab-navigation]"));

const findLegacyButton = (root, tabKey) => {
  const matcher = tabMatchers[tabKey];
  if (!matcher) return null;
  return getLegacyButtons(root).find((button) => matcher(normalizeLabel(button.textContent))) || null;
};

const findLegacyNavigation = (root) => {
  if (!root) return null;

  const labelledNav = root.querySelector('[aria-label="Workbook parts navigation"]');
  if (labelledNav && !labelledNav.closest("[data-workbook-tab-navigation]")) return labelledNav;

  const groups = Array.from(root.querySelectorAll("div"));
  return groups.find((group) => {
    if (group.closest("[data-workbook-tab-navigation]")) return false;
    const directButtons = Array.from(group.children || []).filter((child) => child.tagName === "BUTTON");
    if (directButtons.length < 5) return false;
    const labels = directButtons.map((button) => normalizeLabel(button.textContent));
    return labels.some((label) => label === "Grammar")
      && labels.some((label) => label.startsWith("Teil 1"))
      && labels.some((label) => label.startsWith("Teil 4"));
  }) || null;
};

const hideLegacyNavigation = (root) => {
  const legacyNav = findLegacyNavigation(root);
  if (!legacyNav) return;

  legacyNav.style.display = "none";
  const status = legacyNav.nextElementSibling;
  if (status?.tagName === "P") {
    const statusText = normalizeLabel(status.textContent);
    if (/^Tab \d+ of \d+$/i.test(statusText) || /^\d+\./.test(statusText)) {
      status.style.display = "none";
    }
  }
};

const ensureNavHost = (root) => {
  if (!root) return null;
  const existing = root.querySelector("[data-a2-standard-nav-host]");
  if (existing) return existing;

  const legacyNav = findLegacyNavigation(root);
  const headerCard = legacyNav?.parentElement || root.firstElementChild?.firstElementChild;
  if (!headerCard) return null;

  const host = document.createElement("div");
  host.setAttribute("data-a2-standard-nav-host", "true");
  host.style.width = "100%";
  host.style.margin = "0";

  if (legacyNav?.parentElement === headerCard) {
    headerCard.insertBefore(host, legacyNav);
  } else {
    headerCard.appendChild(host);
  }
  return host;
};

export default function A2LegacyStandardWorkbookNavBridge({
  legacyRootRef,
  day,
  chapter,
  workbookId,
}) {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [legacyHasSubmit, setLegacyHasSubmit] = useState(true);
  const [navHost, setNavHost] = useState(null);

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
      const host = ensureNavHost(root);
      if (host && host !== navHost) setNavHost(host);
      hideLegacyNavigation(root);
      setLegacyHasSubmit(Boolean(findLegacyButton(root, "submit")));
    };

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      const host = root.querySelector("[data-a2-standard-nav-host]");
      if (host) host.remove();
    };
  }, [legacyRootRef, navHost]);

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
      {navHost ? createPortal(
        <WorkbookTabNav
          activeTab={activeTab}
          onChange={changeTab}
          tabs={A2_B1_WORKBOOK_TABS_WITH_GRAMMAR}
          ariaLabel={`A2 Day ${day} workbook sections`}
          renderLegacyGrammarPanel={false}
        />,
        navHost,
      ) : null}

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
